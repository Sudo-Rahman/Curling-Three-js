
            //Projet

function init(){
 var stats = initStats();
    // creation de rendu et de la taille
 let rendu = new THREE.WebGLRenderer({ antialias: true });
 rendu.shadowMap.enabled = true;
 let scene = new THREE.Scene();   
 let camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 100);
 rendu.shadowMap.enabled = true;
 rendu.setClearColor(new THREE.Color(0xFFFFFF));
 rendu.setSize(window.innerWidth*.9, window.innerHeight*.9);
 cameraLumiere(scene,camera);
 lumiere(scene);
 //repere(scene);
 
    var axes = new THREE.AxesHelper(1);    
    scene.add(axes);
    //repere(scene)
  const element = document.getElementById("webgl");
  let controls = new THREE.TrackballControls(camera,element);
  const clock = new THREE.Clock();
  function animate() {
    var delta = clock.getDelta();
    requestAnimationFrame(animate);
    controls.update(delta);
    rendu.render(scene, camera);
    stats.update();
  }
  animate();

   //Phong
 /*let material = new THREE.MeshPhongMaterial({
  color: 0xE8E8E8, // couleur de l’objet
  opacity: 1,
  transparent: true,
  emissive:0x000000, //couleur emissive
  specular:"#00FFFF", //couleur speculaire
  flatShading: true,
  shininess:30,//brillance
  side: THREE.DoubleSide,//2
  // side: THREE.FrontSide,//0
  //side: THREE.BackSide,//1
  });*/

  //let material1 = new THREE.MeshBasicMaterial({color: 0xFF0000 });
 //********************************************************
 //
 //  P A R T I E     G E O M E T R I Q U E
 //
 //********************************************************
 
 //Maison

  // Tracer un cercle blanc, rouge, blanc, bleu
  
  let TailleMaison = 0.5;
  //Second cercle : rouge
  const geometry2 = new THREE.RingGeometry( TailleMaison*0.1, TailleMaison*0.2, 30, 1 );
  //const geometry2 = new THREE.RingGeometry( 0.1, 0.2, 30, 1 );
  const material2 = new THREE.MeshBasicMaterial( { color: 0xff0000  } );
  const circle2 = new THREE.Mesh( geometry2, material2 );
  scene.add( circle2 );
  circle2.position.z = 0.04;

  //Dernier cercle : bleu
  const geometry4 = new THREE.RingGeometry(TailleMaison*0.3, TailleMaison*0.4, 30, 1 );
  const material4 = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
  const circle4 = new THREE.Mesh( geometry4, material4 );
  scene.add( circle4 );
  circle4.position.z = 0.04;



  //Piste
  let materialPiste = new THREE.MeshPhongMaterial({
  color: 0xADFFFF, // couleur de l’objet
  opacity: 1,
  transparent: false, //Inutile
  emissive:0x000000, //couleur emissive
  specular:"#00000F", //Si à 0, plus de brillance carrelage
  flatShading: true,
  shininess:0,//brillance
  side: THREE.DoubleSide,//2
  // side: THREE.FrontSide,//0
  //side: THREE.BackSide,//1
  });
  const geometryPiste = new THREE.BoxGeometry( 0.03, 3 );
  const piste = new THREE.Mesh( geometryPiste, materialPiste );
  //piste.position.x = 1;OxADFFFF
  //piste.position.y = 1;
  piste.rotation.y = 1.7;
  piste.position.y = 1;
  scene.add( piste );
  //scene.background = new THREE.Color(0, 0, 0);

 //********************************************************
 //
 // F I N      P A R T I E     G E O M E T R I Q U E
 //
 //********************************************************
 
 //********************************************************
 //
 //  D E B U T     M E N U     G U I
 //
 //********************************************************

 //********************************************************
 //
 //  F I N     M E N U     G U I
 //
 //********************************************************
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
 
 
  function renduAnim() {
    stats.update();
    // render avec requestAnimationFrame
    requestAnimationFrame(renduAnim);
// ajoute le rendu dans l'element HTML
    rendu.render(scene, camera);
  }
 
} // fin fonction init()