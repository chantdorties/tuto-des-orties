# Captures à refaire

Les vingt premières captures ont été refaites le 9 octobre 2026 contre `main`
(commit `4f4388e`), les captures 21 et 22 (blocs de mise en forme) contre `f15154b` ;
voir `matrice-captures.md`.

Depuis la PR #37 (`a16b2d6`), quelques détails ont changé, sans gêner la lecture :

- `04-accueil` : les champs devenus facultatifs portent la mention « optionnel », et
  les blocs 2 à 4 commencent par la case « Masquer ce bloc » (hors du cadre actuel) ;
- `19-page-principale` : « Rubrique » et « Introduction » portent la mention
  « optionnel » ;
- `15-page-fiche` : chaque section se termine par la case « Masquer cette section ».
- `19-page-principale` : depuis la PR #38, un groupe « Sections ajoutées » suit
  l’introduction (sous le cadre actuel).

La capture 23 (sections ajoutées) a été prise contre `3239698`. Les captures 22 et 24
ont été refaites, et 25 et 26 ajoutées, contre `069073d` (PR #42 et #43).

- `21-blocs` : le menu des blocs compte maintenant aussi « Image placée », « Bouton »,
  « Tableau » et « Vidéo » (hors du cadre actuel).
- `22-composants` : le menu ne montre pas encore « Tableau » et « Vidéo ».

La capture 27 (six sortes de section) a été prise contre `e35c257` (PR #44).
La capture 28 (tableau et vidéo) a été prise contre `e7c5993` (PR #45).

- `23-sections-ajoutees` : le menu « Ajouter une entrée de type section » propose
  maintenant six sortes, et non plus trois.
- `20-mes-pages-page` : même menu, hors du cadre actuel.

## Quand refaire une capture

Après tout changement de l’administration visible sur l’écran capturé : libellé,
rubrique, bouton, ordre du menu. La règle est rappelée dans `nouveau-site/AGENTS.md`.

## Consignes

- Capturer l’administration locale (`make admin`, port 8766), sans enregistrer ni publier.
- Cadrage : bureau, 1440 × 900 ; attendre que l’aperçu et les vignettes soient chargés.
- Le menu « Pages » déplié, pour qu’on voie Mes pages et Pages principales.
- Ne jamais montrer de compte GitHub, de jeton, de mot de passe ou d’information privée.
