//############ La création des objets a nécessité des valeurs prédefinies, on les a choisis aléatoirement, ###############
//############## à part pour les lathes de Bézier et les points de jointure qui ont été fait sur feuille et reportés ici ############
// creation de la piste
function Piste(param) {
    const geometrypiste = new THREE.CubeGeometry(param.longueur, param.largeur, 0.01);
    const materialpiste = new THREE.MeshPhongMaterial({
        color: param.coul, emissive: 0x0, shininess: 100,
    });
    const plane = new THREE.Mesh(geometrypiste, materialpiste);
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    const A = new THREE.Vector3(plane.position.x - 0.70 * (param.longueur / 2), plane.position.y - param.largeur / 2, 0);
    const B = new THREE.Vector3(plane.position.x - 0.70 * (param.longueur / 2), plane.position.y + param.largeur / 2, 0);


    const line = segment(A, B, "black", 5); //Construction de la ligne de départ
    line.position.z = 0.01; //Surélévation de la ligne pour l'apercevoir sur la piste

    //Création de quatre disques constituant faire la maison
    let inside = param.largeur * 0.60 / 2; //Variable qui permet de connaitre la distance interieur du RingGeometry au niveau des bords de la piste
    let outside = param.largeur * 0.90 / 2; //Variable qui permet de connaitre la distance exterieur du RingGeometry au niveau des bords de la piste
    const geometrydisque1 = new THREE.RingGeometry(inside, outside, 150);
    const materialdisque1 = new THREE.MeshPhongMaterial({color: 'blue', side: THREE.DoubleSide, specular: 0x111111});
    const circle1 = new THREE.Mesh(geometrydisque1, materialdisque1);
    circle1.position.x = param.longueur / 2 + plane.position.x - param.largeur / 1.8;
    circle1.position.y = plane.position.y;
    circle1.position.z = 0.01;
    const geometrydisque2 = new THREE.RingGeometry(inside / 1.5, outside / 1.5, 150);
    const materialdisque2 = new THREE.MeshPhongMaterial({color: 'white', side: THREE.DoubleSide, specular: 0x111111});
    const circle2 = new THREE.Mesh(geometrydisque2, materialdisque2);
    circle2.position.x = param.longueur / 2 - param.largeur / 1.8;
    circle2.position.y = plane.position.y;
    circle2.position.z = 0.01;
    const geometrydisque3 = new THREE.RingGeometry(inside / 2 / 2, outside / 1.5 / 1.5, 150);
    const materialdisque3 = new THREE.MeshPhongMaterial({color: 'red', side: THREE.DoubleSide, specular: 0x111111});
    const circle3 = new THREE.Mesh(geometrydisque3, materialdisque3);
    circle3.position.x = param.longueur / 2 - param.largeur / 1.8;
    circle3.position.y = plane.position.y;
    circle3.position.z = 0.01;
    const geometrydisque4 = new THREE.CircleGeometry(outside / 2 / 2 / 1.5, 150);
    const materialdisque4 = new THREE.MeshPhongMaterial({color: 'white', side: THREE.DoubleSide, specular: 0x111111});
    const circle4 = new THREE.Mesh(geometrydisque4, materialdisque4);
    circle4.position.x = param.longueur / 2 - param.largeur / 1.8;
    circle4.position.y = plane.position.y;
    circle4.position.z = 0.01;


    //Création du groupe pour tous les objets
    const group = new THREE.Group();
    group.add(plane);
    group.add(line);
    group.add(circle1);
    group.add(circle2);
    group.add(circle3);
    group.add(circle4);
    //On boucle sur tous les materiaux des objets pour activer les ombres et les brillances
    for (let i = 0; i < group.children.length; i++) {
        group.children[i].receiveShadow = true;
        group.children[i].material.emissive = 0x0;
        group.children[i].material.shininess = 100;
    }
    return [group,circle4];
}

