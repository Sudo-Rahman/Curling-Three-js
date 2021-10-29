var etat_partie = false;// va permettre de savoir si la partie a commencé ou non
function init() {
    var three = demarage(); // var qui contient la scene et la camera
    three[1].updateProjectionMatrix();
    var gui = new dat.GUI(); // initialisation du gui
    //guicamera(gui,three[1]); //ajoute au gui les parametres de la camera


    //fonction qui retourne les parametres de la piste
    let dimPiste = new function () {
        this.longueur = 10;
        this.largeur = 2;
        this.texture = new THREE.TextureLoader().load('../asset/glace2.jpg');// chargement de la texture pour la piste
        this.coul = "#a7d6ff";
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
        this.coulbalai = "#783e0c";
        this.coulrec = "#6bc780"
        this.coulPoils = "#f7f9f9";
    }

    //objets
    var piste = new Piste(dimPiste);// creation de la piste
    three[0].add(piste);// ajout de la piste dans la scene

    //fonction qui place le balai a son point de depart
    function placment_balai() {
        balais[0].position.x =piste.position.x - 0.70 * (dimPiste.longueur / 2);//sa calcule la position x du balais qui se situe a 0.70% de la moitier de la longueur de la piste, en gros au debut de la piste
        balais[0].position.y =piste.position.y- dimPiste.largeur/4;// ca correspod au millieu de la largeur de la piste
        balais[0].position.z = dimBalai.hauteur / 2+0.075;// on le divise pour ne pas qu'une moitier soit d'un coter de la piste et l'autre moitier de l'autre coté de la piste

        balais[1].position.x =piste.position.x - 0.70 * (dimPiste.longueur / 2);
        balais[1].position.y =piste.position.y+ dimPiste.largeur/4;
        balais[1].position.z = dimBalai.hauteur / 2+0.075;
    }

    //parametre de la piste
    var balais = [new Balai(dimBalai),new Balai(dimBalai)];// on creé deux balais
    three[0].add(balais[0],balais[1]);
    placment_balai();

    function addAndRemoveBalais(){
        if (!etat_partie){// si la partie est en cours on ne bouge replace pas le balai au point de depart
            three[0].remove( balais[0],balais[1]);// on enleve le balai de la scene
            balais = [new Balai(dimBalai),new Balai(dimBalai)];
            three[0].add(balais[0],balais[1]);// on l'ajoute a la scene
            placment_balai()
        }
    }


    //gui
    //#################################################
    let guiPiste = gui.addFolder("Piste");// creation d'un repertoir piste pour le gui
    guiPiste.add(dimPiste, "longueur", 5, 50).onChange(function () {//modification de la longueur de la piste
        if (!etat_partie){// si la partie est en cours on ne bouge replace pas le balai au point de depart
            three[0].remove(piste);// on retire la piste
            piste = piste = new Piste(dimPiste);//on creé une nouvelle piste avec les parametres du gui
            three[0].add(piste);// on ajoute la nouvelle piste a la scene
            placment_balai()
        }
    });
    guiPiste.add(dimPiste, "largeur", 1, 10).onChange(function () {//modification de la largeur de la piste
        if (!etat_partie){// si la partie est en cours on ne bouge replace pas le balai au point de depart
            three[0].remove(piste);
            piste = piste = new Piste(dimPiste);
            three[0].add(piste);
            placment_balai()
        }
    });

    let guiBalai = gui.addFolder("balai");// creation d'un repertoir piste pour le gui du balai
    guiBalai.add(dimBalai, "rayon", 0.07, 0.15).onChange(function () {//modification de la largeur de la piste
        addAndRemoveBalais();
    });
    guiBalai.add(dimBalai, "hauteur", 1, 3).onChange(function () {//modification de la largeur de la piste
        addAndRemoveBalais();
    });
    guiBalai.add(dimBalai, "longRec", 0.5, 2).onChange(function () {//modification de la largeur de la piste
        addAndRemoveBalais();
    });
    guiBalai.add(dimBalai, "largRec", 0.25, 1).onChange(function () {//modification de la largeur de la piste
        addAndRemoveBalais();
    });
    guiBalai.addColor(dimBalai, "coulbalai").onChange(function () {//modification de la largeur de la piste
        addAndRemoveBalais();
    });
    guiBalai.add(dimBalai, "nbPoils", 10, 1000).onChange(function () {//modification de la largeur de la piste
        addAndRemoveBalais();
    });
    guiBalai.addColor(dimBalai, "coulPoils").onChange(function () {//modification de la largeur de la piste
        addAndRemoveBalais();
    });
    guiBalai.addColor(dimBalai, "coulrec").onChange(function () {//modification de la largeur de la piste
        addAndRemoveBalais();
    });

    //#################################################

}
