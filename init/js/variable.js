var etat_partie = false;// va permettre de savoir si la partie a commencé ou non
var vectcentreMaison = new THREE.Vector2(0, 0); // var qui stock les coordonné du centre de la maison
var paramPiste;
var piste;
var scene;
var camera;
var pierres = []; // liste qui va stocker les pierres des 2 equipes
var compteur = 0; // compteur qui servira pour gerer les tours
var alertmess = true; // var initialisé a vrai qui sert a ne pas spamé d'alert
var mess; // var qui va stock l'element html mess ou sera indiqué le tour d'une equipe et qui annoncera le gagnant
var webgl;// var qui va stocker l'element html webgl
var lancer_ok_point_d_interogation = true;// var initialisé a vrai qui servir a ne pas lancer d'autres pierre avant que celle lancer ne se soit pas arreter
var object = null;// variable qui va contenir la courbe de previsualisation du lancer et les points de delpacement
