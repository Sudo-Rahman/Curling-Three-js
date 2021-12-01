# projet en info3B à l'université de bourgogne
Autheur : Rahman YILMAZ, Lucie DUBOST
Copyright : Rahman YILMAZ, Lucie DUBOST
Réalisation d'un site web pour pouvoir faire une partie de curling
Language utilisé : javascript (librairie THREE js), css, html

Quelques contraintes du sujet à l’aide :
  • les pierres doivent être construites :
    - D’au moins trois surfaces de révolution avec un raccord G1 entre chaque surface,
      l’utilisation d’au moins deux « lathe » lisses est obligatoire et celles-ci doivent se raccorder entre elles.
    - Les pierres des deux équipes sont de couleur différentes.
    - Pour chaque pierre, la « lathe » intermédiaire a une couleur différente des deux autres surfaces de révolution.

  • les balais doivent être construits à l’aide :
    - Un cylindre pour le manche.
    - Un parallélépipède rectangle.
    - Des cônes de révolution pour les poils.

  • Déplacement et animation : 
    - Un déplacement rectiligne.
    - Un déplacement plan non rectiligne via des courbe(s) de Bézier (avec jointure G1).
    - Un menu permettant de modifier la trajectoire de la pierre sur la glace via les balais ce qui conduit à la modification de certains points de contrôle (ce       projet n’est pas une simulation).
    - Après chaque lancer, le score (nombre de pièces de la même équipe dans la maison le plus proche du centre) est ajouté dans un tableau dans la page html et       la couleur du texte est celle de la pierre de l’équipe qui mène (un choix est à faire dans le cas où il n’y a pas depierre dans la maison).
   
  • Rapport pour vendre le travail, le mettre en valeur.

Fonctionnalités additionnelles ajoutées en plus :
  
  - Possibilité de modifier les paramètres des objets avant de lancer la partie telle que la taille d'une pierre, sa couleur, la taille de la piste, des             balais...
  - Prise en charge du hors-piste : dès qu'une pierre n'est pas dans la piste il sera considére hors-piste et donc on ne comptabilisera pas sa distance à la         maison.
  - Prise en charge des chocs entre toutes les pierres : exemple> une pierre lancer avec une grosse force peut éjecter toutes les pierres sur la piste en dehors     de la piste pour qu'elles soient hors-piste.
  - Ajout d'un lancer bezier2 sans jointure pour avoir des 3 déplacements.
  - Ajout des ombres, de la réflectivité de la lumière sur la piste, les objets...
  - Lors du lancer, ajout d'un tracking, la caméra suit de pres le lancer.
