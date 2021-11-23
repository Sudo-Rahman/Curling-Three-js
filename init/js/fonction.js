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
        if (liste_pierre[i].lancer !== false) {
            for (let y = 0; y < liste_pierre.length; y++) {
                if (liste_pierre[y].lancer !== false) {
                    if (i !== y) {
                        let posi = new THREE.Vector2(liste_pierre[i].pierre.position.x, liste_pierre[i].pierre.position.y);
                        let posy = new THREE.Vector2(liste_pierre[y].pierre.position.x, liste_pierre[y].pierre.position.y);
                        let diametrei = new THREE.Vector2(liste_pierre[i].pierre.position.x,liste_pierre[i].pierre.position.y).distanceTo(new THREE.Vector2(liste_pierre[i].pierre.children[2].geometry.vertices[0].x,liste_pierre[i].pierre.children[2].geometry.vertices[0].y));
                        let distance = posi.distanceTo(posy);
                        console.log(distance<=liste_pierre[i].taille+liste_pierre[y].taille, distance, diametrei)
                        if(distance<=0.01){
                            console.log("choc detecter");
                        }
                    }
                }

            }
        }
    }
}