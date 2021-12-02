function camera_reset_pos(zoom) { //Fonction qui repositionne la caméra après un lancer
    camera.zoom = 0.5 - zoom;
    camera.position.x = 0;
    camera.position.z = 10;
    camera.position.y = 0.001;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
}

//Fonction qui fait en sorte que la caméra suive la pierre pendant le lancer
function camera_suivie(pierre) {
    camera.position.x = pierre.pierre.position.x - pierre.taille - 6;
    camera.position.y = pierre.pierre.position.y;
    camera.position.z = 4;
    camera.lookAt(pierre.pierre.position.x + 1, pierre.pierre.position.y, 1);
    camera.updateProjectionMatrix();
}


//Fonction qui retourne le minimum d'une liste
function getmini(tab) {
    let tab1 = [];
    //On boucle pour enlever les valeurs null du tableau
    for (let i = 0; i < tab.length; i++) {
        if (tab[i] !== null) {
            tab1.push(tab[i]);
        }
    }
    return Math.min(...tab1);
}


//Fonction qui détecte si il y a un choc entre les pierres
function chocDetected(force) {
    for (let i = 0; i < pierres.length; i++) {
        if (pierres[i].lancer !== false && !pierres[i].hors_piste) {
            for (let y = 0; y < pierres.length; y++) {
                if (pierres[y].lancer !== false && !pierres[y].hors_piste) {
                    if (i !== y) { //Pour s'assurer de ne pas comparer une pierre avec elle-même
                        //On récupère la position de la pierre i
                        let posi = new THREE.Vector3(pierres[i].pierre.position.x, pierres[i].pierre.position.y, pierres[i].pierre.position.z);
                        //De même avec la pierre y
                        let posy = new THREE.Vector3(pierres[y].pierre.position.x, pierres[y].pierre.position.y, pierres[y].pierre.position.z);
                        let distance = posi.distanceTo(posy); //On calcule la distance entre la pierre i et la pierre y
                        //console.log(distance <= liste_pierre[i].rayon + liste_pierre[y].rayon, distance, liste_pierre[i].rayon, liste_pierre[y].rayon)
                        if (distance < pierres[i].rayon + pierres[y].rayon) { //Si la distance entre les deux pierres est plus petite que la somme des rayons des 2 pierres, alors il y a choc
                            // console.log("choc detecter");
                            // console.log(pierres[i].pierre.position, pierres[y].pierre.position, pierres);
                            var dir = new THREE.Vector3().normalize(); //On récupère le vecteur normal
                            dir.subVectors(posi, posy);
                            chocanime(pierres[i], dir, force);
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}

//Fonction qui anime le choc entre 2 pierres
function chocanime(pierre, direction, force) {
    let x = direction.x * 0.014;
    let y = direction.y * 0.014;
    // console.log(pierre, x, y,Math.round(force*2));
    let i = 0;
    anime();

    function anime() {
        if (i < Math.round(force * 2)) {
            requestAnimationFrame(anime);
            pierre.pierre.position.x += x;
            pierre.pierre.position.y += y;
        }
        i++;
        chocDetected(force);
        calculeDistancetoMaison();
    }

}

//Calcul des distances à la maison de toutes les pierres lancées de la partie
function calculeDistancetoMaison() {
    for (let i = 0; i < pierres.length; i++) { //On boucle autant de fois que de pierres
        if (pierres[i].lancer) { //Si la pierre a été lancée
            //Si la pierre est hors piste :
            if (pierres[i].pierre.position.x > paramPiste.longueur / 2 + piste.position.x || -pierres[i].pierre.position.x > paramPiste.longueur / 2 + piste.position.x || pierres[i].pierre.position.y > paramPiste.largeur / 2 + piste.position.y || -pierres[i].pierre.position.y > paramPiste.largeur / 2 + piste.position.y) {
                scene.remove(pierres[i].pierre); //On l'enlève de la scène
                pierres[i].distance = null; //On met sa distance à null
                pierres[i].hors_piste = true; //On l'indique comme hors piste
            } else { //Sinon :
                //On calcule sa distance à la maison et on la met dans distance, une variable de la classe pierrre
                pierres[i].distance = Math.round(vectcentreMaison.distanceTo(new THREE.Vector2(pierres[i].pierre.position.x, pierres[i].pierre.position.y)) * 100) / 100;
            }
        }
    }
}