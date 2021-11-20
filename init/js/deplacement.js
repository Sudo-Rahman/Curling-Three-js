function deplacementRectiligne(pierre, force) {
    let departx = pierre.position.x;
    let departy = pierre.position.y;
    pierre.position.x += force * 0.5;
}

function deplacementBezier(pierre, paraPiste,piste, maisonCentre, force,intensite) {
    let departx = pierre.position.x;
    let departy = pierre.position.y;
    let arrivex = maisonCentre.x + (Math.random() < 0.5 ? -0.1 : 0.1);
    let arrivey = maisonCentre.y + (Math.random() < 0.5 ? -0.1 : 0.1);
    let milieux = (departx +arrivex) / 2;
    let milieuy = (departy +arrivey) / 2;


    const curve1 = new THREE.QuadraticBezierCurve(
        new THREE.Vector2(departx, departy),
        new THREE.Vector2(milieux/2, (paraPiste.largeur + piste.position.y)* intensite),
        new THREE.Vector2(milieux, milieuy)
    );

    const curve2 = new THREE.QuadraticBezierCurve(
        new THREE.Vector2(milieux, milieuy),
        new THREE.Vector2(milieux*1.5, -(paraPiste.largeur + piste.position.y)* intensite),
        new THREE.Vector2(arrivex, arrivey)
    );

    const points1 = curve1.getPoints(150);
    const points2 = curve2.getPoints(150);

    const curveObject = new THREE.Line( new THREE.BufferGeometry().setFromPoints( points1), new THREE.LineBasicMaterial( { color : 0xff0000 } ) );
    const curveObject1 = new THREE.Line( new THREE.BufferGeometry().setFromPoints( points2 ), new THREE.LineBasicMaterial( { color : 0xff0000 } ) );

    let groupe = new THREE.Group();
    groupe.add(curveObject);
    groupe.add(curveObject1);
    let points = []
    for (i = 0; i < points1.length; i++) {
        points.push(points1[i])
    }
    for (i = 0; i < points2.length; i++) {
        points.push(points2[i])
    }
    console.log(points);


// Create the final object to add to the scene
    return [groupe,points];
}

function deplacement_bezier_pierre(pierre, points){
    pierre.position.x = points.x;
    pierre.position.y = points.y;
}

