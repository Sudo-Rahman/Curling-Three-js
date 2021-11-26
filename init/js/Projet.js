function init() {
    demarage(); // var qui contient la scene et la camera
    camera.updateProjectionMatrix();
    var gui = new dat.GUI(); // initialisation du gui
    guicamera(gui); //ajoute au gui les parametres de la camera


    //####################### PARAMETRE DES OBJETS ######################

    //fonction qui retourne les parametres de la piste
    paramPiste = new function () {
        this.longueur = 10;
        this.largeur = 2;
        //this.texture = new THREE.TextureLoader().load('../asset/glace2.jpg');// chargement de la texture pour la piste
        this.coul = "#a7d6ff";
    }

    //fonction qui retourne les parametres du balai
    let paramBalai = new function () {
        this.rayon = 0.1;
        this.hauteur = 1;
        this.longRec = 0.5;
        this.largRec = 0.25;
        this.hauteurRec = 0.05;
        //this.texture = new THREE.TextureLoader().load('../asset/bois.jpg');// chargement de la texture pour le manche du balai
        this.nbPoils = 50;
        this.coulbalai = "#783e0c";
        this.coulrec = "#6bc780"
        this.coulPoils = "#f7f9f9";
    }

    const paramPierre = new function () {
        this.taille = 0.1;
        this.coul = "#eb0f0f";
        this.coulCentre = "#1252d5";
        this.coul_endroit_pour_tenir = "#48bbbb"
    }

    //####################### FIN PARAMETRE DES OBJETS ######################


    //####################### PARAMETRE Phisiques des lancers ######################

    //parametres des lancers
    let paramLancer = new function () {
        this.forceN = 5;
        this.force_de_frottement = 0.2;
        this.balai = 0.2;
        this.lancer = function () {
        };
        this.id_lancer = "rectiligne";
    }

    // parametre de la partie
    let partie = new function () {
        this.choixequipe = 1;// variable pour selectionner l'equipe et changer les parametres de la pierre de l'equipe selectionné dans le gui
        this.commencer = function () {//fonction qui va lancer la partie
        };
        this.recommencer = function () {//fonction qui va recommncer la partie
        };
    }
    // console.log(partie)


    //initialisation des pierres des equipes par defaut
    for (let y = 0; y < 5; y++) {
        pierres.push(new Pierrre(paramPierre, 1, "#1252d5"));
        pierres.push(new Pierrre(paramPierre, 2, "#ffffff"));
    }
    //####################### fin PARAMETRE Phisiques des lancers ######################


    // ####################### CREATION DES OBJETS #####################

    //objets
    piste = new Piste(paramPiste);// creation de la piste
    scene.add(piste);// ajout de la piste dans la scene


    var balais = [new Balai(paramBalai), new Balai(paramBalai)];// on creé deux balais
    scene.add(balais[0], balais[1]);
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
            scene.remove(balais[0], balais[1]);// on enleve le balai de la scene
            balais = [new Balai(paramBalai), new Balai(paramBalai)];
            scene.add(balais[0], balais[1]);// on l'ajoute a la scene
            placment_balai();
        } else {//sinon on indique que la partie est en cours
            if (alertmess) {
                alert("Impossible partie commencé");
                alertmess = false;
            } else {
                setTimeout(() => {//fonction  qui permet de ne pas saturé la page d'alert
                    alertmess = true;
                }, 2000)
            }
        }
    }

    function addAndRemovePiste() {
        if (!etat_partie) {// si la partie est en cours on ne bouge replace pas le balai au point de depart
            scene.remove(piste);// on retire la piste
            piste = piste = new Piste(paramPiste);//on creé une nouvelle piste avec les parametres du gui
            scene.add(piste);// on ajoute la nouvelle piste a la scene
            placment_balai();
        } else {
            if (alertmess) {
                alert("Impossible partie commencé");
                alertmess = false;
            } else {
                setTimeout(() => {//fonction  qui permet de ne pas saturé la page d'alert
                    alertmess = true;
                }, 2000)
            }
        }
    }