//Création de l'objet balai
function Balai(param) {
    const geometry_manche = new THREE.CylinderGeometry(param.rayon, param.rayon / 1.5, param.hauteur, 100);
    const mesh_manche = new THREE.MeshPhongMaterial({
        color: param.coulbalai,
        //map: param.texture,
        side: THREE.DoubleSide
    });
    const manche = new THREE.Mesh(geometry_manche, mesh_manche);
    manche.rotation.x = Math.PI / 2;

    const geometry = new THREE.BoxGeometry(param.longRec, param.largRec, param.hauteurRec);
    const material = new THREE.MeshPhongMaterial({color: param.coulrec, depthWrite: false});
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = manche.position.x;
    cube.position.y = manche.position.y;
    cube.position.z = -param.hauteur / 2;

    const group = new THREE.Group();

    //Création des poils
    for (let i = 0; i < param.nbPoils; i++) {
        const geometrypoile = new THREE.CylinderGeometry(0.01, 0, 0.05, 16);
        const materialpoile = new THREE.MeshPhongMaterial({
            color: param.coulPoils,
            side: THREE.DoubleSide,
            specular: 0x111111
        });
        const cylinder = new THREE.Mesh(geometrypoile, materialpoile);
        cylinder.position.x = Math.random() * param.longRec * 0.95 - param.longRec * 0.95 / 2;// on calcule une positions x aleatoire en prenant des marge aux bords
        cylinder.position.y = Math.random() * param.largRec * 0.95 - param.largRec * 0.95 / 2;// on calcule une positions y aleatoire en prenant des marge aux bords
        cylinder.position.z = -param.hauteur / 2 - param.hauteurRec;// on positionnes les connes en dessous du balai
        cylinder.rotation.x = Math.PI / 2;// on retourne les code de 90°
        group.add(cylinder);
    }
    group.add(manche);
    group.add(cube);
    //on boucle sur tous les material des objet pour qu'il crée des ombres au contacte de la lumiere
    for (let i = 0; i < group.children.length; i++) {
        group.children[i].castShadow = true;
    }
    return group;

}

