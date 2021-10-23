function det(u,v,w){
 let tmp1 = new THREE.Vector3(0,0,0); 
 tmp1.crossVectors(v,w);//cross ne marche plus
 return u.dot(tmp1);
}

function repere(MaScene){ 
    var PointO3 = new THREE.Vector3( 0,0,0 );
    var vecI = new THREE.Vector3( 1, 0, 0 );
    var vecJ = new THREE.Vector3( 0, 1, 0 );
    var vecK = new THREE.Vector3( 0, 0, 1 );
    vecteur(MaScene,PointO3,vecI, 0xFF0000, 0.25, 0.125 );
    vecteur(MaScene,PointO3,vecJ, 0x00FF00, 0.25, 0.125 );
    vecteur(MaScene,PointO3,vecK, 0x0000FF, 0.25, 0.125 );
}

//segment AB
function segment(MaScene,A,B,CoulHexa,epai){
 var geometry = new THREE.Geometry();
 geometry.vertices.push(A,B);
 var line = new THREE.Line(geometry, new THREE.LineDashedMaterial({
     color: CoulHexa,
     linewidth: epai,
    /* scale: .1,
     dashSize: .3,
     gapSize: .1*/
 }));
 //line.computeLineDistances();
 //scene.add(line);
 MaScene.add(line );
}

function tracePt(MaScene, P, CoulHexa,dimPt){    
 let sphereGeometry = new THREE.SphereGeometry(dimPt,12,24);
 let  sphereMaterial = new THREE.MeshBasicMaterial({color: CoulHexa });
 let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
 sphere.position.set(P.x,P.y,P.z);
 //alert(P.x+"\n"+P.y+"\n"+P.z+"\n"+CoulHexa+"\n"+dimPt);
 MaScene.add(sphere);
} // fin function tracePt

var epsilon = 0.00000001;
function testZero(x){
  var val=parseFloat(Number(x).toPrecision(PrecisionArrondi));
  if (parseFloat(Math.abs(x).toPrecision(PrecisionArrondi))<epsilon) val=0;
  return val;
}

const PrecisionArrondi=50;

//vecteur normal unitaire a une face
function vecteurProdVec(MaScene,A,u,v,CoulHexa,longCone,RayonCone){
 let w = new THREE.Vector3(0,0,0);
 let C = new THREE.Vector3(0,0,0);
 w.crossVectors(u,v);
 w.normalize();
 C.addVectors(A,w);
 vecteur(MaScene,A,C,CoulHexa,longCone,RayonCone);
}
//vecteur AB qui est une fleche
function vecteur(MaScene,A,B,CoulHexa,longCone,RayonCone){
 var vecAB = new THREE.Vector3( B.x-A.x, B.y-A.y, B.z-A.z );
 vecAB.normalize();
 MaScene.add( new THREE.ArrowHelper( vecAB, A, B.distanceTo(A), CoulHexa,longCone,RayonCone ));
}

//retour le vecteur AB qui est une fleche sans l'afficher
function vecteurRetroune(MaScene,A,B,CoulHexa,longCone,RayonCone){
 var vecAB = new THREE.Vector3( B.x-A.x, B.y-A.y, B.z-A.z );
 vecAB.normalize();
 return(vecAB);
}

//retour le vecteur  normal unitaire a une face sans l'afficher
function vecteurProdVecRetroune(MaScene,A,u,v,CoulHexa,longCone,RayonCone){
 let w = new THREE.Vector3(0,0,0);
 let C = new THREE.Vector3(0,0,0);
 w.crossVectors(u,v);
 w.normalize();
 //C.addVectors(A,w);
 return(w);
}

//vecteur AB qui est une fleche
function vecteurTan(MaScene,A,vB,CoulHexa,longCone,RayonCone){
 let B = new THREE.Vector3( 0, 0, 0);
 B.addVectors(A,vB);
 vecteur(MaScene,A,B,CoulHexa,longCone,RayonCone);
}


function afficheVecteur(V,nom,lieu){
 var mes = nom+" : (";
 for(var i=0;i<2;i++)
   mes+=V.getComponent(i)+" , ";
 mes+=V.getComponent(2)+" ) <br />";
 document.getElementById(lieu).innerHTML+=mes;
}

function guicamera(gui, camera){

    let vect = new THREE.Vector3(0, 0, 0);
    // ajout du menu dans le GUI
    let menuGUI = new function () {
        // propriete de la camera
        this.cameraxPos = camera.position.x;
        this.camerayPos = camera.position.y;
        this.camerazPos = camera.position.z;
        this.cameraxDir = vect.x;
        this.camerayDir = vect.y;
        this.camerazDir = vect.z;
        this.camerazoom = camera.zoom
    }

    let guiCamera = gui.addFolder("Camera");
    guiCamera.add(menuGUI, "cameraxPos", -10, 10).onChange(function () {
        camera.position.set(menuGUI.cameraxPos, camera.position.y, camera.position.z);
        actualisationPosDir()
    });
    guiCamera.add(menuGUI, "camerayPos", -10, 10).onChange(function () {
        camera.position.set(camera.position.x, menuGUI.camerayPos, camera.position.z);
        actualisationPosDir()
    });
    guiCamera.add(menuGUI, "camerazPos", -10, 10).onChange(function () {
        camera.position.set(camera.position.x, camera.position.y, menuGUI.camerazPos);
        actualisationPosDir()
    });
    guiCamera.add(menuGUI, "camerazoom", 0, 1).onChange(function () {
        camera.zoom = menuGUI.camerazoom;
        camera.updateProjectionMatrix();
        actualisationPosDir()
    });
    guiCamera.add(menuGUI, "cameraxDir", -10, 10).onChange(function () {
        camera.getWorldDirection(vect);
        camera.lookAt(menuGUI.cameraxDir, vect.y, vect.z);
        camera.lookAt(10, 5, 4);
        actualisationPosDir()
    });
    guiCamera.add(menuGUI, "camerayDir", -10, 10).onChange(function () {
        camera.getWorldDirection(vect);
        camera.lookAt(vect.x, menuGUI.camerayDir, vect.z);
        camera.updateProjectionMatrix();
        actualisationPosDir()
    });
    guiCamera.add(menuGUI, "camerazDir", -10, 10).onChange(function () {
        camera.getWorldDirection(vect);
        camera.lookAt(vect.x, vect.y, menuGUI.camerazDir);
        camera.updateProjectionMatrix();
        actualisationPosDir()
    });

    // //actualisation de des nombres du tableau
    // const clock = new THREE.Clock();
    // function actu() {
    //     var delta = clock.getDelta();
    //     requestAnimationFrame(actu);
    //     actualisationPosDir();
    // }
    function actualisationPosDir() {
        document.forms["controle"].PosX.value = menuGUI.cameraxPos;
        document.forms["controle"].PosY.value = menuGUI.camerayPos;
        document.forms["controle"].PosZ.value = menuGUI.camerazPos;
        document.forms["controle"].DirX.value = menuGUI.cameraxDir;
        document.forms["controle"].DirY.value = menuGUI.camerayDir;
        document.forms["controle"].DirZ.value = menuGUI.camerazDir;
        console.log(menuGUI.cameraxPos, menuGUI.camerayPos, menuGUI.camerazPos, menuGUI.cameraxDir, menuGUI.camerayDir, menuGUI.camerazDir)
    }

}