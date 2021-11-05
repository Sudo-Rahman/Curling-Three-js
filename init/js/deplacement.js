function deplacementRectiligne(pierre, force) {
    pierre.position.x += force * 0.5;
}

function deplacementBezier(pierre, force){

}

function deplacement(choix, pierre, force, intensite) {
    switch (choix) {
        case 1:
            deplacementRectiligne(pierre, force, intensite);
            break;
        case 2:
    }
}