//Création de la pierre
function Pierre(param) {
    //creation d'un disque qui sera le bas de la pierre
    const surface_bas_circle = new THREE.Mesh(new THREE.CircleGeometry(0.05 + param.taille * 0.3, 256), new THREE.MeshPhongMaterial({
        color: param.coul,
        side: THREE.DoubleSide,
        specular: 0x111111
    }));
    // on le placce en 0, 0, 0
    surface_bas_circle.position.x = 0;
    surface_bas_circle.position.y = 0;
    surface_bas_circle.position.z = 0;

    //#################              IMPORTANT           #######################
    //Chaque objet a des valeurs classiques et un multiplicateur qui servira à modifier la taille des objets 
    //Création du point de départ, de deux points de contrôle P1, P2 et du point d'arrivée G1 (qui servira aussi de jointure)
    let P0 = new THREE.Vector3(0.05 + param.taille * 0.3, 0, 0);
    let P1 = new THREE.Vector3(param.taille * 1.35, param.taille * 0.2, 0);
    let P2 = new THREE.Vector3(param.taille * 1.3, param.taille * 0.6, 0);
    let G1 = new THREE.Vector3(param.taille * 1.3, param.taille * 0.6, 0);
    let cbeBez = new THREE.CubicBezierCurve3(P0, P1, P2, G1);
    const points = cbeBez.getPoints(15);
    const surface_bas = new THREE.Mesh(new THREE.LatheGeometry(points, 150, 0, 2 * Math.PI), new THREE.MeshPhongMaterial({
        color: param.coul,
        side: THREE.DoubleSide,
        specular: 0x111111
    })); //Création de la lathe
    surface_bas.rotation.x = Math.PI / 2; //On tourne l'objet pour qu'il soit à l'horizontal
    surface_bas.position.z = 0;

    //Création de la tranche du milieu qui sera d'une couleur différente des deux autres surfaces de révolution
    //Utilisation du point G1 comme point de départ, création de deux points de contrôle A1, A2 et du point d'arrivée G2 (qui servira aussi de jointure pour la prochaine surface de révolution qui complètera la pierre)
    let A1 = new THREE.Vector3(param.taille * 1.3, param.taille * 0.6, 0);
    let A2 = new THREE.Vector3(param.taille * 1.3, param.taille * 0.6, 0);
    let G2 = new THREE.Vector3(param.taille * 1.3, param.taille * 0.8, 0);
    let cbeBezA = new THREE.CubicBezierCurve3(G1, A1, A2, G2);
    const pointsA = cbeBezA.getPoints(15);
    const surface_milieu = new THREE.Mesh(new THREE.LatheGeometry(pointsA, 150, 0, 2 * Math.PI), new THREE.MeshPhongMaterial({
        color: param.coulCentre,
        side: THREE.DoubleSide,
        specular: 0x111111
    }));
    surface_milieu.rotation.x = Math.PI / 2; //On tourne l'objet pour qu'il soit à l'horizontal
    surface_milieu.position.z = 0;

    //Création de la seconde surface de révolution
    //Utilisation du point de jointure G2, création de deux points de contrôle M1, M2 et du point d'arrivée M0
    let M0 = new THREE.Vector3(0.05 + param.taille * 0.3, param.taille * 0.6 + G2.y, 0);
    let M1 = new THREE.Vector3(param.taille * 1.3, param.taille * 0.2 + G1.y, 0);
    let M2 = new THREE.Vector3(param.taille * 1.35, param.taille * 0.6 + G1.y, 0);
    let cbeBezM = new THREE.CubicBezierCurve3(G2, M1, M2, M0);
    const pointsM = cbeBezM.getPoints(15);
    const surface_haut = new THREE.Mesh(new THREE.LatheGeometry(pointsM, 150, 0, 2 * Math.PI), new THREE.MeshPhongMaterial({
        color: param.coul,
        side: THREE.DoubleSide,
        specular: 0x111111
    }));
    surface_haut.rotation.x = Math.PI / 2; //On tourne l'objet pour qu'il soit à l'horizontal
    surface_haut.position.z = 0;


    //Création d'un disque qui fermera le haut du disque
    const surface_haut_circle = new THREE.Mesh(new THREE.CircleGeometry(0.05 + param.taille * 0.3, 256), new THREE.MeshPhongMaterial({
        color: param.coul,
        side: THREE.DoubleSide,
        specular: 0x111111
    }));
    surface_haut_circle.position.x = 0;
    surface_haut_circle.position.y = 0;
    surface_haut_circle.position.z = M0.y; //On positionne le disque à la position de hauteur du point M0 pour fermer la lathe


    //Création de l'anse de la pierre grâce à deux cylindres qui sont de dimension 0.2 fois le nombre du GUI
    const endroit_pour_tenir_geometry = new THREE.Mesh(new THREE.CylinderGeometry(param.taille * 0.2, param.taille * 0.2, param.taille * 1.5, 64), new THREE.MeshPhongMaterial({
        color: param.coul_endroit_pour_tenir,
        side: THREE.DoubleSide,
    }));
    endroit_pour_tenir_geometry.position.z = surface_haut_circle.position.z; //Positionnement sur le haut de la pierre
    endroit_pour_tenir_geometry.rotation.x = Math.PI / 2; //On tourne le cylindre à la verticale

    const endroit_pour_tenir_geometry1 = new THREE.Mesh(new THREE.CylinderGeometry(param.taille * 0.2, param.taille * 0.2, param.taille * 1.5, 64), new THREE.MeshPhongMaterial({
        color: param.coul_endroit_pour_tenir,
        side: THREE.DoubleSide,
        specular: 0x111111
    }));
    endroit_pour_tenir_geometry1.position.z = surface_haut_circle.position.z + endroit_pour_tenir_geometry.geometry.parameters.height / 2; //Positionnement sur le premier cylindre
    endroit_pour_tenir_geometry1.position.y = endroit_pour_tenir_geometry1.geometry.parameters.height / 2.6; //Positionne de sorte que le début du cylindre 2 se mette sur le cylindre 1 pour faire une équerre


    //On ajoute les objets dans un groupe pour en faire un seul objet
    const group = new THREE.Group();
    group.add(surface_bas_circle);
    group.add(surface_bas);
    group.add(surface_milieu);
    group.add(surface_haut);
    group.add(surface_haut_circle);
    group.add(endroit_pour_tenir_geometry);
    group.add(endroit_pour_tenir_geometry1);
    //On boucle sur tous les matériaux des objets pour qu'ils crééent des ombres au contact de la lumière
    for (let i = 0; i < group.children.length; i++) {
        group.children[i].castShadow = true;
    }
    return group;
}

