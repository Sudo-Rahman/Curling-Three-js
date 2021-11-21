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
        this.ajouter = function () {
        };
        this.lancer = function () {
        };
        this.id_lancer = "rectiligne";
    }

    // parametre de la partie
    let partie = new function () {
        this.equipe = {
            equipe1: {
                coul: "#1252d5",// couleur par defaut de l'equipe
                pierres: [],//list qui contient les pierre de l'equipe
                points: [],//liste qui va repertorier la distance des pierre de l'equipe
            },
            equipe2: {
                coul: "#ffffff",
                pierres: [],
                points: [],
            },
        };
        this.choixequipe = 1;// variable pour selectionner l'equipe et changer les parametres de la pierre de l'equipe selectionné dans le gui
        this.commencer = function () {//fonction qui va lancer la partie
        };
        this.recommencer = function () {//fonction qui va recommncer la partie
        };
    }
    // console.log(partie)


    //initialisation des pierres des equipes par defaut
    for (let y = 0; y < 5; y++) {
        partie.equipe.equipe1.pierres.push(new Pierrre(paramPierre, 1, partie.equipe.equipe1.coul));
        paramPierre.coulCentre = partie.equipe.equipe2.coul;
        partie.equipe.equipe2.pierres.push(new Pierrre(paramPierre, 2, partie.equipe.equipe2.coul));
        paramPierre.coulCentre = partie.equipe.equipe1.coul;
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
    // function animebalai(pierre, delta, mode) {
    //     switch (mode) {
    //         case 1: {
    //             console.log("aaaaaaa")
    //             balais[0].position.y = pierre.position.y + delta;
    //             balais[1].position.y = -balais[0].position.y;
    //             console.log(balais[0].position.y)
    //         }
    //             break;
    //         case -1: {
    //             console.log(balais[0].position.y)
    //             console.log("bbbbbbbb")
    //             balais[0].position.y = pierre.position.y + delta;
    //             balais[1].position.y = -balais[0].position.y;
    //             time -= 0.014
    //         }
    //     }
    // }

    function animebalai(pierre, delta, mode) {
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
    }

    function camera_suivie(camera, pierre) {
        camera.position.x = pierre.pierre.position.x - pierre.taille - 6;
        camera.position.y = pierre.pierre.position.y;
        camera.position.z = 4;
        camera.lookAt(pierre.pierre.position.x + 1, pierre.pierre.position.y, 1);
        camera.updateProjectionMatrix();
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
            switch (partie.choixequipe) {
                case 1: {//equipe 1 selectionné
                    partie.equipe.equipe1.coul = paramPierre.coulCentre;
                    for (let i = 0; i < 5; i++) {//on boucle 5 fois
                        pierres.push(new Pierrre(paramPierre, 1, partie.equipe.equipe1.coul));// on ajoute les pierres a la liste
                    }
                    partie.equipe.equipe1.pierres = pierres; // on affecte la liste de pierre a l'equipe 1
                }
                    break;
                case 2: {//equipe 2 selectionné
                    partie.equipe.equipe2.coul = paramPierre.coulCentre;
                    for (let i = 0; i < 5; i++) {//on boucle 5 fois
                        pierres.push(new Pierrre(paramPierre, 2, partie.equipe.equipe2.coul));// on ajoute les pierres a la liste
                    }
                    partie.equipe.equipe2.pierres = pierres;
                }
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

    // let pi = new Pierrre(paramPierre, 1, "black");
    // three[0].add(pi.pierre);
    var time = 0;
    var mode = 1;
    var min_balais = 0;
    var max_balais = 0;

    function animeBalais(pierre, point) {
        animeBalaisX(pierre, object[1][i]);
        max_balais = point.y + paramPierre.taille + piste.position.y + paramPiste.largeur / 6;
        min_balais = point.y;
        camera_suivie(three[1], pierres[compteur], vectcentreMaison);
        animebalai(pierres[compteur].pierre, time, mode);
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


    function deplacementparam(pierre) {
        if (object != null) {
            three[0].remove(object[0]);

        }
        switch (paramLancer.id_lancer) {
            case "rectiligne":
                object = pierre.deplacementRectiligne(vectcentreMaison, paramLancer.forceN * paramLancer.force_de_frottement * 5);
                three[0].add(object[0]);
                console.log(object)
                break;
            case "bezier":
                console.log(paramLancer.forceN * paramLancer.force_de_frottement * 5);
                object = pierre.deplacementBezier(paramPiste, piste, vectcentreMaison, paramLancer.forceN * paramLancer.force_de_frottement * 5, paramLancer.balai);
                three[0].add(object[0]);

        }
    }


    // ####################### FIN CREATION DES OBJETS #####################


    // ##################### DEBUT Partie ####################

    var pierres = []; // liste qui va stocker les pierres des 2 equipes
    var vectpierre = new THREE.Vector2(0, 0); // variable qui va stocker les coordonné de la pierre
    var compteur = 0; // compteur qui servira pour gerer les tours
    var vectcentreMaison = new THREE.Vector2(0, 0); // var qui stock les coordonné du centre de la maison
    var le_plus_proche = 10000; // var initialisé a 1000 qui va servir de comparaison pour connaitre la pierre la plus proche du centre de la maison
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
            mess.innerHTML = "Lancer " + (compteur + 1) + " : tour de l'equipe 1";
            mess.style.color = partie.equipe.equipe1.coul;
            webgl.style.borderColor = partie.equipe.equipe1.coul;
            let tr = document.getElementsByTagName('tr');
            tr[1].children[0].style.color = partie.equipe.equipe1.coul;
            tr[2].children[0].style.color = partie.equipe.equipe2.coul;
            etat_partie = true;
            for (let i = 0; i < 5; i++) {// on ajoutes toutes les pierres des 2 equipes dans la var pierres creéé dans la section Partie
                pierres.push(partie.equipe.equipe1.pierres[i]);
                pierres.push(partie.equipe.equipe2.pierres[i]);
            }
            let pierre = pierres[compteur];
            three[0].add(pierre.pierre);
            placment_pierre(pierre.pierre);
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
    guiLancer.add(paramLancer, "id_lancer", ["rectiligne", "bezier"]).name("choix lancer").onChange(function () {
        if (etat_partie) {
            deplacementparam(pierres[compteur]);
        }
    });
    guiLancer.add(paramLancer, "lancer").onChange(function () {//modification de la largeur de la piste
        if (etat_partie && lancer_ok_point_d_interogation) {
            three[0].remove(object[0]);
            time = 0;
            let messs = "";
            let pierre = pierres[compteur];
            let coul = pierres[compteur].couleur;
            switch (pierre.equipe) {
                case 1: {
                    messs = document.getElementById("equipe1").getElementsByTagName('td')[compteur / 2 + 1];
                }
                    break;
                case 2: {
                    messs = document.getElementById("equipe2").getElementsByTagName('td')[parseInt(compteur / 2) + 1];

                }
            }
            var clock = new THREE.Clock();
            var delta = null;
            let i = 0;
            lancer();
            lancer_ok_point_d_interogation = false;

            function lancer() {
                if (i !== object[1].length) {
                    delta = clock.getDelta();
                    requestAnimationFrame(lancer);
                    pierre.deplacement(object[1][i]);
                    animeBalais(pierre.pierre, object[1][i]);
                    camera_suivie(three[1], pierre);
                    i++;
                } else {
                    if (pierre.pierre.position.x > paramPiste.longueur / 2 + piste.position.x || pierre.pierre.position.y > paramPiste.largeur / 2 + piste.position.y || -pierre.pierre.position.x < -paramPiste.longueur / 2 + piste.position.x) {
                        three[0].remove(pierre.pierre);
                        messs.innerHTML = "Hors piste";
                    } else {
                        vectpierre = new THREE.Vector2(pierre.pierre.position.x, pierre.pierre.position.y);
                        pierre.distance = Math.round(vectcentreMaison.distanceTo(vectpierre) * 100) / 100;
                        messs.innerHTML = pierre.distance + " m du centre de la maison";
                    }
                    lancer_ok_point_d_interogation = true;
                    placment_balai();
                    coull(pierre);
                    setTimeout(() => {
                        camera_reset_pos(three[1], paramPiste.longueur / 100)
                    }, 2000);
                    addPierreGame();
                }
            }
        } else {
            alert("Attendez que le lancer se termine ou ajouter la pierre a la piste");
        }

    });

    function compteurr(pierre) {
        switch (pierre.equipe) {
            case 1 :
                partie.equipe.equipe1.points.push(pierre.distance);
                break;
            case 2 :
                partie.equipe.equipe2.points.push(pierre.distance);
                break;
        }
        if (compteur === 9) {
            arreter_partie();
            return false;
        } else {
            compteur++;
            console.log(compteur)
            return true;
        }

    }

    // fonction qui change la couleur de l'ecriture dans le tableau en fonction de l'equipe qui a la plus petite valeur
    function coull(pierre) {
        if (compteurr(pierre)) {
            let pierre_numero = -1;
            let couleur = 'black';
            for (let i = 0; i < pierres.length; i++) {
                if (pierres[i].distance != null) {
                    if (pierres[i].distance < le_plus_proche) {
                        pierre_numero = i;
                        le_plus_proche = pierres[i].distance;
                        couleur = pierres[i].couleur;
                        console.log(i)
                    } else {
                        if (pierres[i].distance === le_plus_proche) {
                            pierre_numero = null;
                        }
                    }
                }
                console.log(le_plus_proche, pierre_numero)
            }
            console.log(pierres[pierre_numero])
            let tr = document.getElementsByTagName('tr');
            for (let i = 1; i < tr.length; i++) {
                for (let o = 1; o < 6; o++) {
                    tr[i].children[o].style.color = couleur;
                }
            }
            message_tour();
            if (pierre_numero !== -1&& pierre_numero !=null ) {
                mess.innerHTML += " : l'équipe n° " + pierres[pierre_numero].equipe + " est en tete avec une distance de : " + le_plus_proche + " m";
            }
            if (pierre_numero == null) {
                mess.innerHTML += " : l'équipe n°1 et n°2 sont à égalité avec une distance de : " + le_plus_proche + " m"
            }
        }

    }


// fonction qui actualise le message de la page html pour les tours
    function message_tour() {
        mess.innerHTML = "Lancer " + (parseInt(compteur / 2) + 1) + " de l'equipe " + (compteur % 2 + 1);
        mess.style.color = pierres[compteur].couleur;
        document.getElementById('webgl').style.borderColor = pierres[compteur].couleur;
    }

    function arreter_partie() {
        etat_partie = false;
        console.log(partie.equipe.equipe1.points, partie.equipe.equipe2.points);
        // on regarde si les 2 listes n'on que des valeurs null ou pas
        if (!check_list_contains_only_null_vallues(partie.equipe.equipe1.points) && !check_list_contains_only_null_vallues(partie.equipe.equipe2.points)) {
            let min_equipe1 = getmini(partie.equipe.equipe1.points);// on prend le mini de l'equipe 1
            let min_equipe2 = getmini(partie.equipe.equipe2.points);// on prend le mini de l'equipe 2
            console.log(min_equipe2, min_equipe1)
            if (min_equipe1 === min_equipe2) {// si c'est egalité
                mess.innerHTML = "Partie terminé avec égalité entre les 2 equipes";
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
        } else {
            mess.innerHTML = "Aucune equipe n'a gagné car tous les lancers sont hors piste ";
            mess.style.color = "black";
        }
    }

// fonction qui verifie que la liste en para ne contient que des valeurs null
    function check_list_contains_only_null_vallues(list) {
        let null_ou_pas = true;
        for (let i = 0; i < list.length; i++) {
            if (list[i] !== null) {
                null_ou_pas = false
            }
        }
    }

    function getmini(tab) {
        let tab1 = [];
        for (let i = 0; i < tab.length; i++) {
            if (tab[i] !== null) {
                tab1.push(tab[i]);
            }
        }
        return Math.min(...tab1);
    }

    function addPierreGame() {
        placment_balai();
        let pierre = pierres[compteur].pierre;
        console.log(pierre);
        three[0].add(pierre);
        placment_pierre(pierre);
        deplacementparam(pierres[compteur]);
    }


//######################  FIN GUI  ###########################

}

