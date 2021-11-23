class Pierrre {
    constructor(param, equipe, couleur) {
        this.equipe = equipe;
        this.pierre = new Pierre(param);
        this.couleur = couleur;
        this.taille = param.taille;
        this.distance = null;
        this.lancer = false;
    }


    deplacementRectiligne(maisonCentre, distance) {
        let departx = this.pierre.position.x;//point de depart X
        let departy = this.pierre.position.y;//point de depart Y
        let points = [];// stockage des points
        let arrivex = (distance / 10 * maisonCentre.x + (Math.random() < 0.5 ? -0.1 : 0.1)) * 2;// on rajoute de l'aléatoir avec random
        let arrivey = maisonCentre.y + (Math.random() < 0.5 ? -0.1 : 0.1) * Math.random();// de meme ici
        let X = departx;
        let Y = departy;
        let i;
        for (i = 0; i < 150; i++) {// creation de 150 points
            if (i > 75 && i <= 125) {
                if (i % 2 === 0) {
                    points.push(new THREE.Vector3(X, Y, 0.01));
                }
            } if(i>125) {
                points.push(new THREE.Vector3(X, Y, 0.01));
            }
            points.push(new THREE.Vector3(X, Y, 0.01));
            X += arrivex / 150;
            Y += arrivey / 150;
        }
        console.log(points.length)
        let line = segment(points[0], points[points.length - 1], "black", 1);// creation de la ligne qui sera affiché dans le visuel pour montrer la trajectoire
        line.position.z = 0.01;// on sureleve un peu pour qu'il soit visible
        return [line, points];
    }

    deplacementBezier(paraPiste, piste, maisonCentre, distance, intensite) {
        let departx = this.pierre.position.x;
        let departy = this.pierre.position.y;
        let arrivex = distance / 100 * maisonCentre.x + (Math.random() < 0.5 ? -0.1 : 0.1);
        let arrivey = maisonCentre.y + (Math.random() < 0.5 ? -0.1 : 0.1);
        let milieux = (departx + arrivex) / 2;
        let milieuy = (departy + arrivey) / 2;


        const curve1 = new THREE.QuadraticBezierCurve(
            new THREE.Vector2(departx, departy),
            new THREE.Vector2(milieux / 2, (paraPiste.largeur + piste.position.y) * intensite),
            new THREE.Vector2(milieux, milieuy)
        );

        const curve2 = new THREE.QuadraticBezierCurve(
            new THREE.Vector2(milieux, milieuy),
            new THREE.Vector2(milieux * 1.5, -(paraPiste.largeur + piste.position.y) * intensite),
            new THREE.Vector2(arrivex, arrivey)
        );

        const points1 = curve1.getPoints(150);
        const points2 = curve2.getPoints(150);

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
                if (i % 3 === 0) {
                    points.push(points1[i]);
                }
            }
        }
        for (i = 0; i < points2.length; i++) {
            if (i < 50) {
                if (i % 2 === 0) {
                    points.push(points2[i]);
                }
            } else {
                points.push(points2[i]);
            }
        }

        return [groupe, points];
    }


    deplacement(points) {
        this.pierre.position.x = points.x;
        this.pierre.position.y = points.y;
    }
}

