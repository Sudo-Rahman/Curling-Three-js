function init(){
    var three = demarage(); // var qui contient la scene et la camera
    three[1].updateProjectionMatrix();
    var gui = new dat.GUI(); // initialisation du gui
    //guicamera(gui,three[1]); //ajoute au gui les parametres de la camera
    const texture = new THREE.TextureLoader().load( '../asset/glace2.jpg');// chargement de la texture pour la piste
    var piste = new Piste(5,1,texture );// creation de la piste
    three[0].add(piste);// ajout de la piste dans la scene

    //fonction qui retourne les parametres de la piste
    let menuPiste = new function (){
        this.longueur= 4;
        this.largeur = 1;
    }
    let guiPiste = gui.addFolder("Piste");// creation d'un repertoir piste pour le gui
    guiPiste.add(menuPiste, "longueur", 0.1, 10).onChange(function () {//modification de la longueur de la piste
        three[0].remove(piste);// on retire la piste
        piste = new Piste(menuPiste.longueur,menuPiste.largeur,texture);//on creé une nouvelle piste avec les parametres du gui
        three[0].add(piste);// on ajoute la nouvelle piste a la scene
    });
    guiPiste.add(menuPiste, "largeur", 0.1, 10).onChange(function () {//modification de la largeur de la piste
        three[0].remove(piste);
        piste = new Piste(menuPiste.longueur,menuPiste.largeur,texture);
        three[0].add(piste);
    });

}
