function Piste(longueur, largeur, texture){
    const geometrypiste = new THREE.CubeGeometry( longueur,largeur ,0.01 );
    const materialpiste = new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, map:texture} );
    const plane = new THREE.Mesh( geometrypiste, materialpiste );
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    const geometrydisque1 = new THREE.CircleGeometry( largeur/3, 150 );
    const materialdisque1 = new THREE.MeshBasicMaterial( { color: 'blue',side: THREE.DoubleSide } );
    const circle1 = new THREE.Mesh( geometrydisque1, materialdisque1 );
    circle1.position.x = longueur/2+ plane.position.x-longueur/10;
    circle1.position.y = plane.position.y;
    circle1.position.z = 0.01;
    const geometrydisque2 = new THREE.CircleGeometry( largeur/4, 150 );
    const materialdisque2 = new THREE.MeshBasicMaterial( { color: 'white',side: THREE.DoubleSide } );
    const circle2 = new THREE.Mesh( geometrydisque2, materialdisque2 );
    circle2.position.x = longueur/2+ plane.position.x-longueur/10;
    circle2.position.y = plane.position.y;
    circle2.position.z = 0.0101;
    const geometrydisque3 = new THREE.CircleGeometry( largeur/6, 150 );
    const materialdisque3 = new THREE.MeshBasicMaterial( { color: 'red' ,side: THREE.DoubleSide} );
    const circle3 = new THREE.Mesh( geometrydisque3, materialdisque3 );
    circle3.position.x = longueur/2+ plane.position.x-longueur/10;
    circle3.position.y = plane.position.y;
    circle3.position.z = 0.0110;
    const geometrydisque4 = new THREE.CircleGeometry( largeur/10, 150 );
    const materialdisque4 = new THREE.MeshBasicMaterial( { color: 'white',side: THREE.DoubleSide } );
    const circle4 = new THREE.Mesh( geometrydisque4, materialdisque4 );
    circle4.position.x = longueur/2+ plane.position.x-longueur/10;
    circle4.position.y = plane.position.y;
    circle4.position.z = 0.0111;

    const group = new THREE.Group();
    group.add(plane);
    group.add(circle1);
    group.add(circle2);
    group.add(circle3);
    group.add(circle4);

    return group;
}

