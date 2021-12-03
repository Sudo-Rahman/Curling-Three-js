function init() {
    demarage(); //Démarre la partie
    var gui = new dat.GUI(); //Initialisation du gui
    guicamera(gui); //Ajoute au gui les paramètres de la caméra


    //####################### PARAMÈTRES DES OBJETS ######################

    //Fonction qui retourne les paramètres de la piste
    paramPiste = new function () {
        this.longueur = 10;
        this.largeur = 2;
        //this.texture = new THREE.TextureLoader().load('../asset/glace2.jpg'); //Chargement de la texture pour la piste (abandonné)
        this.coul = "#a7d6ff";
    }

    //Fonction qui retourne les paramètres du balai
    let paramBalai = new function () {
        this.rayon = 0.1;
        this.hauteur = 1;
        this.longRec = 0.5;
        this.largRec = 0.25;
        this.hauteurRec = 0.05;
        //this.texture = new THREE.TextureLoader().load('../asset/bois.jpg'); //Chargement de la texture pour le manche du balai (abandonné)
        this.nbPoils = 50;
        this.coulbalai = "#783e0c";
        this.coulrec = "#6bc780"
        this.coulPoils = "#f7f9f9";
    }

    //Paramètres de base de la pierre 
    const paramPierre = new function () {
        this.taille = 0.1;
        this.coul = "#eb0f0f";
        this.coulCentre = "#1252d5";
        this.coul_endroit_pour_tenir = "#48bbbb"
    }

    //####################### FIN PARAMÈTRE DES OBJETS ######################


    //####################### PARAMÈTRES DE LA PARTIE ######################

    //Paramètres des lancers
    let paramLancer = new function () {
        this.forceN = 5;
        this.force_de_frottement = 0.2;
        this.balai = 0.2;
        this.lancer = function () {
        };
        this.id_lancer = "rectiligne";
    }

    //Paramètres de la partie
    let partie = new function () {
        this.choixequipe = 1; //variable pour sélectionner l'equipe et changer les paramètres de la pierre de l'équipe selectionnée dans le GUI
        this.commencer = function () {//fonction qui va lancer la partie
        };
        this.recommencer = function () { //Fonction recommence la partie
        };
    }
    // console.log(partie)

    //####################### FIN PARAMÈTRES DE LA PARTIE ######################

    // ####################### CRÉATION DES OBJETS #####################

    //Initialisation des pierres des équipes par défaut
    for (let y = 0; y < 5; y++) {
        pierres.push(new Pierrre(paramPierre, 1, "#1252d5"));
        pierres.push(new Pierrre(paramPierre, 2, "#ffffff"));
    }

    //Objets
    let objt = new Piste(paramPiste);
    piste = objt[0];//Création de la piste
    vectcentreMaison = new THREE.Vector2(objt[1].position.x,objt[1].position.y);
    scene.add(piste); //Ajout de la piste dans la scène

    //Création des deux balais
    var balais = [new Balai(paramBalai), new Balai(paramBalai)]; //Création des deux balais
    scene.add(balais[0], balais[1]); //Ajout des balais dans la scène
    placment_balai(); //On les place correctement sur la piste

    //Fonction qui place les balais à leur point de départ
    function placment_balai() {
        balais[0].position.x = piste.position.x - 0.70 * (paramPiste.longueur / 2); //Calcule la position x du balai (qui se situe à 0.70% de la moitié de la longueur de la piste, au début de la piste somme toute)
        balais[0].position.y = piste.position.y - paramPiste.largeur / 4; //Correspond au millieu de la largeur de la piste
        balais[0].position.z = paramBalai.hauteur / 2 + 0.075; //On le divise pour ne pas qu'une moitié soit d'un côté de la piste et l'autre moitié de l'autre côté de la piste

        balais[1].position.x = piste.position.x - 0.70 * (paramPiste.longueur / 2);
        balais[1].position.y = piste.position.y + paramPiste.largeur / 4;
        balais[1].position.z = paramBalai.hauteur / 2 + 0.075;
    }

    //Fonction évitant de faire des répétitions / Reconstruit les balais en fonction des paramètres du GUI
    function addAndRemoveBalais() {
        if (!etat_partie) { //Si la partie est en cours, on ne replace pas le balai au point de départ
            scene.remove(balais[0], balais[1]); //On ôte le balai de la scène
            balais = [new Balai(paramBalai), new Balai(paramBalai)];
            scene.add(balais[0], balais[1]); //On l'ajoute à la scène
            placment_balai();
        } else { //Sinon, on indique que la partie est en cours
            if (alertmess) {
                alert("Impossible partie commencé");
                alertmess = false;
            } else {
                setTimeout(() => { //Fonction qui permet de ne pas saturer la page d'alert
                    alertmess = true;
                }, 2000)
            }
        }
    }

    //Fonction qui recréera une piste avec les paramètres choisis par le joueur dans le GUI
    function addAndRemovePiste() {
        if (!etat_partie) { //Si la partie est en cours, on ne replace pas le balai au point de départ
            scene.remove(piste); //On retire la piste
            let objt = new Piste(paramPiste);
            piste = objt[0];//Création de la piste
            vectcentreMaison = new THREE.Vector2(objt[1].position.x,objt[1].position.y);
            scene.add(piste); //Ajout de la piste dans la scène
            placment_balai();
        } else {
            if (alertmess) {
                alert("Impossible partie commencé");
                alertmess = false;
            } else {
                setTimeout(() => { //Fonction qui permet de ne pas saturer la page d'alert
                    alertmess = true;
                }, 2000)
            }
        }
    }


//Fonction qui place la pierre en paramètre au début de la piste, quelle qu'en soit sa dimension
    function placement_pierre(pierre) {
        pierre.position.z = 0.0065; //Place la pierre sur la piste
        pierre.position.x = piste.position.x - 0.70 * (paramPiste.longueur / 2); //Place la pierre à 0.70% de la moitié de la longueur de la piste, au début de la piste
        pierre.rotation.z = (Math.PI / 2); //Tourne la pierre pour que l'anse soit derrieère la piste
    }

    //Fonction qui initialise les pierres d'une équipe en fonction des paramètres choisies dans le GUI
    function addAndRemovePierres() {
        if (!etat_partie) { //On s'assure que la partie n'ait pas commencé
            switch (parseInt(partie.choixequipe)) { //On fait un parsint car pour le chiffre 2, le GUI renvoie un string
                case 1: { //Équipe 1 selectionnée
                    for (let i = 0; i < 5; i++) { //On boucle 5 fois
                        pierres[i * 2] = new Pierrre(paramPierre, 1, paramPierre.coulCentre); //On ajoute les pierres à la liste
                    }
                }
                    break;
                case 2: { //Équipe 2 selectionnée
                    for (let i = 0; i < 5; i++) { //On boucle 5 fois
                        pierres[i * 2 + 1] = new Pierrre(paramPierre, 2, paramPierre.coulCentre); //On ajoute les pierres à la liste
                    }
                }
                    break;
            }
            // console.log(partie.equipe);
        } else { //Si la partie a commencé, on ne peut pas changer les paramètres des pierres
            if (alertmess) {
                alert("Impossible partie commencé"); //On fait une alert
                alertmess = false;
            } else {
                setTimeout(() => { //Fonction qui permet de ne pas saturer la page d'alert
                    alertmess = true;
                }, 2000)
            }
        }
    }

    var time = 0; //Servira a faire bouger les balais sur la pos Y
    var mode = 1; //Mode qui servira si les balais doivent avancer ou reculer
    var min_balais = 0;
    var max_balais = 0;

    function animeBalais(pierre, point) {
        animeBalaisX(pierre, point); //Les balais suivent les points du lancer au niveau de la posisiton x
        max_balais = point.y + pierre.rayon + piste.position.y + 0.2; //Intesité de l'aller des balais
        min_balais = point.y - pierre.rayon - piste.position.y - 0.2; //Intesité du retour des balais
        // console.log(max_balais, min_balais,balais[1].position.y);
        if (mode === 1) {
            balais[0].position.y = time + point.y; //Aller du balai 1
            balais[1].position.y = -time + point.y; //Retour du balai 2
            time += 0.014;
            if (time + point.y >= max_balais) {
                mode *= (-1);
            }
        }
        if (mode === -1) {
            balais[0].position.y = time + point.y; //Retour du balais 1
            balais[1].position.y = -time + point.y; //Aller du balais 2
            time -= 0.014;
            if (time + point.y <= min_balais) {
                mode *= (-1);
            }
        }
    }

    //Animation des balais dans le sens X
    function animeBalaisX(pierre, point) {
        balais[0].position.x = point.x + paramBalai.longRec + pierre.taille;
        balais[1].position.x = balais[0].position.x + paramBalai.longRec * 1.6;
        // console.log(balais[0].position.x, pierre)
    }

    //Fonction qui stock le lancer dans une variable
    function deplacementparam(pierre) {
        if (object != null) { //Si objet n'est pas null
            scene.remove(object[0]); //On enlève la prévisualisation du lancer de la scène

        }
        switch (paramLancer.id_lancer) { //On fait un switch entre ce que le joueur a choisi dans le GUI
            case "rectiligne": {
                //On met dans objet la prévisualisation du lancer et les points pour le lancer
                object = pierre.deplacementRectiligne(paramLancer.forceN * paramLancer.force_de_frottement * 5, paramLancer.balai);
                //console.log(object);
            }
                break;
            case "bezier": {
                object = pierre.deplacementBezier(paramLancer.forceN * paramLancer.force_de_frottement * 5, paramLancer.balai);
                //console.log(object)
            }
                break;
            case "bezier2": {
                object = pierre.deplacementBezier2(paramLancer.forceN * paramLancer.force_de_frottement * 5, paramLancer.balai);
                scene.add(object[0]);
                //console.log(object)
            }
        }
        scene.add(object[0]); //On ajoute la prévisualisation du lancer dans la scène
    }


    // ####################### FIN CREATION DES OBJETS #####################


    //################### DEBUT GUI  ##############################

    //Répertoire pour la piste
    let guiPiste = gui.addFolder("Piste"); //Création d'un répertoire piste dans le GUI
    guiPiste.add(paramPiste, "longueur", 5, 20).onChange(function () { //Modification de la longueur de la piste
        addAndRemovePiste();
    });
    guiPiste.add(paramPiste, "largeur", 1, 4).onChange(function () { //Modification de la largeur de la piste
        addAndRemovePiste();
    });
    guiPiste.addColor(paramPiste, "coul").onChange(function () { //Modification de la largeur de la piste
        if (!etat_partie) { //Si la partie est en cours, on ne replace pas le balai au point de départ
            scene.remove(piste);
            piste = piste = new Piste(paramPiste);
            scene.add(piste);
            placment_balai();
        }
    });

    //Répertoire pour les balais
    let guiBalai = gui.addFolder("balai");  //Création d'un répertoire piste dans le GUI du balai
    guiBalai.add(paramBalai, "rayon", 0.07, 0.15).onChange(function () { //Modification de la largeur de la piste
        addAndRemoveBalais();
    });
    guiBalai.add(paramBalai, "hauteur", 1, 3).onChange(function () { //Modification de la largeur de la piste
        addAndRemoveBalais();
    });
    guiBalai.add(paramBalai, "longRec", 0.5, 1.5).onChange(function () { //Modification de la largeur de la piste
        addAndRemoveBalais();
    });
    guiBalai.add(paramBalai, "largRec", 0.25, 0.75).onChange(function () { //Modification de la largeur de la piste
        addAndRemoveBalais();
    });
    guiBalai.addColor(paramBalai, "coulbalai").onChange(function () { //Modification de la largeur de la piste
        addAndRemoveBalais();
    });
    guiBalai.add(paramBalai, "nbPoils", 10, 1000).onChange(function () { //Modification de la largeur de la piste
        addAndRemoveBalais();
    });
    guiBalai.addColor(paramBalai, "coulPoils").onChange(function () { //Modification de la largeur de la piste
        addAndRemoveBalais();
    });
    guiBalai.addColor(paramBalai, "coulrec").onChange(function () { //modifModificationication de la largeur de la piste
        addAndRemoveBalais();
    });

    //Répertoire pour les pierres
    let guiPierre = gui.addFolder("Pierre"); //Création d'un répertoire Peirre dans le GUI
    guiPierre.add(paramPierre, "taille", 0.1, 0.35).onChange(function () { //Modification de la largeur de la piste
        addAndRemovePierres();
    });
    guiPierre.addColor(paramPierre, "coulCentre").onChange(function () { //Modification de la largeur de la piste
        addAndRemovePierres();
    });
    guiPierre.addColor(paramPierre, "coul").onChange(function () { //Modification de la largeur de la piste
        addAndRemovePierres();
    });
    guiPierre.addColor(paramPierre, "coul_endroit_pour_tenir").onChange(function () {
        addAndRemovePierres();
    });

    //Répertoire pour gérer la partie
    let guiPartie = gui.addFolder("Partie");// creation d'un repertoir Partie
    guiPartie.add(partie, "choixequipe", [1, 2]).name("choix equipe").onChange(function () {
    });
    guiPartie.add(partie, "commencer").name("Commencer la partie").onChange(function () {
        if (!etat_partie) {
            mess = document.getElementById("mess");
            webgl = document.getElementById("webgl");
            // console.log(mess);
            mess.innerHTML = "Lancer 1 de l'equipe 1"; //On initialise le texte des tours dans l'html
            mess.style.color = pierres[0].couleur; //On le met de la couleur de l'équipe 1
            webgl.style.borderColor = pierres[0].couleur;  //On met la couleur de la bordure du jeu a la couleur de l'equipe 1
            let tr = document.getElementsByTagName('tr');
            tr[1].children[0].style.color = pierres[0].couleur; //On met le texte de la ligne 2 colonne 1 de la couleur de l'équipe 1
            tr[2].children[0].style.color = pierres[1].couleur; //On met le texte de la ligne 3 colonne 1 de la couleur de l'équipe 2
            etat_partie = true; //On met l'état de la partie à True
            let pierre = pierres[compteur]; //On prend la première pierre
            scene.add(pierre.pierre); //On l'ajoute a la scène
            placement_pierre(pierre.pierre); //On le place correctement sur la piste
            deplacementparam(pierre); //On récupère la prévisualisation du lancer et les points de la pierre
            // console.log(pierres)
        }
    });
    guiPartie.add(partie, "recommencer").name("recommencer la partie").onChange(function () {
        location.reload(); //Recharche la page
    });

    //Répertoire pour les lancers
    let guiLancer = gui.addFolder("lancer");
    guiLancer.add(paramLancer, "forceN", 1, 25).onChange(function () {
        if (etat_partie && lancer_ok_point_d_interogation) { //On regarde que la partie soit démarrée et qu'il n'y ait pas de lancer en cours
            deplacementparam(pierres[compteur]); ////Recalcule le lancer avec les paramètres modifiés
        }
    });
    guiLancer.add(paramLancer, "force_de_frottement", 0.1, 1).onChange(function () {
        if (etat_partie && lancer_ok_point_d_interogation) { //On regarde que la partie soit démarrée et qu'il n'y ait pas de lancer en cours
            deplacementparam(pierres[compteur]); ////Recalcule le lancer avec les paramètres modifiés
        }
    });
    guiLancer.add(paramLancer, "balai", -1, 1).name("point de controle").onChange(function () {
        if (etat_partie && lancer_ok_point_d_interogation) { ///On regarde que la partie soit démarrée et qu'il n'y ait pas de lancer en cours
            deplacementparam(pierres[compteur]); //Recalcule le lancer avec les paramètres modifiés
        }
    });
    guiLancer.add(paramLancer, "id_lancer", ["rectiligne", "bezier", "bezier2"]).name("choix lancer").onChange(function () {
        if (etat_partie && lancer_ok_point_d_interogation) { //On regarde que la partie a bien été lancer et qu'il n'y a pas de lancer en cours
            deplacementparam(pierres[compteur]); //Recalcule le lancer avec les paramètres modifiés
        }
    });
    guiLancer.add(paramLancer, "lancer").onChange(function () { //Modification de la largeur de la piste
        if (etat_partie && lancer_ok_point_d_interogation) { //On regarde que la partie soit démarrée et qu'il n'y ait pas de lancer en cours
            scene.remove(object[0]); //On enlève la prévisualisation du lancer de la scène
            time = 0;
            time2 = 0;
            let pierre = pierres[compteur]; //On récupère la ième pierre du ième lancer
            let i = 0; //On initialise i à 0
            lancer_ok_point_d_interogation = false; //On met la variable à False
            lancer();

            //Fonction qui gère le lancer de la pierre avec toutes ses contraintes : chocs, animations
            function lancer() {
                if (i !== object[1].length) { //On boucle autant de fois que de points
                    pierre.lancer = true; //On met la variable lancer de la pierre à True
                    pierre.deplacement(object[1][i]); //On déplace la pierre aux coordonnés du i-ème point
                    if (compteur >= 1) { //Pour la première pierre à lancer, on ne vérifie pas s'il y a des chocs
                        if (!chocDetected(paramLancer.forceN)) { //Si on ne détecte pas de chocs, on continue l'animation
                            requestAnimationFrame(lancer);
                        } else { //S'il y a un choc, la fonction chocDetected appelle une autre fonction pour réaliser le ou les chocs
                            lancerend();
                        }
                    } else {
                        requestAnimationFrame(lancer);
                    }
                    if (balais[1].position.x < vectcentreMaison.x) { //On s'assure que les balaise n'atteignent pas en x le centre de la maison
                        animeBalais(pierre, object[1][i]);
                        camera_suivie(pierre);
                    } else { //Si les balais atteignent en x le centre de la maison, ils se mettent sur le côté de la piste
                        balais[0].position.y = pierre.pierre.position.y + 5 * pierre.taille;
                        balais[1].position.y = pierre.pierre.position.y + 5 * pierre.taille;
                    }
                    i++;
                } else { //Si pas de chocs au lancer
                    lancerend();
                }
            }
        } else {
            if(!lancer_ok_point_d_interogation){
                alert("Attendez que le lancer se termine");
            }
            if(compteur === 9){
                alert("La partie est terminé recommencer la pour pouvoir rejouer");
            }
        }

    });

    //Fonction qui se lance à la fin d'un lancer, il réactualise les positions des pierres des scores, et réinitialise la position de la caméra
    function lancerend() {
        setTimeout(() => { //On attend deux secondes avant de recalculer les positions des pierres et on reset la pos de la caméra
            compteurr(); //On incrémente le compteur de lancer de pierres
            camera_reset_pos(paramPiste.longueur / 100); //On reset la position de la caméra
            lancer_ok_point_d_interogation = true;
        }, 2000);
    }

    //Fonction qui sert à augmenter le compteur après chaque lancer
    function compteurr() {
        if (compteur === 9) { //Si tous les lancers ont été effectués
            arreter_partie(); //On arrête la partie
            placment_balai(); //On replace les balais
            return false;
        } else { //Sinon
            compteur++; //On incremente le compteur de 1
            // console.log(compteur);
            actualisationDistancetoMaison(); //On actualise le tableau des distances
            addPierreGame(); //On ajoute la prochaine pierre à la scène
            message_tour(); //On affiche le message dans l'html
            return true;
        }

    }

    //Fonction qui actualise les valeurs dans le tableau dans l'html
    function actualisationDistancetoMaison() {
        calculeDistancetoMaison(); //On calcule les distances des pierres
        let min = new Pierrre(paramPierre, -1, 'black'); //On créé une pierre factice pour comparer les distances
        min.distance = 100000; //On initialise sa distance
        let pierre = null; //On initialise pierre à null
        let pierrereturn = null; //On initialise la pierre qui sera retourner à null
        let tr = document.getElementsByTagName('tr'); //On récupère le tableau du html
        for (let i = 1; i < tr.length; i++) {
            for (let o = 1; o < 6; o++) { //On boucle sur les cases des distances
                if (i === 1) { //Si i est égal à 1, alors c'est l'équipe 1
                    pierre = pierres[(o - 1) * 2]; //On met un a 1 les pierre de l'équipe 1 en commençant de 0 dans pierre
                } else {//sinon equipe 2
                    pierre = pierres[(o * 2) - 1];
                }
                if (pierre.hors_piste) { //On regarde si la pierre est hors piste
                    tr[i].children[o].innerHTML = "Hors piste"; //Si elle l'est, alors on marque "hors piste" dans la case
                } else {//sinon
                    if (pierre.distance != null) { //On regarde que la distance de la pierre n'est pas null
                        tr[i].children[o].innerHTML = pierre.distance + " m du centre de la maison"; //On met sa distance dans la case
                        if (pierre.distance < min.distance) { //On compare la distance de la pierre au min
                            min = pierre; //Si la distance de la pierre est plus petite que le min, on met dans min par la pierre la plus proche de la maison
                            // console.log(pierre)
                            coloriage(min.couleur); //On applique la couleur de l'équipe qui a la distance plus petite sur toutes les cases
                            pierrereturn = pierre; //On met la pierre dans la variable pierrereturn
                        } else { //Sinon
                            if (pierre.equipe !== min.equipe) { //On vérifie que le lancer et le min ne soient pas de la même équipe
                                if (pierre.distance === min.distance) { //On regarde s'il y a égalité
                                    pierrereturn = new Pierrre(paramPierre, -1, "black"); //S'il y a égalité, on retourne une pierre spéciale
                                    pierrereturn.distance = min;
                                }
                            }
                        }
                    }
                }
            }
        }

        return pierrereturn;
    }

//Fonction qui met le texte à la couleur de l'équipe gagnante
    function coloriage(coul) {
        let tr = document.getElementsByTagName('tr');
        for (let i = 1; i < tr.length; i++) { //On boucle pour changer la couleur de l'écriture dans le tableau avec l'équipe la plus proche
            for (let o = 1; o < 6; o++) {
                tr[i].children[o].style.color = coul;
            }
        }
    }


//Fonction qui actualise le message de la page html pour les tours
    function message_tour() {
        let pierre = actualisationDistancetoMaison();
        mess.innerHTML = "Lancer " + (parseInt(compteur / 2) + 1) + " de l'equipe " + (compteur % 2 + 1);
        mess.style.color = pierres[compteur].couleur;
        document.getElementById('webgl').style.borderColor = pierres[compteur].couleur;
        if (pierre != null && pierre.equipe !== -1) {
            mess.innerHTML += " : L'équipe n° " + pierre.equipe + " est en tete avec un distance de " + pierre.distance + " m du centre de la maison";
        }
    }

//Fonction qui arrête la partie quand le compteur atteint le nombre de lancer (qui vaut 9)
    function arreter_partie() {
        let pierre = actualisationDistancetoMaison();
        // console.log(pierre);
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


//Fonction qui place les balais et ajoute la pierre suivante pour le prochain lancer
    function addPierreGame() {
        placment_balai(); //Place les balais
        let pierre = pierres[compteur].pierre;
        scene.add(pierre); //Ajout de la pierre à la scène
        placement_pierre(pierre); //Placement de la pierre sur la piste
        deplacementparam(pierres[compteur]); //Création de la trajectoire du lancer
    }


//######################  FIN GUI  ###########################

}
