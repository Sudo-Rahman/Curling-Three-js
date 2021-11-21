class Pierrre {
    constructor(param, equipe, couleur) {
        this.equipe = equipe;
        this.pierre = new Pierre(param);
        this.couleur = couleur;
        this.taille = param.taille;
        this.distance = null;
    }


    deplacementRectiligne(maisonCentre, distance) {
        let departx = this.pierre.position.x;
        let departy = this.pierre.position.y;
        let points = [];
        let arrivex = (distance / 10 * maisonCentre.x + (Math.random() < 0.5 ? -0.1 : 0.1)) * 2;
        let arrivey = maisonCentre.y + (Math.random() < 0.5 ? -0.1 : 0.1);
        let X = departx;
        let Y = departy;
        let i;
        for (i = 0; i < 150; i++) {
            points.push(new THREE.Vector3(X, Y, 0.01))
            X += arrivex / 150;
            Y += arrivey / 150;
        }
        let line = segment(points[0], points[149], "black", 1);
        line.position.z = 0.01;
        return [line, points];
    }

    deplacementBezier(paraPiste, piste, maisonCentre, distance, intensite) {
        console.log(distance)
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
        console.log(points);

        return [groupe, points];
    }


    deplacement(points) {
        this.pierre.position.x = points.x;
        this.pierre.position.y = points.y;
    }
}