//fonction qui place la pierre en parametre au debut de la piste quelle qu'en soit sa dimension
    function placement_pierre(pierre) {
        pierre.position.z = 0.0065;// place la pierre sur la piste
        pierre.position.x = piste.position.x - 0.70 * (paramPiste.longueur / 2);// place la pierre a 0.70% de la moitier de la longueur de la piste, en gros au debut de la piste
        pierre.rotation.z = (Math.PI / 2);// tourne la pierre pour que l'endroit ou l'on tient la pierre soit derriere la piste
    }

    //fonction qui initialise les pierres d'une equipe en fonction des parametres choisies dans le gui
    function addAndRemovePierres() {
        if (!etat_partie) {// on regarde que la partie n'a pas commencé
            switch (parseInt(partie.choixequipe)) {//on fait un parsint car pour le nombre 2 le gui renvoie un string
                case 1: {//equipe 1 selectionné
                    for (let i = 0; i < 5; i++) {//on boucle 5 fois
                        pierres[i * 2] = new Pierrre(paramPierre, 1, paramPierre.coulCentre);// on ajoute les pierres a la liste
                    }
                }
                    break;
                case 2: {//equipe 2 selectionné
                    for (let i = 0; i < 5; i++) {//on boucle 5 fois
                        pierres[i * 2 + 1] = new Pierrre(paramPierre, 2, paramPierre.coulCentre);// on ajoute les pierres a la liste
                    }
                }
                    break;
            }
            // console.log(partie.equipe);
        } else {// si la partie a commencé on ne peut pas changer les params des pierres
            if (alertmess) {
                alert("Impossible partie commencé");//on fait une alert
                alertmess = false;
            } else {
                setTimeout(() => {//fonction  qui permet de ne pas saturé la page d'alert
                    alertmess = true;
                }, 2000)
            }
        }
    }

    var time = 0;
    var mode = 1;
    var min_balais = 0;
    var max_balais = 0;

    function animeBalais(pierre, point) {
        animeBalaisX(pierre, point);
        max_balais = point.y + paramPierre.taille + piste.position.y + paramPiste.largeur / 6;
        min_balais = point.y;
        animebalaiY(pierre.pierre, time, mode);
        if (mode === 1) {
            time += 0.014;
            if (time >= max_balais) {
                mode *= (-1);
            }
        }
        if (mode === -1) {
            time -= 0.014;
            if (time <= min_balais) {
                mode *= (-1);
            }
        }
    }

    //
    function animebalaiY(pierre, delta, mode) {
        switch (mode) {
            case 1: {
                balais[0].position.y = delta;
                balais[1].position.y = -balais[0].position.y;
            }
                break;
            case -1: {
                balais[0].position.y = delta;
                balais[1].position.y = -balais[0].position.y;
            }
        }
    }


    function animeBalaisX(pierre, point) {
        balais[0].position.x = point.x + paramBalai.longRec + pierre.taille;
        balais[1].position.x = balais[0].position.x + paramBalai.longRec * 1.6;
        // console.log(balais[0].position.x, pierre)
    }


    function deplacementparam(pierre) {
        if (object != null) {
            scene.remove(object[0]);

        }
        switch (paramLancer.id_lancer) {
            case "rectiligne": {
                object = pierre.deplacementRectiligne(paramLancer.forceN * paramLancer.force_de_frottement * 5, paramLancer.balai);
                scene.add(object[0]);
                //console.log(object);
            }
                break;
            case "bezier": {
                object = pierre.deplacementBezier(paramLancer.forceN * paramLancer.force_de_frottement * 5, paramLancer.balai);
                scene.add(object[0]);
                //console.log(object)
            }
                break;
            case "bezier2":{
                object = pierre.deplacementBezier2(paramLancer.forceN * paramLancer.force_de_frottement * 5, paramLancer.balai);
                scene.add(object[0]);
                //console.log(object)
            }
        }
    }


    // ####################### FIN CREATION DES OBJETS #####################


    // ##################### DEBUT Partie ####################

    var compteur = 0; // compteur qui servira pour gerer les tours
    var alertmess = true; // var initialisé a vrai qui sert a ne pas spamé d'alert
    var mess = document.getElementById("mess"); // var qui stock l'element html mess ou sera indiqué le tour d'une equipe et qui annoncera le gagnant
    var webgl = document.getElementById("webgl");// var qui l'element html webgl
    var lancer_ok_point_d_interogation = true;// var initialisé a vrai qui servir a ne pas lancer d'autres pierre avant que celle lancer ne se soit pas arreter
    var object = null;

    // ##################### FIN Partie ####################


    //################### DEBUT GUI  ##############################

    //repertoir pour la piste
    let guiPiste = gui.addFolder("Piste");// creation d'un repertoir piste dans le gui
    guiPiste.add(paramPiste, "longueur", 5, 20).onChange(function () {//modification de la longueur de la piste
        addAndRemovePiste();
    });
    guiPiste.add(paramPiste, "largeur", 1, 4).onChange(function () {//modification de la largeur de la piste
        addAndRemovePiste();
    });
    guiPiste.addColor(paramPiste, "coul").onChange(function () {//modification de la largeur de la piste
        if (!etat_partie) {// si la partie est en cours on ne bouge replace pas le balai au point de depart
            scene.remove(piste);
            piste = piste = new Piste(paramPiste);
            scene.add(piste);
            placment_balai();
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
    guiBalai.add(paramBalai, "longRec", 0.5, 1.5).onChange(function () {//modification de la largeur de la piste
        addAndRemoveBalais();
    });
    guiBalai.add(paramBalai, "largRec", 0.25, 0.75).onChange(function () {//modification de la largeur de la piste
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

    //repertoir pour les pierres
    let guiPierre = gui.addFolder("Pierre");// creation d'un repertoir Pirre dans le gui
    guiPierre.add(paramPierre, "taille", 0.1, 0.35).onChange(function () {//modification de la largeur de la piste
        addAndRemovePierres();
    });
    guiPierre.addColor(paramPierre, "coulCentre").onChange(function () {//modification de la largeur de la piste
        addAndRemovePierres();
    });
    guiPierre.addColor(paramPierre, "coul").onChange(function () {//modification de la largeur de la piste
        addAndRemovePierres();
    });
    guiPierre.addColor(paramPierre, "coul_endroit_pour_tenir").onChange(function () {
        addAndRemovePierres();
    });

    // repertoir pour gerer la partie
    let guiPartie = gui.addFolder("Partie");// creation d'un repertoir Partie
    guiPartie.add(partie, "choixequipe", [1, 2]).name("choix equipe").onChange(function () {
    });
    guiPartie.add(partie, "commencer").name("Commencer la partie").onChange(function () {
        if (!etat_partie) {
            vectcentreMaison = new THREE.Vector2(paramPiste.longueur / 2 + piste.position.x - paramPiste.longueur / 10, piste.position.y);
            mess.innerHTML = "Lancer 1 de l'equipe 1";
            mess.style.color = pierres[0].couleur;
            webgl.style.borderColor = pierres[0].couleur;
            let tr = document.getElementsByTagName('tr');
            tr[1].children[0].style.color = pierres[0].couleur;
            tr[2].children[0].style.color = pierres[1].couleur;
            etat_partie = true;
            let pierre = pierres[compteur];
            scene.add(pierre.pierre);
            placement_pierre(pierre.pierre);
            deplacementparam(pierre);
            console.log(pierres)
            // console.log(pierres);
        }
    });
    guiPartie.add(partie, "recommencer").name("recommencer la partie").onChange(function () {//modification de la largeur de la piste
        if (etat_partie) {
            location.reload();
        }
    });

    // repertoir pour les lancers
    let guiLancer = gui.addFolder("lancer");
    guiLancer.add(paramLancer, "forceN", 1, 25).onChange(function () {
        if (etat_partie && lancer_ok_point_d_interogation) {
            deplacementparam(pierres[compteur]);
        }
    });
    guiLancer.add(paramLancer, "force_de_frottement", 0.1, 1).onChange(function () {
        if (etat_partie && lancer_ok_point_d_interogation) {
            deplacementparam(pierres[compteur]);
        }
    });
    guiLancer.add(paramLancer, "balai", 0.1, 1).name("point de controle").onChange(function () {
        if (etat_partie && lancer_ok_point_d_interogation) {
            deplacementparam(pierres[compteur]);
        }
    });
    guiLancer.add(paramLancer, "id_lancer", ["rectiligne", "bezier", "bezier2"]).name("choix lancer").onChange(function () {
        if (etat_partie && lancer_ok_point_d_interogation) {
            deplacementparam(pierres[compteur]);
        }
    });
    guiLancer.add(paramLancer, "lancer").onChange(function () {//modification de la largeur de la piste
        if (etat_partie && lancer_ok_point_d_interogation) {
            scene.remove(object[0]);
            time = 0;
            let pierre = pierres[compteur];
            var clock = new THREE.Clock();
            var delta = null;
            let i = 0;
            lancer_ok_point_d_interogation = false;
            lancer();

            function lancer() {
                if (i !== object[1].length) {
                    pierre.lancer = true;
                    delta = clock.getDelta();
                    pierre.deplacement(object[1][i]);
                    if (compteur >= 1) {// pour la premiere pierre a lancer on ne regarde pas si il y a choc ou pas car ya pas d'autre pierre
                        if (!chocDetected(paramLancer.forceN)) {//si on ne detecte pas de choc on continue l'animation
                            requestAnimationFrame(lancer);
                        } else {//si ya choc, la fonction chocDetected lance appelle une autre fonction pour realiser la ou les chocs
                            lancerend();
                        }
                    } else {
                        requestAnimationFrame(lancer);
                    }
                    if (balais[1].position.x < vectcentreMaison.x) {// on regarge que les balaise n'atteigne pas en x le centre de la maison
                        animeBalais(pierre, object[1][i]);
                        camera_suivie(pierre);
                    } else {// si les balais atteigne en x le centre de la maison ils se mettent sur le coter de la piste
                        balais[0].position.y = pierre.pierre.position.y + 5 * pierre.taille;
                        balais[1].position.y = pierre.pierre.position.y + 5 * pierre.taille;
                    }
                    i++;
                } else {//si pas de choc sur le lancer
                    lancerend();
                }
            }
        } else {
            alert("Attendez que le lancer se termine ou ajouter la pierre a la piste");
        }

    });

    //fonction qui se lance a la fin d'un lancer, il reactualise les positions des peirres des scores, reinitialisation de la position de la camera
    function lancerend() {
        setTimeout(() => {//on fait attendre 2 seconde avant de recalculer les pos des pierres et on reset la pos de la camera
            compteurr();// on increment le compteur de lancer de pierre
            camera_reset_pos(paramPiste.longueur / 100);
            lancer_ok_point_d_interogation = true;
        }, 2000);
    }

    function compteurr() {
        if (compteur === 9) {
            arreter_partie();
            placment_balai();
            return false;
        } else {
            compteur++;
            console.log(compteur);
            actualisationDistancetoMaison();
            addPierreGame();
            message_tour();
            return true;
        }

    }

    function actualisationDistancetoMaison() {
        calculeDistancetoMaison();
        let min = 100000;
        let pierre = null;
        let pierrereturn = null;
        let tr = document.getElementsByTagName('tr');
        for (let i = 1; i < tr.length; i++) {// on boucle pour changer la couleur de l'ecriture dans le tableau avec l'equipe la plus proche
            for (let o = 1; o < 6; o++) {
                if (i === 1) {
                    pierre = pierres[(o - 1) * 2];
                } else {
                    pierre = pierres[(o * 2) - 1];
                }
                if (pierre.hors_piste) {
                    tr[i].children[o].innerHTML = "Hors piste";
                } else {
                    if (pierre.distance != null) {
                        tr[i].children[o].innerHTML = pierre.distance + " m du centre de la maison";
                        if (pierre.distance < min) {
                            min = pierre.distance;
                            console.log(pierre)
                            coloriage(pierre.couleur);
                            pierrereturn = pierre;
                        } else {
                            if (pierre.distance === min) {
                                pierrereturn = new Pierrre(paramPierre, -1, "black");
                                pierrereturn.distance = min;
                            }
                        }
                    }
                }
            }
        }

        return pierrereturn;
    }

//fonction qui met le texte a la couleur de l'equique qui gagne
    function coloriage(coul) {
        let tr = document.getElementsByTagName('tr');
        for (let i = 1; i < tr.length; i++) {// on boucle pour changer la couleur de l'ecriture dans le tableau avec l'equipe la plus proche
            for (let o = 1; o < 6; o++) {
                tr[i].children[o].style.color = coul;
            }
        }
    }


// fonction qui actualise le message de la page html pour les tours
    function message_tour() {
        let pierre = actualisationDistancetoMaison();
        mess.innerHTML = "Lancer " + (parseInt(compteur / 2) + 1) + " de l'equipe " + (compteur % 2 + 1);
        mess.style.color = pierres[compteur].couleur;
        document.getElementById('webgl').style.borderColor = pierres[compteur].couleur;
        if (pierre != null && pierre.equipe !== -1) {
            mess.innerHTML += " : L'équipe n° " + pierre.equipe + " est en tete avec un distance de " + pierre.distance + " m du centre de la maison";
        }
    }

//fonction qui arrete la partie quand le compteur atteint le nombre de lancer qui vaut 9
    function arreter_partie() {
        etat_partie = false;
        let pierre = actualisationDistancetoMaison();
        console.log(pierre)
        if (pierre != null) {
            if (pierre.equipe === -1) {
                mess.innerHTML = "Partie terminé avec égalité entre les 2 equipes et une distance de " + pierre.distance;
            } else {
                mess.innerHTML = "L'équipe n° " + pierre.equipe + " à gagné avec une distance de " + pierre.distance + " m du centre de la maison";
            }
            mess.style.color = pierre.couleur;
        } else {
            mess.innerHTML = "Aucune equipe n'a gagné car tous les lancers sont hors piste ";
            mess.style.color = "black";
        }
    }
    

//fonction qui place les balais et ajoute la pierre suivante pour le prochain lancer
    function addPierreGame() {
        placment_balai();//place les balais
        let pierre = pierres[compteur].pierre;
        scene.add(pierre);// ajout de la pierre a la scene
        placement_pierre(pierre);//placement de la pierre sur la piste
        deplacementparam(pierres[compteur]);//creation de la trajectoir de lancer
    }


//######################  FIN GUI  ###########################

}
