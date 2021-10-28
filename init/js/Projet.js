function init() {
    var three = demarage(); // var qui contient la scene et la camera
    three[1].updateProjectionMatrix();
    var gui = new dat.GUI(); // initialisation du gui
    //guicamera(gui,three[1]); //ajoute au gui les parametres de la camera

    let etat_partie = false;// va permettre de savoir si la partie a commencé ou non

    //fonction qui retourne les parametres de la piste
    let dimPiste = new function () {
        this.longueur = 10;
        this.largeur = 2;
        this.texture = new THREE.TextureLoader().load('../asset/glace2.jpg');// chargement de la texture pour la piste

    }
    //fonction qui retourne les parametres du balai

    let dimBalai = new function () {
        this.rayon = 0.1;
        this.hauteur = 1;
        this.longRec = 0.5;
        this.largRec = 0.25;
        this.hauteurRec = 0.05;
        this.texture = new THREE.TextureLoader().load('../asset/bois.jpg');// chargement de la texture pour le manche du balai
        this.nbPoils = 50;
    }

    //objets
    var piste = new Piste(dimPiste);// creation de la piste
    three[0].add(piste);// ajout de la piste dans la scene

    //fonction qui place le balai a son point de depart
    function placment_balai() {
        balai.position.x =piste.position.x - 0.70 * (dimPiste.longueur / 2);//sa calcule la position x du balais qui se situe a 0.70% de la moitier de la longueur de la piste, en gros au debut de la piste
        balai.position.y =piste.position.y;// ca correspod au millieu de la largeur de la piste
        balai.position.z = dimBalai.hauteur / 2+0.075;// on le divise pour ne pas qu'une moitier soit d'un coter de la piste et l'autre moitier de l'autre coté de la piste
    }

    //parametre de la piste
    var balai = new Balai(dimBalai);
    three[0].add(balai);
    placment_balai();


    //gui
    //#################################################
    let guiPiste = gui.addFolder("Piste");// creation d'un repertoir piste pour le gui
    guiPiste.add(dimPiste, "longueur", 5, 50).onChange(function () {//modification de la longueur de la piste
        three[0].remove(piste);// on retire la piste
        piste = piste = new Piste(dimPiste);//on creé une nouvelle piste avec les parametres du gui
        three[0].add(piste);// on ajoute la nouvelle piste a la scene
        if (!etat_partie){// si la partie est en cours on ne bouge replace pas le balai au point de depart
            placment_balai()
        }
    });
    guiPiste.add(dimPiste, "largeur", 1, 10).onChange(function () {//modification de la largeur de la piste
        three[0].remove(piste);
        piste = piste = new Piste(dimPiste);
        three[0].add(piste);
        if (!etat_partie){// si la partie est en cours on ne bouge replace pas le balai au point de depart
            placment_balai()
        }
    });

    let guiBalai = gui.addFolder("balai");// creation d'un repertoir piste pour le gui du balai
    guiBalai.add(dimBalai, "rayon", 0.07, 0.15).onChange(function () {//modification de la largeur de la piste
        three[0].remove(balai);// on enleve le balai de la scene
        balai = new Balai(dimBalai);
        three[0].add(balai);// on l'ajoute a la scene
        if (!etat_partie){ // si la partie est en cours on ne bouge replace pas le balai au point de depart
            placment_balai()
        }
    });
    guiBalai.add(dimBalai, "hauteur", 1, 3).onChange(function () {//modification de la largeur de la piste
        three[0].remove(balai);
        balai =new Balai(dimBalai);
        three[0].add(balai);
        if (!etat_partie){// si la partie est en cours on ne bouge replace pas le balai au point de depart
            placment_balai()
        }
    });
    guiBalai.add(dimBalai, "largRec", 0.25, 1).onChange(function () {//modification de la largeur de la piste
        three[0].remove(balai);
        balai =new Balai(dimBalai);
        three[0].add(balai);
        if (!etat_partie){// si la partie est en cours on ne bouge replace pas le balai au point de depart
            placment_balai()
        }
    });
    guiBalai.add(dimBalai, "longRec", 0.5, 2).onChange(function () {//modification de la largeur de la piste
        three[0].remove(balai);
        balai =new Balai(dimBalai);
        three[0].add(balai);
        if (!etat_partie){// si la partie est en cours on ne bouge replace pas le balai au point de depart
            placment_balai()
        }
    });
    guiBalai.add(dimBalai, "nbPoils", 10, 1000).onChange(function () {//modification de la largeur de la piste
        three[0].remove(balai);
        balai =new Balai(dimBalai);
        three[0].add(balai);
        if (!etat_partie){// si la partie est en cours on ne bouge replace pas le balai au point de depart
            placment_balai()
        }
    });

    //#################################################

}
