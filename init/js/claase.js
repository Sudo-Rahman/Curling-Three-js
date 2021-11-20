class Pierrre{
    constructor(param, equipe,couleur) {
        this.equipe = equipe;
        this.pierre = new Pierre(param);
        this.couleur = couleur;
        this.taille = param.taille;
    }
}