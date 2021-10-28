

function Piste(longueur,largeur,texturepiste) {
    const geometrypiste = new THREE.CubeGeometry( longueur,largeur ,0.01 );
    const materialpiste = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, map:texturepiste} );
    const plane = new THREE.Mesh( geometrypiste, materialpiste );
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    //creation de 4 disque pour faire la maison
    let inside = largeur* 0.60/2;// variable qui permet de savoir l'interieur du disque
    let outside =  largeur* 0.90/2;// variable qui permet de savoir l'exterieur du disque
    const geometrydisque1 = new THREE.RingGeometry( inside,outside,150 );
    const materialdisque1 = new THREE.MeshPhongMaterial( { color: 'blue',side: THREE.DoubleSide } );
    const circle1 = new THREE.Mesh( geometrydisque1, materialdisque1 );
    circle1.position.x = longueur/2+ plane.position.x-longueur/10;
    circle1.position.y = plane.position.y;
    circle1.position.z = 0.01;
    const geometrydisque2 = new THREE.RingGeometry( inside/1.5,outside/1.5,150 );
    const materialdisque2 = new THREE.MeshPhongMaterial( { color: 'white',side: THREE.DoubleSide } );
    const circle2 = new THREE.Mesh( geometrydisque2, materialdisque2 );
    circle2.position.x = longueur/2+ plane.position.x-longueur/10;
    circle2.position.y = plane.position.y;
    circle2.position.z = 0.01;
    const geometrydisque3 = new THREE.RingGeometry( inside/2/2,outside/1.5/1.5,150 );
    const materialdisque3 = new THREE.MeshPhongMaterial( { color: 'red',side: THREE.DoubleSide } );
    const circle3 = new THREE.Mesh( geometrydisque3, materialdisque3 );
    circle3.position.x = longueur/2+ plane.position.x-longueur/10;
    circle3.position.y = plane.position.y;
    circle3.position.z = 0.01;
    const geometrydisque4 = new THREE.CircleGeometry( outside/2/2/1.5,150 );
    const materialdisque4 = new THREE.MeshPhongMaterial( { color: 'white',side: THREE.DoubleSide } );
    const circle4 = new THREE.Mesh( geometrydisque4, materialdisque4 );
    circle4.position.x = longueur/2+ plane.position.x-longueur/10;
    circle4.position.y = plane.position.y;
    circle4.position.z = 0.01;
    //creation du groupe pour tous les objets
    const group = new THREE.Group();
    group.add(plane);
    group.add(circle1);
    group.add(circle2);
    group.add(circle3);
    group.add(circle4);

    return group;
}

function Balai(hauteur, rayon, texture){
    const geometry_manche = new THREE.CylinderGeometry(rayon, rayon/1.5,hauteur,100);
    const mesh_manche = new THREE.MeshPhongMaterial({map: texture ,side: THREE.DoubleSide});
    const manche = new THREE.Mesh(geometry_manche,mesh_manche);
    console.log(geometry_manche);
    manche.rotation.x = Math.PI/2;
    return manche;
}

