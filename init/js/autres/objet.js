function PtsCourbePara(ch, R, nb) {
    let points = new Array(nb + 1);
    switch (ch) {
        case 1 : // cercle
            for (var k = 0; k <= nb; k++) {
                let t2 = k / nb * 2 * Math.PI;
                t2 = t2.toPrecision(PrecisionArrondi);
                let x0 = R * Math.cos(t2);
                let y0 = R * Math.sin(t2);
                points[k] = new THREE.Vector3(x0, y0, 0);
            }
            break;
        case 2 : // arc de cercle
            for (var k = 0; k <= nb; k++) {
                let t2 = -Math.PI / 2 + k / nb * Math.PI;
                t2 = t2.toPrecision(PrecisionArrondi);
                let x0 = R * Math.cos(t2);
                let z0 = R * Math.sin(t2);
                points[k] = new THREE.Vector3(x0, 0, z0);
            }
            break;
        case 3 :// Tennis
            let a = 0.75 * R;
            let b = R - a;
            for (var k = 0; k <= nb; k++) {
                let t2 = k / nb * 2 * Math.PI;
                t2 = t2.toPrecision(PrecisionArrondi);
                let x0, y0, z0;
                with (Math) {
                    x0 = a * cos(t2) + b * cos(3. * t2);
                    y0 = a * sin(t2) - b * sin(3. * t2);
                    z0 = 2. * sqrt(a * b) * sin(2. * t2);
                }
                points[k] = new THREE.Vector3(x0, y0, z0);
            }
            break;
        case 4 ://Clelie1
            let n = 3;
            for (var k = 0; k <= nb; k++) {
                let t2 = Math.PI * n * (-0.5 + k / nb);
                t2 = t2.toPrecision(PrecisionArrondi);
                let x0, y0, z0;
                with (Math) {
                    x0 = R * cos(t2 / n) * cos(t2);
                    y0 = R * cos(t2 / n) * sin(t2);
                    z0 = R * sin(t2 / n);
                }
                points[k] = new THREE.Vector3(x0, y0, z0);
            }
            break;
    } // fin switch
    let geometry = new THREE.BufferGeometry().setFromPoints(points);
    let material = new THREE.LineBasicMaterial({
        linewidth: 10,
        color: 0xaa1b1b
    });
    return  new THREE.Line(geometry, material);

}// fin PtsCourbePara

function tracePt(MaScene, P, CoulHexa, rayon, bol) {
    var sphereGeometry = new THREE.SphereGeometry(rayon, 35, 24);
    var sphereMaterial = new THREE.MeshPhongMaterial({
        emissive: 0x111111, color: CoulHexa, opacity: 0.7, transparent: true,
    });
    console.log(sphereMaterial)
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(P.x, P.y, P.z);
    if (bol) MaScene.add(sphere); // Affichage du point dans la scene
    return sphere;
// renvoi du point(la sphere) pour une utilisation ulterieure
} // fin function tracePt

//tracage de prism
function tracePrisme(MaScene, P, nombrefaces, CoulHexa) {
    let data = {
        radiusTop: 0.5,
        radiusBottom: 0.5,
        height: 1,
        radialSegments: 8,
        heightSegments: 1,
        openEnded: true,
        thetaStart: 0,
        thetaLength: Math.PI * 2
    }
    let geometry = new THREE.CylinderGeometry(
        data.radiusTop,
        data.radiusBottom,
        data.height,
        data.radialSegments,
        data.heightSegments,
        data.openEnded,
        data.thetaStart,
        data.thetaLength
    );
    let material = new THREE.MeshPhongMaterial({color: CoulHexa, side: 2});
    let cylinder = new THREE.Mesh(geometry, material);
    cylinder.rotateX(Math.PI / 2);
    cylinder.position.x = P.x;
    cylinder.position.y = P.y;
    cylinder.position.x = P.z;
    MaScene.add(cylinder);
    console.log(cylinder);
    return cylinder;
}
function faceRectangle(){
    let PtA = new THREE.Vector3 (1,0,0 );
    let PtB = new THREE.Vector3 (0,1,0 );
    let PtC = new THREE.Vector3 (-1,0,0 );
    let PtD = new THREE.Vector3 (0,-1,0 );
    let faceT = new THREE.Geometry();
    faceT.vertices = [PtA, PtB, PtC,PtD ];
    faceT.faces = [
        new THREE.Face3 ( 0, 1, 2 ), //A, B, C
        new THREE.Face3 ( 0, 2, 3 ), //A, C, D
    ]
    MaterialPhong = new THREE.MeshPhongMaterial({
        color: 'red',side:2,transparent: false,
    });
    return  new THREE.Mesh( faceT, MaterialPhong );
}

function prismBuffer(Mascene){
    vect = [];
    let a = Math.PI/5
    for (i=1;i<=5; i++){
        let face =faceRectangle();
        face.rotateX(a*i);
        face.position.x = a*i;
        face.position.y = a*i;
        face.position.z = a*i;
        Mascene.add(face);
    }

}

function prismOuvert(Mascene){
    let largeur = 0.5;
    let hauteur = 1;
    let profondeur = 1;
    let largSegments = 10;
    let hautSegments =10;
    let profSegments = 10;
    let BoiteGeom = new THREE.BoxGeometry (largeur, hauteur,
        profondeur, largSegments, hautSegments, profSegments );
    let material = new THREE.MeshPhongMaterial({
        color: 'red', side: 2,
    })
    let mesh = new THREE.Mesh( BoiteGeom, material );
    Mascene.add(mesh);
}

function TraceBezierQuadratique(P0, P1, P2, nbPts,coul,epaiCbe){
    let cbeBez = new THREE.QuadraticBezierCurve3 (P0, P1, P2 );
//Propriete geometrique de la courbe
    let cbeGeometry = new THREE.Geometry();
// Points de la courbe de Bezier
    cbeGeometry.vertices = cbeBez.getPoints(nbPts);
//Aspect de la courbe
    let material = new THREE.LineBasicMaterial(
        { color : coul ,
            linewidth: epaiCbe
        } );
// Courbe de Bezier avec les proprietes geometriques et l’aspect
    let BezierQuadratique = new THREE.Line( cbeGeometry, material );
//Renvoi de la courbe pour une utilisation ulterieure
    return (BezierQuadratique);
}

function TraceBezierCubique(P0, P1, P2, P3, nbPts, coul, epaiCbe){
    let cbeBez = new THREE.CubicBezierCurve3(P0, P1, P2, P3);
//Propriete geometrique de la courbe
    let cbeGeometry = new THREE.Geometry();
// Points de la courbe de Bezier
    cbeGeometry.vertices = cbeBez.getPoints(nbPts);
//Aspect de la courbe
    let material = new THREE.LineBasicMaterial(
        { color : coul ,
            linewidth: epaiCbe
        } );
// courbe de Bezier avec les proprietes geometriques et l’aspect
    let BezierCubique = new THREE.Line( cbeGeometry, material );
//Renvoi de la courbe pour une utilisation ulterieure
    return (BezierCubique);
} // fin fonction TraceBezierCubique
