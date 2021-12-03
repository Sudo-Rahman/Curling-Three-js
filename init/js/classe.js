class Pierrre {
    constructor(param, equipe, couleur) {
        this.equipe = equipe; //Pour savoir à quelle équipe appartient la pierre
        this.pierre = new Pierre(param); //Création de la pierre physique
        this.couleur = couleur; //Couleur centrale de la pierre
        this.taille = param.taille; //Modificateur de la taille de la pierre
        this.distance = null; //Distance à la maison
        this.lancer = false; //Savoir si la pierre a été lancée ou non
        this.hors_piste = false;//Savoir si la pierre est hors de la piste
        this.rayon = new THREE.Vector3(this.pierre.position.x, this.pierre.position.y, this.pierre.position.z).distanceTo(this.pierre.children[2].geometry.vertices[0]); //Rayon de la lathe du palet avec une approximation (vu que ce n'est pas une sphere parfaite)
    }


    deplacementRectiligne(distance, intensite) {
        let departx = this.pierre.position.x; //Point de depart X
        let departy = this.pierre.position.y; //Point de depart Y
        let points = [];// stockage des points
        let arrivex = (distance / 10 * vectcentreMaison.x + (Math.random() < 0.5 ? -0.1 : 0.1)) * 2; //Rajoute de l'aléatoire avec random
        let arrivey = vectcentreMaison.y + intensite * 3;
        let X = departx;
        let Y = departy;
        let i;
        for (i = 0; i < 150; i++) { //Création des points pour le déplacement rectiligne
            if (i <= 75) { //Au début du lancer, le déplacement est rapide, donc l'interval entre les points est grande 
                points.push(new THREE.Vector3(X, Y, 0.01));
                X += arrivex / 150;
                Y += arrivey / 150;
            }
            if (i > 75 && i <= 125) { //À partir du milieu, on double les points et les intervalles sont plus courts pour ralentir le déplacement 
                if (i % 2 === 0) {
                    points.push(new THREE.Vector3(X, Y, 0.01));
                    X += arrivex / 250;
                    Y += arrivey / 250;
                    points.push(new THREE.Vector3(X, Y, 0.01));
                    X += arrivex / 250;
                    Y += arrivey / 250;

                }
            }
            if (i > 125) { //À partir du 5/6ième du déplacement, on le ralentit encore en ajoutant 3 fois plus de points
                points.push(new THREE.Vector3(X, Y, 0.01));
                X += arrivex / 350;
                Y += arrivey / 350;
                points.push(new THREE.Vector3(X, Y, 0.01));
                X += arrivex / 350;
                Y += arrivey / 350;
                points.push(new THREE.Vector3(X, Y, 0.01));
                X += arrivex / 350;
                Y += arrivey / 350;
            }
        }
        // console.log(points.length)
        let line = segment(points[0], points[points.length - 1], "black", 1); //Création de la ligne qui sera affichée dans la scène pour montrer la trajectoire
        line.position.z = 0.01; //On la surélève un peu pour qu'elle soit visible
        return [line, points];
    }

    deplacementBezier(distance, intensite) {
        let departx = this.pierre.position.x;
        let departy = this.pierre.position.y;
        let arrivex = distance / 100 * vectcentreMaison.x + (Math.random() < 0.5 ? -0.1 : 0.1);
        let arrivey = vectcentreMaison.y + (Math.random() < 0.5 ? -0.1 : 0.1);
        let milieux = (departx + arrivex) / 2;
        let milieuy = (departy + arrivey) / 2;

        //Création de la prèmiere courbe de Bézier
        const curve1 = new THREE.QuadraticBezierCurve(
            new THREE.Vector2(departx, departy),
            new THREE.Vector2(milieux / 2, (paramPiste.largeur + piste.position.y) * intensite),
            new THREE.Vector2(milieux, milieuy) //Jointure G1
        );

        //Création de la seconde courbe de Bézier
        const curve2 = new THREE.QuadraticBezierCurve(
            new THREE.Vector2(milieux, milieuy), //Jointure G1
            new THREE.Vector2(milieux * 1.5, -(paramPiste.largeur + piste.position.y) * intensite), //Le point de controle est aligné avec la jointure G1 et avec le point de contrôle de la première courbe de Bézier
            new THREE.Vector2(arrivex, arrivey)
        );

        //Création des points
        const points1 = curve1.getPoints(150);
        const points2 = curve2.getPoints(300);

        //Créations des lignes qui seront affichées dans la scène
        const curveObject = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points1), new THREE.LineBasicMaterial({color: 0x0}));
        const curveObject1 = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points2), new THREE.LineBasicMaterial({color: 0x0}));

        //Regroupement des deux lignes
        let groupe = new THREE.Group();
        groupe.add(curveObject);
        groupe.add(curveObject1);
        groupe.position.z = 0.03;
        let points = [];
        //Répartitions des points comme dans le lancer rectiligne pour faire ralentir le lancer au fur et à mesure
        for (let i = 0; i < points1.length; i++) {
            points.push(points1[i]);
        }
        for (let i = 0; i < points2.length; i++) {
            if (i < 200) {
                if (i % 2 === 0) {
                    points.push(points2[i]);
                }
            }
            if (i >= 200) {
                points.push(points2[i]);
            }
        }
        // console.log(points)

        return [groupe, points];
    }

    deplacementBezier2(distance, intensite) {
        let departx = this.pierre.position.x;
        let departy = this.pierre.position.y;
        let arrivex = distance / 100 * vectcentreMaison.x + (Math.random() < 0.5 ? -0.1 : 0.1);
        let arrivey = vectcentreMaison.y + (Math.random() < 0.5 ? -0.1 : 0.1);


        const curve = new THREE.QuadraticBezierCurve(
            new THREE.Vector2(departx, departy),
            new THREE.Vector2(arrivex / 2, (paramPiste.largeur + piste.position.y) * intensite),
            new THREE.Vector2(arrivex, arrivey)
        );
        const points1 = curve.getPoints(500);
        const curveObject = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points1), new THREE.LineBasicMaterial({color: 0x0}));
        curveObject.position.z = 0.03;
        let points = [];
        for (let i = 0; i < points1.length; i++) {
            if (i < 100) {
                if (i % 3 === 0) {
                    points.push(points1[i]);
                }
            } else {
                if (i >= 100 && i < 250) {
                    if (i % 2 === 0) {
                        points.push(points1[i]);
                    }
                } else {
                    points.push(points1[i]);
                }
            }
        }
        return [curveObject, points];

    }

    //Fonction qui réalise le déplacement de la pierre
    deplacement(points) {
        this.pierre.position.x = points.x;
        this.pierre.position.y = points.y;
    }
}

