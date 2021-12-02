var etat_partie = false; //Permettra de savoir si la partie est commencée ou non
var vectcentreMaison = new THREE.Vector2(0, 0); //Variable qui stocke les coordonnées du centre de la maison
var paramPiste;
var piste;
var scene;
var camera;
var pierres = []; //Liste qui stockera les pierres des deux équipes
var compteur = 0; //Compteur qui servira à gérer les tours
var alertmess = true; //Variable initialisée à True qui sert à ne pas spamer d'alert
var mess; //Variable qui va stocker l'élément html mess où sera indiqué le tour d'une équipe et qui annoncera le gagnant
var webgl; //Variable qui va stocker l'élément html Webgl
var lancer_ok_point_d_interogation = true; //Variable initialisée à True qui servira à ne pas lancer d'autres pierres avant que celle déjà lancée ne se soit arrêtée
var object = null; //Variable qui contiendra la courbe de prévisualisation du lancer et les points de déplacement
