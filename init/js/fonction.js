function camera_reset_pos(zoom) {//fonction qui repositionne la camera apres un lancer
    camera.zoom = 0.5 - zoom;
    camera.position.x = 0;
    camera.position.z = 10;
    camera.position.y = 0.001;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
}

//fonction qui fait en sorte que la camera suive la pierre pendant le lancer
function camera_suivie(pierre) {
    camera.position.x = pierre.pierre.position.x - pierre.taille - 6;
    camera.position.y = pierre.pierre.position.y;
    camera.position.z = 4;
    camera.lookAt(pierre.pierre.position.x + 1, pierre.pierre.position.y, 1);
    camera.updateProjectionMatrix();
}


//fonction qui retourne le mini d'une liste
function getmini(tab) {
    let tab1 = [];
    //on boucle pour enlever les valeurs nuull
    for (let i = 0; i < tab.length; i++) {
        if (tab[i] !== null) {
            tab1.push(tab[i]);
        }
    }
    return Math.min(...tab1);
}


// fonction qiui detecte si il y a un choc entre les pierres
function chocDetected(force) {
    for (let i = 0; i < pierres.length; i++) {
        if (pierres[i].lancer !== false && !pierres[i].hors_piste) {
            for (let y = 0; y < pierres.length; y++) {
                if (pierres[y].lancer !== false && !pierres[y].hors_piste) {
                    if (i !== y) {
                        let posi = new THREE.Vector3(pierres[i].pierre.position.x, pierres[i].pierre.position.y, pierres[i].pierre.position.z);
                        let posy = new THREE.Vector3(pierres[y].pierre.position.x, pierres[y].pierre.position.y, pierres[y].pierre.position.z);
                        let distance = posi.distanceTo(posy);
                        //console.log(distance <= liste_pierre[i].rayon + liste_pierre[y].rayon, distance, liste_pierre[i].rayon, liste_pierre[y].rayon)
                        if (distance < pierres[i].rayon + pierres[y].rayon) {
                            // console.log("choc detecter");
                            // console.log(pierres[i].pierre.position, pierres[y].pierre.position, pierres);
                            var dir = new THREE.Vector3().normalize();
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

//calcule des distance la maison de toutes les pierres de la partie qui ont été lancer
function calculeDistancetoMaison() {
    for (let i = 0; i < pierres.length; i++) {//on boucle autant de fois que de pierres
        if (pierres[i].lancer) {//si la pierre a été lancer
            //si la pierre est hors piste
            if (pierres[i].pierre.position.x > paramPiste.longueur / 2 + piste.position.x || -pierres[i].pierre.position.x > paramPiste.longueur / 2 + piste.position.x || pierres[i].pierre.position.y > paramPiste.largeur / 2 + piste.position.y || -pierres[i].pierre.position.y > paramPiste.largeur / 2 + piste.position.y) {
                scene.remove(pierres[i].pierre);// on l'enleve de la scene
                pierres[i].distance = null;// on met sa distance a null
                pierres[i].hors_piste = true;// on l'indique comme hors piste
            } else {// sinon
                // on calcule sa distance a la maison et on le met dans distance une variable de la classe pierrre
                pierres[i].distance = Math.round(vectcentreMaison.distanceTo(new THREE.Vector2(pierres[i].pierre.position.x, pierres[i].pierre.position.y)) * 100) / 100;
            }
        }
    }
}