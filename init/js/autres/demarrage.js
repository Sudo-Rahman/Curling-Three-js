function demarage() {
    var stats = initStats();
    // creation de rendu et de la taille
    let rendu = new THREE.WebGLRenderer({antialias: true});
    rendu.shadowMap.enabled = true;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 100);
    rendu.shadowMap.enabled = true;
    rendu.shadowMapSoft = true;
    rendu.shadowMap.type = THREE.PCFSoftShadowMap;
    rendu.setClearColor(new THREE.Color(0xFFFFFF));
    rendu.setSize(window.innerWidth * .9, window.innerHeight * .9);
    cameraLumiere(scene, camera);
    //lumiere(scene);
    repere(scene);
    let light1 = new THREE.DirectionalLight(0xFFFFFF, 0.5,100);
    light1.position.set(-25, 25, 80);
    light1.target.position.set(0, 0, 0);
    light1.shadow.mapSize.width = 2000;
    light1.shadow.mapSize.height = 2000;
    light1.castShadow = true;
    var side = 8;
    light1.shadow.camera.top = side;
    light1.shadow.camera.bottom = -side;
    light1.shadow.camera.left = side;
    light1.shadow.camera.right = -side;
    scene.add(light1);
    scene.add(light1.target);
    // let helper = new THREE.CameraHelper(light1.shadow.camera);
    // scene.add(helper);
    // console.log(helper);
    let light = new THREE.DirectionalLight(0xFFFFFF, 0.5,100);
    light.position.set(15, 0, 5);
    light.target.position.set(0, 0, 0);
    light.shadow.mapSize.width = 2000;
    light.shadow.mapSize.height = 2000;
    // light.castShadow = true;
    light.shadow.camera.top = side;
    light.shadow.camera.bottom = -side;
    light.shadow.camera.left = side;
    light.shadow.camera.right = -side;
    scene.add(light);
    scene.add(light.target);
    scene.add(new THREE.AmbientLight(0xFFFFFF, 0.3));



    var axes = new THREE.AxesHelper(1);
    scene.add(axes);
    //repere(scene)

    repere(scene);


    // deplacement avec souris
    const element = document.getElementById("webgl");
    let controls = new THREE.TrackballControls(camera, element);
    const clock = new THREE.Clock();

    function animate() {
        var delta = clock.getDelta();
        requestAnimationFrame(animate);
        controls.update(delta);
        rendu.render(scene, camera);
        stats.update();
    }

    //animate();//fin deplacement avec souris
    controls.rotateSpeed = 1;

    camera_reset_pos(0);
    //tracage du repere
    repere(scene);

    renduAnim();


    // ajoute le rendu dans l'element HTML
    document.getElementById("webgl").appendChild(rendu.domElement);

    // affichage de la scene
    rendu.render(scene, camera);

    function reAffichage() {
        setTimeout(function () {

        }, 200);// fin setTimeout(function ()
        // render avec requestAnimationFrame
        rendu.render(scene, camera);
    }// fin fonction reAffichage()

    reAffichage();

    function renduAnim() {
        stats.update();
        // render avec requestAnimationFrame
        requestAnimationFrame(renduAnim);
// ajoute le rendu dans l'element HTML
        rendu.render(scene, camera);
    }

}

