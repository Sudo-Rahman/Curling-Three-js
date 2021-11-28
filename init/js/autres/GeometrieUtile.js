function repere(MaScene) {
    var PointO3 = new THREE.Vector3(0, 0, 0);
    var vecI = new THREE.Vector3(1, 0, 0);
    var vecJ = new THREE.Vector3(0, 1, 0);
    var vecK = new THREE.Vector3(0, 0, 1);
    vecteur(MaScene, PointO3, vecI, 0xFF0000, 0.25, 0.125);
    vecteur(MaScene, PointO3, vecJ, 0x00FF00, 0.25, 0.125);
    vecteur(MaScene, PointO3, vecK, 0x0000FF, 0.25, 0.125);
}

//segment AB
function segment(A, B, CoulHexa, epai) {
    var geometry = new THREE.Geometry();
    geometry.vertices.push(A, B);
    var line = new THREE.Line(geometry, new THREE.LineDashedMaterial({
        color: CoulHexa,
        linewidth: epai,
    }));
    return line;
}

//vecteur AB qui est une fleche
function vecteur(MaScene, A, B, CoulHexa, longCone, RayonCone) {
    var vecAB = new THREE.Vector3(B.x - A.x, B.y - A.y, B.z - A.z);
    vecAB.normalize();
    MaScene.add(new THREE.ArrowHelper(vecAB, A, B.distanceTo(A), CoulHexa, longCone, RayonCone));
}

function guicamera(gui) {

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
    });
    guiCamera.add(menuGUI, "camerayPos", -10, 10).onChange(function () {
        camera.position.set(camera.position.x, menuGUI.camerayPos, camera.position.z);
    });
    guiCamera.add(menuGUI, "camerazPos", -10, 10).onChange(function () {
        camera.position.set(camera.position.x, camera.position.y, menuGUI.camerazPos);
    });
    guiCamera.add(menuGUI, "camerazoom", 0, 1).onChange(function () {
        camera.zoom = menuGUI.camerazoom;
        camera.updateProjectionMatrix();
    });
    guiCamera.add(menuGUI, "cameraxDir", -10, 10).onChange(function () {
        camera.getWorldDirection(vect);
        camera.lookAt(menuGUI.cameraxDir, vect.y, vect.z);
        camera.lookAt(10, 5, 4);
    });
    guiCamera.add(menuGUI, "camerayDir", -10, 10).onChange(function () {
        camera.getWorldDirection(vect);
        camera.lookAt(vect.x, menuGUI.camerayDir, vect.z);
        camera.updateProjectionMatrix();
    });
    guiCamera.add(menuGUI, "camerazDir", -10, 10).onChange(function () {
        camera.getWorldDirection(vect);
        camera.lookAt(vect.x, vect.y, menuGUI.camerazDir);
        camera.updateProjectionMatrix();
    });

}