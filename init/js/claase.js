class Pierrre {
    constructor(param, equipe, couleur) {
        this.equipe = equipe;
        this.pierre = new Pierre(param);
        this.couleur = couleur;
        this.taille = param.taille;
        this.distance = null;
        this.lancer = false;
        this.hors_piste = false;
        this.rayon = new THREE.Vector3(this.pierre.position.x, this.pierre.position.y, this.pierre.position.z).distanceTo(this.pierre.children[2].geometry.vertices[0]);// diametre du lathe du palet arrondie car pas une sphere
    }


    deplacementRectiligne( distance,intensite) {
        let departx = this.pierre.position.x;//point de depart X
        let departy = this.pierre.position.y;//point de depart Y
        let points = [];// stockage des points
        let arrivex = (distance / 10 * vectcentreMaison.x + (Math.random() < 0.5 ? -0.1 : 0.1)) * 2;// on rajoute de l'aléatoir avec random
        let arrivey = vectcentreMaison.y + (Math.random() < 0.5 ? -0.1 : 0.1) * Math.random()*intensite*10;// de meme ici
        let X = departx;
        let Y = departy;
        let i;
        for (i = 0; i < 150; i++) {// creation des points pour le deplacement rectiligne
            if (i <= 75) {// au debut du lancer le deplacement est rapide donc l'intervalle est grande entre les points
                points.push(new THREE.Vector3(X, Y, 0.01));
                X += arrivex / 150;
                Y += arrivey / 150;
            }
            if (i > 75 && i <= 125) {// a partir du milieu pour ralentir le deplacement on double les points et les intervalles sont plus courte aussi
                if (i % 2 === 0) {
                    points.push(new THREE.Vector3(X, Y, 0.01));
                    X += arrivex / 250;
                    Y += arrivey / 250;
                    points.push(new THREE.Vector3(X, Y, 0.01));
                    X += arrivex / 250;
                    Y += arrivey / 250;

                }
            }
            if (i > 125) {// a partir de 5/6 ieme du deplacement on le ralentit encore plus en ajoutant 3 fois plus de points
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
        console.log(points.length)
        let line = segment(points[0], points[points.length - 1], "black", 1);// creation de la ligne qui sera affiché dans le visuel pour montrer la trajectoire
        line.position.z = 0.01;// on sureleve un peu pour qu'il soit visible
        return [line, points];
    }

    deplacementBezier(distance, intensite) {
        let departx = this.pierre.position.x;
        let departy = this.pierre.position.y;
        let arrivex = distance / 100 * vectcentreMaison.x + (Math.random() < 0.5 ? -0.1 : 0.1);
        let arrivey = vectcentreMaison.y + (Math.random() < 0.5 ? -0.1 : 0.1);
        let milieux = (departx + arrivex) / 2;
        let milieuy = (departy + arrivey) / 2;


        const curve1 = new THREE.QuadraticBezierCurve(
            new THREE.Vector2(departx, departy),
            new THREE.Vector2(milieux / 2, (paramPiste.largeur + piste.position.y) * intensite),
            new THREE.Vector2(milieux, milieuy)
        );

        const curve2 = new THREE.QuadraticBezierCurve(
            new THREE.Vector2(milieux, milieuy),
            new THREE.Vector2(milieux * 1.5, -(paramPiste.largeur + piste.position.y) * intensite),
            new THREE.Vector2(arrivex, arrivey)
        );

        const points1 = curve1.getPoints(150);
        const points2 = curve2.getPoints(300);

        const curveObject = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points1), new THREE.LineBasicMaterial({color: 0x0}));
        const curveObject1 = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points2), new THREE.LineBasicMaterial({color: 0x0}));

        let groupe = new THREE.Group();
        groupe.add(curveObject);
        groupe.add(curveObject1);
        groupe.position.z = 0.03;
        let points = []
        let i;
        for (i = 0; i < points1.length; i++) {
            if (i < 75) {
                points.push(points1[i]);
            } else {
                if (i % 1.5 === 0) {
                    points.push(points1[i]);
                }
            }
        }
        for (i = 0; i < points2.length; i++) {
            if (i < 100) {
                if (i % 6 === 0) {
                    points.push(points2[i]);
                }
            }
            if (i >= 100 && i <= 250) {
                if (i % 2 === 0) {
                    points.push(points2[i]);
                }
            }
            if (i > 250) {
                points.push(points2[i]);
            }
        }
        console.log(points)

        return [groupe, points];
    }


    deplacement(points) {
        this.pierre.position.x = points.x;
        this.pierre.position.y = points.y;
    }
}

