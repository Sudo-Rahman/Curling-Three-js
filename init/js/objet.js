

function Piste(param) {
    const geometrypiste = new THREE.CubeGeometry( param.longueur,param.largeur ,0.01 );
    const materialpiste = new THREE.MeshPhongMaterial( { color: param.coul,side: THREE.DoubleSide, map:param.texture,   emissiveMap:0x000,
        flatShading: true,} );
    const plane = new THREE.Mesh( geometrypiste, materialpiste );
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    //creation de 4 disque pour faire la maison
    let inside = param.largeur* 0.60/2;// variable qui permet de savoir l'interieur du disque
    let outside =  param.largeur* 0.90/2;// variable qui permet de savoir l'exterieur du disque
    const geometrydisque1 = new THREE.RingGeometry( inside,outside,150 );
    const materialdisque1 = new THREE.MeshPhongMaterial( { color: 'blue',side: THREE.DoubleSide } );
    const circle1 = new THREE.Mesh( geometrydisque1, materialdisque1 );
    circle1.position.x = param.longueur/2+ plane.position.x-param.longueur/10;
    circle1.position.y = plane.position.y;
    circle1.position.z = 0.01;
    const geometrydisque2 = new THREE.RingGeometry( inside/1.5,outside/1.5,150 );
    const materialdisque2 = new THREE.MeshPhongMaterial( { color: 'white',side: THREE.DoubleSide } );
    const circle2 = new THREE.Mesh( geometrydisque2, materialdisque2 );
    circle2.position.x = param.longueur/2+ plane.position.x-param.longueur/10;
    circle2.position.y = plane.position.y;
    circle2.position.z = 0.01;
    const geometrydisque3 = new THREE.RingGeometry( inside/2/2,outside/1.5/1.5,150 );
    const materialdisque3 = new THREE.MeshPhongMaterial( { color: 'red',side: THREE.DoubleSide } );
    const circle3 = new THREE.Mesh( geometrydisque3, materialdisque3 );
    circle3.position.x = param.longueur/2+ plane.position.x-param.longueur/10;
    circle3.position.y = plane.position.y;
    circle3.position.z = 0.01;
    const geometrydisque4 = new THREE.CircleGeometry( outside/2/2/1.5,150 );
    const materialdisque4 = new THREE.MeshPhongMaterial( { color: 'white',side: THREE.DoubleSide } );
    const circle4 = new THREE.Mesh( geometrydisque4, materialdisque4 );
    circle4.position.x = param.longueur/2+ plane.position.x-param.longueur/10;
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

function Balai(param){
    const geometry_manche = new THREE.CylinderGeometry(param.rayon, param.rayon/1.5,param.hauteur,100);
    const mesh_manche = new THREE.MeshPhongMaterial({color: param.coulbalai,map: param.texture ,side: THREE.DoubleSide});
    const manche = new THREE.Mesh(geometry_manche,mesh_manche);
    manche.rotation.x = Math.PI/2;

    const geometry = new THREE.BoxGeometry( param.longRec, param.largRec, param.hauteurRec );
    const material = new THREE.MeshBasicMaterial( {color: param.coulrec,side: THREE.DoubleSide} );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.x = manche.position.x;
    cube.position.y = manche.position.y;
    cube.position.z = -param.hauteur/2;

    const group = new THREE.Group();

    //creation des poils
    for (i = 0; i< param.nbPoils; i ++){
        const geometrypoile = new THREE.CylinderGeometry( 0.01, 0, 0.05, 16 );
        const materialpoile = new THREE.MeshBasicMaterial( {color: param.coulPoils,side: THREE.DoubleSide} );
        const cylinder = new THREE.Mesh( geometrypoile, materialpoile );
        cylinder.position.x = Math.random() * param.longRec*0.95-param.longRec*0.95/2;// on calcule une positions x aleatoire en prenant des marge aux bords
        cylinder.position.y = Math.random() * param.largRec* 0.95-param.largRec*0.95/2;// on calcule une positions y aleatoire en prenant des marge aux bords
        cylinder.position.z = -param.hauteur/2-param.hauteurRec;// on positionnes les connes en dessous du balai
        cylinder.rotation.x = Math.PI/2;// on retourne les code de 90°
        group.add(cylinder);
    }
    group.add(manche);
    group.add(cube);
    return group;

}

