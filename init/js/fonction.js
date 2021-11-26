function camera_reset_pos(camera, zoom) {//fonction qui repositionne la camera apres un lancer
    camera.zoom = 0.5 - zoom;
    console.log(zoom)
    camera.position.x = 0;
    camera.position.z = 10;
    camera.position.y = 0.001;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
}

//fonction qui fait en sorte que la camera suive la pierre pendant le lancer
function camera_suivie(camera, pierre) {
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
function chocDetected(liste_pierre) {
    for (let i = 0; i < liste_pierre.length; i++) {
        if (liste_pierre[i].lancer !== false && !liste_pierre[i].horsPiste) {
            for (let y = 0; y < liste_pierre.length; y++) {
                if (liste_pierre[y].lancer !== false && !liste_pierre[y].horsPiste) {
                    if (i !== y) {
                        let posi = new THREE.Vector3(liste_pierre[i].pierre.position.x, liste_pierre[i].pierre.position.y, liste_pierre[i].pierre.position.z);
                        let posy = new THREE.Vector3(liste_pierre[y].pierre.position.x, liste_pierre[y].pierre.position.y, liste_pierre[y].pierre.position.z);
                        let distance = posi.distanceTo(posy);
                        //console.log(distance <= liste_pierre[i].rayon + liste_pierre[y].rayon, distance, liste_pierre[i].rayon, liste_pierre[y].rayon)
                        if (distance <= liste_pierre[i].rayon + liste_pierre[y].rayon) {
                            console.log("choc detecter");
                            console.log(liste_pierre[i].pierre.position, liste_pierre[y].pierre.position, liste_pierre);
                            var dir = new THREE.Vector3();
                            dir.subVectors(posi, posy).normalize();
                            return [true, chocanime(liste_pierre[i], dir, liste_pierre)];
                        }
                    }
                }
            }
        }
    }
    return false;
}

function chocanime(pierre, direction, lstpierre) {
    let x = direction.x * 0.014;
    let y = direction.y * 0.014;
    console.log(pierre, x, y);
    let i = 0;
    anime();

    function anime() {
        if (i < 35) {
            requestAnimationFrame(anime);
            pierre.pierre.position.x += x;
            pierre.pierre.position.y += y;
        }
        i++;
        chocDetected(lstpierre);
        calculeDistancetoMaison(lstpierre);
    }

}

function calculeDistancetoMaison(liste_pierre) {
    for (let i = 0; i < liste_pierre.length; i++) {
        if (liste_pierre[i].lancer) {
            if (liste_pierre[i].pierre.position.x > paramPiste.longueur / 2 + piste.position.x || liste_pierre[i].pierre.position.y > paramPiste.largeur / 2 + piste.position.y || -liste_pierre[i].pierre.position.x < -paramPiste.longueur / 2 + piste.position.x) {
                scene.remove(liste_pierre[i].pierre);
                liste_pierre[i].distance = null;
                liste_pierre[i].hors_piste = true;
                console.log("je suis la ")

            } else {
                console.log("bbbb")
                liste_pierre[i].distance = Math.round(vectcentreMaison.distanceTo(new THREE.Vector2(liste_pierre[i].pierre.position.x, liste_pierre[i].pierre.position.y)) * 100) / 100;
            }
        }
    }
    console.log(liste_pierre)
}