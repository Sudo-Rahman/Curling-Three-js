var etat_partie = false;// va permettre de savoir si la partie a commencé ou non
function init() {
    var three = demarage(); // var qui contient la scene et la camera
    three[1].updateProjectionMatrix();
    var gui = new dat.GUI(); // initialisation du gui
    guicamera(gui, three[1]); //ajoute au gui les parametres de la camera


    //####################### PARAMETRE DES OBJETS ######################

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

    const paramPierre = new function () {
        this.taille = 0.1;
        this.coul = "#eb0f0f";
        this.coulCentre = "#1252d5";
        this.coul_endroit_pour_tenir = "#48bbbb"
        this.masse_pierre = 16.5 * Math.pow(1 + this.taille, 3);// calcule non scientifique de la masse de la pierre (" ceci n'est pas une simulation")
    }

    //####################### FIN PARAMETRE DES OBJETS ######################


    //####################### PARAMETRE Phisiques des lancers ######################

    let paramLancer = new function () {
        this.forceN = 5;
        this.force_de_frottement = 0.2;
        this.ajouter = function () {
        };
        this.lancer = function () {
        };
    }

    // parametre de la partie
    let partie = new function () {
        this.equipe = {
            equipe1: {
                coul: "#1252d5",// couleur par defaut de l'equipe
                paraPierre: {},// dictionnair qui contient les parametre des pierres de l'equipe
                pierres: [],//list qui contient les pierre de l'equipe
                points: [],//liste qui va repertorier la distance des pierre de l'equipe
            },
            equipe2: {
                coul: "#ff0045",
                paraPierre: {},
                pierres: [],
                points: [],
            },
        };
        this.choixequipe = 0;// variable pour selectionner l'equipe et changer les parametres de la pierre de l'equipe selectionné dans le gui
        this.commencer = function () {//fonction qui va lancer la partie
        };
        this.recommencer = function () {//fonction qui va recommncer la partie
        };
    }
    // console.log(partie)


    //initialisation des pierres des equipes par defaut
    for (i = 0; i < 5; i++) {
        partie.equipe.equipe1.pierres.push(new Pierre(paramPierre));
        partie.equipe.equipe1.paraPierre = {taille: paramPierre.taille, masse: paramPierre.masse_pierre};
        paramPierre.coulCentre = "#ff0045";
        partie.equipe.equipe2.pierres.push(new Pierre(paramPierre));
        partie.equipe.equipe2.paraPierre = {taille: paramPierre.taille, masse: paramPierre.masse_pierre};
    }

    //####################### fin PARAMETRE Phisiques des lancers ######################


    // ####################### CREATION DES OBJETS #####################

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

    //fonction qui va animer les balais qui frottent le sole
    function animeBalais(pierre) {
        balais[0].position.x = pierre.position.x + 0.1 + paramBalai.longRec;
        balais[1].position.x = pierre.position.x + 0.1 + paramBalai.longRec * 2;
        balais[0].position.y = pierre.position.y + 0.5 * (Math.random() - 0.5);
        balais[1].position.y = pierre.position.y + 0.5 * (Math.random() - 0.5);
    }

    function addAndRemovePiste() {
        if (!etat_partie) {// si la partie est en cours on ne bouge replace pas le balai au point de depart
            three[0].remove(piste);// on retire la piste
            piste = piste = new Piste(paramPiste);//on creé une nouvelle piste avec les parametres du gui
            three[0].add(piste);// on ajoute la nouvelle piste a la scene
            placment_balai();
            //placment_pierre();
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
    function placment_pierre(pierre) {
        pierre.position.z = 0.0065;// place la pierre sur la piste
        pierre.position.x = piste.position.x - 0.70 * (paramPiste.longueur / 2);// place la pierre a 0.70% de la moitier de la longueur de la piste, en gros au debut de la piste
        pierre.rotation.z = (Math.PI / 2);// tourne la pierre pour que l'endroit ou l'on tient la pierre soit derriere la piste
    }

    //fonction qui initialise les pierres d'une equipe en fonction des parametres choisies dans le gui
    function addAndRemovePierres() {
        if (!etat_partie) {// on regarle que la partie n'est pas commencé
            let pierres = [];// on creé une liste vierge
            for (i = 0; i < 5; i++) {//on boucle 5 fois (5 lancers par equipe)
                pierres.push(new Pierre(paramPierre));// on ajoute les pierres a la liste
            }
            if (partie.choixequipe == 0) {//si c'est l'quipe 1 qui a été selectionné dans le gui
                partie.equipe.equipe1.pierres = pierres; // on affecte la liste de pierre a l'equipe 1
                partie.equipe.equipe1.paraPierre = {taille: paramPierre.taille, masse: paramPierre.masse_pierre}; //on ajoute les parametres dont on a besoin au cours de la partie
                partie.equipe.equipe1.coul = paramPierre.coulCentre;
                masse.setValue(paramPierre.masse_pierre); // on actualise la masse de la pierre on fonction de sa taille dans le gui
            } else {//si c'est equipe 2
                partie.equipe.equipe2.pierres = pierres;
                partie.equipe.equipe2.paraPierre = {taille: paramPierre.taille, masse: paramPierre.masse_pierre};
                partie.equipe.equipe2.coul = paramPierre.coulCentre;
                masse.setValue(paramPierre.masse_pierre);
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


    // ####################### FIN CREATION DES OBJETS #####################


    // ##################### DEBUT Partie ####################

    var pierres = []; // liste qui va stocker les pierres des 2 equipes
    var vectpierre = new THREE.Vector2(0, 0); // variable qui va stocker les coordonné de la pierre
    var compteur = 0; // compteur qui servira pour gerer les tours
    var vectcentreMaison = new THREE.Vector2(0, 0); // var qui stock les coordonné du centre de la maison
    var le_plus_proche = 1000; // var initialisé a 1000 qui va servir de comparaison pour connaitre la pierre la plus proche du centre de la maison
    var alertmess = true; // var initialisé a vrai qui sert a ne pas spamé d'alert
    var mess = document.getElementById("mess"); // var qui stock l'element html mess ou sera indiqué le tour d'une equipe et qui annoncera le gagnant
    var webgl = document.getElementById("webgl");// var qui l'element html webgl
    var lancer_ok_point_d_interogation = true;// var initialisé a vrai qui servir a ne pas lancer d'autres pierre avant que celle lancer ne se soit pas arreter
    var pierre_ajouter_a_la_piste_point_d_interogation = false; // var qui va servir a savoir si la pierre a lancer a été ajoputer sur la piste

    // ##################### FIN Partie ####################


    //################### DEBUT GUI  ##############################

    //repertoir pour la piste
    let guiPiste = gui.addFolder("Piste");// creation d'un repertoir piste dans le gui
    guiPiste.add(paramPiste, "longueur", 5, 50).onChange(function () {//modification de la longueur de la piste
        addAndRemovePiste();
    });
    guiPiste.add(paramPiste, "largeur", 1, 10).onChange(function () {//modification de la largeur de la piste
        addAndRemovePiste();
    });
    guiPiste.addColor(paramPiste, "coul").onChange(function () {//modification de la largeur de la piste
        if (!etat_partie) {// si la partie est en cours on ne bouge replace pas le balai au point de depart
            three[0].remove(piste);
            piste = piste = new Piste(paramPiste);
            three[0].add(piste);
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

    //repertoir pour les pierres
    let guiPierre = gui.addFolder("Pierre");// creation d'un repertoir Pirre dans le gui
    guiPierre.add(paramPierre, "taille", 0.1, 0.5).onChange(function () {//modification de la largeur de la piste
        paramPierre.masse_pierre = 16.5 * Math.pow(1 + paramPierre.taille, 3);// calcule non scientifique de la masse de la pierre (" ceci n'est pas une simulation")
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
    let masse = guiPierre.add(paramPierre, "masse_pierre");

    // repertoir pour gerer la partie
    let guiPartie = gui.addFolder("Partie");// creation d'un repertoir Partie
    guiPartie.add(partie, "choixequipe", [0, 1]).name("choix equipe").onChange(function () {
    });
    guiPartie.add(partie, "commencer").name("Commencer la partie").onChange(function () {
        if (!etat_partie) {
            vectcentreMaison = new THREE.Vector2(paramPiste.longueur / 2 + piste.position.x - paramPiste.longueur / 10, piste.position.y);
            mess.innerHTML = "Lancer " + (compteur + 1) + " : tour de l'equipe 1";
            mess.style.color = partie.equipe.equipe1.coul;
            webgl.style.borderColor = partie.equipe.equipe1.coul;
            let tr = document.getElementsByTagName('tr');
            tr[1].children[0].style.color = partie.equipe.equipe1.coul;
            tr[2].children[0].style.color = partie.equipe.equipe2.coul;
            etat_partie = true;
            for (i = 0; i < 5; i++) {// on ajoutes toutes les pierres des 2 equipes dans la var pierres creéé dans la section Partie
                pierres.push(partie.equipe.equipe1.pierres[i]);
                pierres.push(partie.equipe.equipe2.pierres[i]);
            }
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
    guiLancer.add(paramLancer, "forceN", 1, 25).onChange(function () {//modification de la largeur de la piste
    });
    guiLancer.add(paramLancer, "force_de_frottement", 0.001, 0.99).onChange(function () {//modification de la largeur de la piste
    });
    guiLancer.add(paramLancer, "ajouter").name("Ajouter la pierre").onChange(function () {//modification de la largeur de la piste
        if (etat_partie && lancer_ok_point_d_interogation) {
            placment_balai();
            let pierre = pierres[compteur];
            three[0].add(pierre);
            placment_pierre(pierre);
            pierre_ajouter_a_la_piste_point_d_interogation = true;
        }
    });
    guiLancer.add(paramLancer, "lancer").onChange(function () {//modification de la largeur de la piste
        if (etat_partie && lancer_ok_point_d_interogation && pierre_ajouter_a_la_piste_point_d_interogation) {
            let acceleration = 0;
            let distance = null;
            let messs = "";
            let pierre = pierres[compteur];
            let coul = "";
            if (compteur % 2 === 0) {
                console.log(acceleration)
                acceleration = paramLancer.forceN / partie.equipe.equipe1.paraPierre.masse;
                messs = document.getElementById("equipe1").getElementsByTagName('td')[compteur / 2 + 1];
                console.log(acceleration, partie.equipe.equipe1.paraPierre.masse)
                coul = partie.equipe.equipe1.coul;
            } else {
                acceleration = paramLancer.forceN / partie.equipe.equipe2.paraPierre.masse;
                messs = document.getElementById("equipe2").getElementsByTagName('td')[parseInt(compteur / 2) + 1];
                coul = partie.equipe.equipe2.coul;
                console.log(acceleration, partie.equipe.equipe2.paraPierre.masse)
            }
            lancer();
            lancer_ok_point_d_interogation = false;
            pierre_ajouter_a_la_piste_point_d_interogation = false;

            function lancer() {
                if (acceleration > 0.001) {
                    deplacementRectiligne(pierre, acceleration);
                    animeBalais(pierre);
                    acceleration = acceleration * paramLancer.force_de_frottement;
                    three[2].render(three[0], three[1]);
                    requestAnimationFrame(lancer);
                } else {
                    if (pierre.position.x > paramPiste.longueur / 2 + piste.position.x) {
                        three[0].remove(pierre);
                        messs.innerHTML = "Hors piste";
                        distance = null;
                    } else {
                        vectpierre = new THREE.Vector2(pierre.position.x, pierre.position.y);
                        distance = Math.round(vectcentreMaison.distanceTo(vectpierre) * 100) / 100;
                        messs.innerHTML = distance + " m du centre de la maison";
                    }
                    lancer_ok_point_d_interogation = true;
                    placment_balai();
                    coull(coul, distance);
                    compteurr(distance);
                    message_tour();
                }
            }
        } else {
            alert("Attendez que le lancer se termine ou ajouter la pierre a la piste");
        }

    });

    function compteurr(distance) {
        switch (compteur % 2) {
            case 0 :
                partie.equipe.equipe1.points.push(distance);
                break;
            case 1 :
                partie.equipe.equipe2.points.push(distance);
                break;
        }
        if (compteur === 9) {
            arreter_partie();
        } else {
            compteur++;
        }

    }

    // fonction qui change la couleur de l'ecriture dans le tableau en fonction de l'equipe qui la plus petite valeur
    function coull(coul, distance) {
        if (distance !== null) {// on verifie que le lancer n'est pas hors piste
            let tr = document.getElementsByTagName('tr');
            if (le_plus_proche === distance) {// si le lancer effectue
                coul = "black";
                for (i = 1; i < tr.length; i++) {
                    for (o = 1; o < 6; o++) {
                        tr[i].children[o].style.color = coul;
                    }
                }
            }
            if (le_plus_proche > distance) {
                le_plus_proche = distance;
                for (i = 1; i < tr.length; i++) {
                    for (o = 1; o < 6; o++) {
                        tr[i].children[o].style.color = coul;
                    }
                }
            }
        }

    }

    // fonction qui actualise le message de la page html pour les tours
    function message_tour() {
        mess.innerHTML = "Lancer " + (parseInt(compteur / 2) + 1) + " de l'equipe " + (compteur % 2 + 1);
        if (compteur % 2 === 0) {
            mess.style.color = partie.equipe.equipe1.coul;
            webgl.style.borderColor = partie.equipe.equipe1.coul;
        } else {
            mess.style.color = partie.equipe.equipe2.coul;
            webgl.style.borderColor = partie.equipe.equipe2.coul;
        }
    }

    function arreter_partie() {
        console.log(partie.equipe.equipe1.points, partie.equipe.equipe2.points);
        // on regarde si les 2 listes n'on que des valeurs null ou pas
        if (!check_list_contains_only_null_vallues(partie.equipe.equipe1.points) && !check_list_contains_only_null_vallues(partie.equipe.equipe2.points)) {
            let min_equipe1 = Math.min(...partie.equipe.equipe1.points);// on prend le mini de l'equipe 1
            let min_equipe2 = Math.min(...partie.equipe.equipe2.points);// on prend le mini de l'equipe 2
            console.log(min_equipe2, min_equipe1)
            if (min_equipe1 === min_equipe2) {// si c'est egalité
                mess.innerHTML = "Egalité avec une distance de " + min_equipe1 + " pour l'équipe 1 et " + min_equipe2 + " pour l'équipe 2";
                mess.style.color = "black";
            } else {
                if (min_equipe1 < min_equipe2) {// si l'equipe 1 gagne
                    mess.innerHTML = "L'equipe 1 à gagné avec une distance de " + min_equipe1 + " m du centre de la maison";
                    mess.style.color = partie.equipe.equipe1.coul;
                } else {
                    if (min_equipe1 > min_equipe2) {// si l'equipe 2 gagne
                        mess.innerHTML = "L'equipe 2 à gagné avec une distance de " + min_equipe2 + " m du centre de la maison";
                        mess.style.color = partie.equipe.equipe2.coul;

                    }

                }
            }
        }else{
            mess.innerHTML = "Aucune equipe n'a gagné car tous les lancers sont hors piste ";
            mess.style.color = "black";
        }
    }

    // fonction qui verifie que la liste en para n'a pas que des valeurs null
    function check_list_contains_only_null_vallues(list) {
        let null_ou_pas = true;
        for (i = 0; i < list.length(); i++) {
            if (list[i] !== null) {
                null_ou_pas = false
            }
        }
    }


    //######################  FIN GUI  ###########################

}

