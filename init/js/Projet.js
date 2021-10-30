var etat_partie = false;// va permettre de savoir si la partie a commencé ou non
function init() {
    var three = demarage(); // var qui contient la scene et la camera
    three[1].updateProjectionMatrix();
    var gui = new dat.GUI(); // initialisation du gui
    //guicamera(gui,three[1]); //ajoute au gui les parametres de la camera


    //fonction qui retourne les parametres de la piste
    let paramPiste = new function () {
        this.longueur = 10;
        this.largeur = 2;
        this.texture = new THREE.TextureLoader().load('../asset/glace2.jpg');// chargement de la texture pour la piste
        this.coul = "#a7d6ff";
    }

    //fonction qui retourne les parametres du balai
    let paramBalai = new function () {
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

    let paramPierre = new function () {
        this.taille = 0.1;
        this.coul = "#eb0f0f";
        this.coulCentre = "#f7f9f9";
        this.coul_endroit_pour_tenir ="#48bbbb"
    }

    //objets
    var piste = new Piste(paramPiste);// creation de la piste
    three[0].add(piste);// ajout de la piste dans la scene


    var balais = [new Balai(paramBalai), new Balai(paramBalai)];// on creé deux balais
    three[0].add(balais[0], balais[1]);
    placment_balai();

    //fonction qui place les balais a leur point de depart
    function placment_balai() {
        balais[0].position.x = piste.position.x - 0.70 * (paramPiste.longueur / 2);//sa calcule la position x du balais qui se situe a 0.70% de la moitier de la longueur de la piste, en gros au debut de la piste
        balais[0].position.y = piste.position.y - paramPiste.largeur / 4;// ca correspod au millieu de la largeur de la piste
        balais[0].position.z = paramBalai.hauteur / 2 + 0.075;// on le divise pour ne pas qu'une moitier soit d'un coter de la piste et l'autre moitier de l'autre coté de la piste

        balais[1].position.x = piste.position.x - 0.70 * (paramPiste.longueur / 2);
        balais[1].position.y = piste.position.y + paramPiste.largeur / 4;
        balais[1].position.z = paramBalai.hauteur / 2 + 0.075;
    }

    //fonction qui sert a ne pas faire des repetitions / il reconstruit les balais en fonctions des parametre du gui
    function addAndRemoveBalais() {
        if (!etat_partie) {// si la partie est en cours on ne bouge replace pas le balai au point de depart
            three[0].remove(balais[0], balais[1]);// on enleve le balai de la scene
            balais = [new Balai(paramBalai), new Balai(paramBalai)];
            three[0].add(balais[0], balais[1]);// on l'ajoute a la scene
            placment_balai()
        }
    }

    var pierres = [new Pierre(paramPierre)];
    three[0].add(pierres[0]);
    placment_pierre();

    function placment_pierre() {
        pierres[0].position.z = 0.0065;// place la pierre sur la piste
        pierres[0].position.x = piste.position.x - 0.70 * (paramPiste.longueur / 2);// place la pierre a 0.70% de la moitier de la longueur de la piste, en gros au debut de la piste
        pierres[0].rotation.z = (Math.PI/2);// tourne la pierre pour que l'endroit ou l'on tient la pierre soit derriere la piste
    }


    function addAndRemovePierres(){
        if (!etat_partie) {// si la partie est en cours on ne bouge replace pas le balai au point de depart
            three[0].remove(pierres[0]);// on enleve le balai de la scene
            pierres = [new Pierre(paramPierre)];
            three[0].add(pierres[0]);// on l'ajoute a la scene
            placment_pierre()
        }
    }


    //gui
    //#################################################

    //repertoir pour la piste
    let guiPiste = gui.addFolder("Piste");// creation d'un repertoir piste dans le gui
    guiPiste.add(paramPiste, "longueur", 5, 50).onChange(function () {//modification de la longueur de la piste
        if (!etat_partie){// si la partie est en cours on ne bouge replace pas le balai au point de depart
            three[0].remove(piste);// on retire la piste
            piste = piste = new Piste(paramPiste);//on creé une nouvelle piste avec les parametres du gui
            three[0].add(piste);// on ajoute la nouvelle piste a la scene
            placment_balai()
            placment_pierre()
        }
    });
    guiPiste.add(paramPiste, "largeur", 1, 10).onChange(function () {//modification de la largeur de la piste
        if (!etat_partie){// si la partie est en cours on ne bouge replace pas le balai au point de depart
            three[0].remove(piste);
            piste = piste = new Piste(paramPiste);
            three[0].add(piste);
            placment_balai()
            placment_pierre()
        }
    });
    guiPiste.addColor(paramPiste, "coul").onChange(function () {//modification de la largeur de la piste
        if (!etat_partie){// si la partie est en cours on ne bouge replace pas le balai au point de depart
            three[0].remove(piste);
            piste = piste = new Piste(paramPiste);
            three[0].add(piste);
            placment_balai()
            placment_pierre()
        }
    });

    // repertoir pour les balais
    let guiBalai = gui.addFolder("balai");// creation d'un repertoir piste dans le gui du balai
    guiBalai.add(paramBalai, "rayon", 0.07, 0.15).onChange(function () {//modification de la largeur de la piste
        addAndRemoveBalais();
    });
    guiBalai.add(paramBalai, "hauteur", 1, 3).onChange(function () {//modification de la largeur de la piste
        addAndRemoveBalais();
    });
    guiBalai.add(paramBalai, "longRec", 0.5, 2).onChange(function () {//modification de la largeur de la piste
        addAndRemoveBalais();
    });
    guiBalai.add(paramBalai, "largRec", 0.25, 1).onChange(function () {//modification de la largeur de la piste
        addAndRemoveBalais();
    });
    guiBalai.addColor(paramBalai, "coulbalai").onChange(function () {//modification de la largeur de la piste
        addAndRemoveBalais();
    });
    guiBalai.add(paramBalai, "nbPoils", 10, 1000).onChange(function () {//modification de la largeur de la piste
        addAndRemoveBalais();
    });
    guiBalai.addColor(paramBalai, "coulPoils").onChange(function () {//modification de la largeur de la piste
        addAndRemoveBalais();
    });
    guiBalai.addColor(paramBalai, "coulrec").onChange(function () {//modification de la largeur de la piste
        addAndRemoveBalais();
    });

    let guiPierre = gui.addFolder("Pirre");// creation d'un repertoir Pirre dans le gui
    guiPierre.add(paramPierre, "taille", 0.1, 0.5).onChange(function () {//modification de la largeur de la piste
        addAndRemovePierres()
    });
    guiPierre.addColor(paramPierre, "coulCentre").onChange(function () {//modification de la largeur de la piste
        addAndRemovePierres()
    });
    guiPierre.addColor(paramPierre, "coul").onChange(function () {//modification de la largeur de la piste
        addAndRemovePierres()
    });
    guiPierre.addColor(paramPierre, "coul_endroit_pour_tenir").onChange(function () {//modification de la largeur de la piste
        addAndRemovePierres()
    });



    //#################################################

}
