function demarage(){
    var stats = initStats();
    // creation de rendu et de la taille
    let rendu = new THREE.WebGLRenderer({antialias: true});
    rendu.shadowMap.enabled = true;
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 100);
    rendu.shadowMap.enabled = true;
    rendu.setClearColor(new THREE.Color(0xFFFFFF));
    rendu.setSize(window.innerWidth * .9, window.innerHeight * .9);
    cameraLumiere(scene, camera);
    lumiere(scene);
    //repere(scene);
    let directionalLight=new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position.set( 12, 22, -25 );
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    var light = new THREE.HemisphereLight(0x404040, 0xFFFFFF, 0.5);
    scene.add(light);

    var light1 = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light1);
    var light2 = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light2);

    var axes = new THREE.AxesHelper(1);
    scene.add(axes);
    //repere(scene)

    repere(scene);

    // deplacement avec souris
    const element = document.getElementById("webgl");
    let controls = new THREE.TrackballControls( camera,element );
    const clock = new THREE.Clock();
    function animate() {
        var delta = clock.getDelta();
        requestAnimationFrame(animate);
        controls.update(delta);
        rendu.render(scene, camera);
        stats.update();
    }
    animate();//fin deplacement avec souris

    //tracage du repere
    repere(scene);

    //ajout du guicamera

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
    return [scene,camera];
}