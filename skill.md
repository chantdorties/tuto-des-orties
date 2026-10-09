---
name: chant-orties-site-admin
description: "Référence à lire avant toute modification du site Chant d’orties, de son générateur, de son administration ou de ses styles ; le tutoriel utilisateur n’est qu’un livrable parmi les usages de cette compétence."
---

# Compétence : site Chant d’orties et administration

Ce document est une référence de projet à utiliser avant toute modification du site,
qu’elle concerne le code public, les fichiers JSON, le générateur Python, l’interface
Decap, les aperçus, le CSS, les tests ou le déploiement. Il explique l’architecture,
le fonctionnement de l’application publique, le rôle de l’administration et les règles
à respecter. Le tutoriel utilisateur visible dans `index.html` est seulement une
application de ces règles ; il ne limite pas le périmètre de cette compétence.

## Quand lire cette compétence

La lire au début de toute tâche qui touche à l’un des éléments suivants :

- un fichier dans `content/`, un réglage ou une relation entre contenus ;
- `frontend/admin/config.yml`, `preview.js`, `preview.css` ou les vignettes ;
- `tools/content_data.py`, `tools/rendu/` ou la génération de `dist/` ;
- une feuille CSS, une variable de thème ou un comportement JavaScript public ;
- la validation, le workflow GitHub, l’authentification ou le déploiement Free ;
- la documentation destinée à la personne qui administre le site.

Si une demande ne concerne que le tutoriel statique externe, lire au minimum les
sections « Architecture générale » et « Règles pour une IA » afin de ne pas expliquer
un fonctionnement qui ne correspond pas au site réel.

## 1. Architecture générale

Le projet n’utilise pas de base de données classique et le site public n’est pas une
application Python exécutée à chaque visite.

```text
contenu JSON + médias
        │
        ▼
validation Python
        │
        ▼
générateur Python : données + gabarits + CSS
        │
        ▼
dist/ : HTML, CSS, JavaScript et médias statiques
        │
        ▼
hébergement HTTPS chez Free
```

### Sources de vérité

- `content/` contient les contenus éditoriaux sous forme de fichiers JSON et les médias.
- `content/pages-du-site/` contient une fiche par page principale générée : Accueil,
  Catalogue, Auteurs et illustrateurs, Collections, Actualités, La maison et Projets.
- `content/pages/` contient les pages écrites librement dans « Mes pages ».
- `frontend/templates/` contient les gabarits HTML.
- `frontend/assets/css/` contient les feuilles de style du site public.
- `frontend/assets/js/` contient les comportements nécessaires côté navigateur.
- `tools/content_data.py` charge, normalise et valide les données.
- `tools/rendu/` construit les pages, les composants, la feuille de style et la sortie.
- `dist/` est le résultat généré. Il ne doit pas être modifié manuellement pour corriger
  un contenu.

Le site est donc éditorialement piloté par les JSON, mais la visite publique reçoit des
fichiers HTML déjà construits. Une modification devient visible uniquement après une
nouvelle génération puis un déploiement.

## 2. Fonctionnement du site public

1. Le générateur lit les réglages, les livres, les personnes, les collections, les
   actualités, les projets et les pages.
2. Il vérifie les relations : auteur existant, collection existante, média présent,
   ordre unique, statut cohérent et bouton PayPal valide.
3. Il transforme le contenu en HTML, CSS et JavaScript statiques.
4. Les médias sont traités par le système d’optimisation prévu.
5. Les fichiers produits sont déposés dans `dist/`, puis envoyés chez Free par le
   workflow de publication.

Le navigateur du visiteur ne connaît pas Python ni les fichiers JSON. Il reçoit le HTML
final, les styles et les petits scripts nécessaires : recherche, navigation, panier,
galeries ou comportements d’interface.

## 3. Fonctionnement de l’administration

L’administration est Decap CMS, configurée dans
`frontend/admin/config.yml`. Elle donne un formulaire lisible à une personne qui ne
doit toucher ni au HTML, ni au CSS, ni au JSON.

### Ce que fait une fiche

- Un champ du formulaire correspond à une donnée du JSON.
- L’aperçu à droite montre le rendu de la zone concernée.
- Les listes, relations, statuts, médias et champs obligatoires sont contrôlés avant
  la publication.
- Les aperçus de l’administration sont des maquettes synchronisées avec les classes du
  site public ; ils ne remplacent pas la vérification du site en ligne.

### Parcours local

```text
make admin
  ├─ serveur de développement : http://127.0.0.1:8766/admin/
  └─ proxy Decap local : http://127.0.0.1:8082
```

En local, le proxy écrit directement dans `content/`. Le flux éditorial GitHub n’est
pas utilisé. Si le port 8766 est déjà occupé, il faut arrêter l’ancien serveur ou
lancer le développement sur un autre port selon les commandes du `Makefile`.

### Parcours en ligne

1. La personne ouvre l’administration HTTPS sur le domaine officiel.
2. Decap authentifie un compte GitHub autorisé sur le dépôt.
3. « Enregistrer » crée une modification dans le flux éditorial.
4. La validation GitHub reconstruit et teste le site sans toucher immédiatement à la
   production.
5. « Publier » fusionne la modification dans `main`.
6. GitHub Actions reconstruit le site et déclenche le déploiement chez Free.

Le relais d’authentification externe échange le code GitHub contre un jeton. Les
secrets OAuth et les identifiants FTP ne doivent jamais être dans le dépôt, le site,
le tutoriel ou une capture d’écran.

## 4. Rubriques administrables

| Rubrique | Rôle |
| -------- | ---- |
| Réglages du site | Identité, menu, pied de page, paiement et apparence. |
| Pages principales | Accueil, introductions, référencement et anciennes adresses des pages générées. |
| Livres | Fiches, couvertures, vente, caractéristiques, extraits et mise en avant. |
| Auteurs et illustrateurs | Personnes, rôles, portraits, biographies et liens. |
| Collections | Nom, emblème, texte, texte alternatif et ordre. |
| Actualités | Date, catégorie, résumé, article, image, lien et PDF. |
| Projets | Livres à paraître, intervenants et date prévue. |
| Mes pages | Pages libres composées de sections, images, livres et boutons. |
| Media | Ressources téléversées, recherche et réutilisation d’images. |

Chaque information globale doit être réglée à un seul endroit. L’accueil complet se
règle dans « Pages → Pages principales → Accueil ». Les introductions, le référencement
et les anciennes adresses des pages générées se règlent dans la fiche correspondante de
« Pages principales ». Les pages écrites manuellement se trouvent dans « Pages → Mes
pages ».

Les sept entrées de « Pages principales » sont : Accueil, Catalogue, Auteurs et
illustrateurs, Collections, Actualités, La maison et Projets. Les blocs techniques des
pages générées sont repliés par défaut ; il ne faut les ouvrir que pour une correction
documentée. « Mes pages » sert aux pages rédigées manuellement et accepte des sections
Texte, Texte + catalogue et Offre à vendre (bouton PayPal). Le titre d’une page libre
produit son adresse automatiquement : après publication, ne pas le modifier sans
prévoir une ancienne adresse.

## 5. Règles de publication

### Statuts à ne pas confondre

- **Publié** : le contenu peut apparaître sur le site après publication du changement.
- **Brouillon** : le contenu est préparé mais reste invisible du public.
- **Archivé** : le contenu est retiré du site sans être effacé.

Le mot « brouillon » existe aussi dans les colonnes du flux éditorial. Là, il décrit
l’avancement de la modification, pas la visibilité du contenu.

### Règles de contenu

- Ne pas changer l’adresse (`slug`) d’une page déjà publiée sans ajouter son ancienne
  adresse dans « Anciennes adresses ».
- Utiliser **Archivé** plutôt que supprimer un livre, une personne, une collection,
  une actualité ou une page. Seuls les projets peuvent être supprimés.
- Les mentions légales doivent rester publiées à `/mentions-legales/`.
- Une collection doit avoir exactement un livre disponible mis en avant sur l’accueil.
- Un livre disponible doit avoir un identifiant PayPal valide de 13 caractères.
- Un bouton PayPal de page spéciale doit être créé pour cette offre ; ne pas réutiliser
  celui d’un livre au prix normal.
- Une relation ne doit pas pointer vers une fiche inexistante, en brouillon ou archivée
  lorsque la page exige un contenu publié.
- Un ordre ne peut pas être partagé par deux contenus de la même liste.

## 6. Règles des médias et de l’accessibilité

- La limite d’un fichier média est de 20 Mo.
- Une image d’actualité, un emblème de collection ou une image insérée dans un texte
  doit avoir un texte alternatif lorsque la validation l’exige.
- Le texte alternatif décrit ce qui est utile à comprendre, pas le nom de fichier.
- Une couverture ou un portrait peut recevoir une formulation automatique si le champ
  reste vide, sauf lorsque la rubrique impose une description.
- Les images sont optimisées par le système existant ; ne pas contourner ce flux en
  ajoutant des fichiers générés à la main dans `dist/`.

## 7. Règles de style et de fonctionnement

### Style public

- Les couleurs globales sont centralisées dans les variables CSS de
  `frontend/assets/css/00-variables.css`.
- L’apparence réglable est limitée aux couleurs et aux polices autorisées dans
  `content/reglages/apparence.json`.
- L’administration ne doit jamais accepter du CSS libre, du HTML libre ou une URL de
  police arbitraire.
- La mise en page, les tailles, les espacements, les points de rupture responsive et
  le pied de page sombre restent contrôlés par le code.
- Toute réorganisation CSS doit conserver l’apparence existante avant/après, sur
  desktop, tablette et mobile.
- Les couleurs doivent rester lisibles sur les fonds, liens, boutons et textes.
- Le pied de page affiche aussi, en dur, le crédit « Site créé par Facundo Varas —
  varascundo.com » ; ce lien ne vient pas des réglages éditoriaux.

### Bannière cookies

- Le gabarit commun affiche une bannière accessible sur chaque page publique.
- Elle ne déclenche aucun traceur et ne dépose aucun cookie : le choix « Accepter »
  ou « Refuser » est mémorisé uniquement dans `localStorage` pour éviter de répéter
  la bannière sur le même navigateur.
- Le comportement est dans `frontend/assets/js/site.js` et le style dans
  `frontend/assets/css/43-banniere-cookies.css` ; ne pas ajouter d’outil de suivi sans
  revoir les mentions légales et le consentement.

### Style des formulaires et aperçus

- Employer des libellés simples pour une personne non technique.
- Placer les champs dans l’ordre de lecture : essentiel, contenu métier, images et
  documents, puis réglages techniques.
- Mettre une explication courte sous chaque champ qui peut prêter à confusion.
- Ne pas dupliquer un même réglage dans plusieurs écrans.
- Toute nouvelle classe utilisée par un aperçu doit aussi exister dans le site généré.
- Un changement de formulaire ne doit pas modifier le rendu public par accident.

### Règles d’implémentation

- Lire et valider les données avant de générer une page.
- Fournir une valeur par défaut sûre lorsqu’un réglage facultatif manque.
- Refuser proprement une valeur invalide avec un message qui nomme le champ concerné.
- Tester les contenus valides, invalides, anciens et nouvellement créés.
- Comparer `dist/` avant et après une modification qui prétend ne changer que
  l’administration.
- Ne jamais modifier les identifiants, mots de passe, secrets OAuth ou identifiants FTP
  pour résoudre un problème de contenu.

## 8. Règles pour une IA qui intervient sur le projet

Avant de modifier :

1. Déterminer si la demande concerne le contenu, le formulaire d’administration, le
   générateur, le style public ou le déploiement.
2. Lire le fichier JSON, le schéma, le champ Decap et le code de rendu concernés.
3. Vérifier les règles de compatibilité avec les anciens contenus.
4. Ne pas confondre le site local, `origin/main`, le site généré et la production.
5. Ne jamais publier, pousser ou modifier un secret sans demande explicite.

Après modification :

1. Lancer les validations adaptées.
2. Vérifier l’aperçu et le site généré.
3. Contrôler au moins desktop, tablette et mobile lorsqu’un style ou une structure
   visuelle change.
4. Signaler séparément ce qui est vérifié localement et ce qui est réellement déployé.
5. Documenter la nouvelle règle ou le nouveau parcours si une personne non technique
   doit l’utiliser.

## 9. Mise à jour obligatoire de cette compétence

Après une modification du site qui a été validée puis poussée vers le dépôt distant :

1. Relire le changement livré et vérifier s’il modifie l’architecture, le parcours
   d’administration, une règle de contenu, le style, la validation ou le déploiement.
2. Mettre à jour ce `skill.md` si l’une de ces informations a changé.
3. Ajouter les nouveaux fichiers, commandes, contraintes ou exceptions utiles à une
   future intervention.
4. Retirer les règles devenues fausses ou obsolètes.
5. Vérifier que le tutoriel et la documentation utilisateur ne contredisent pas la
   nouvelle règle.
6. Mentionner dans le compte rendu du changement que le skill a été vérifié, mis à jour
   ou laissé inchangé avec justification.

Le skill ne doit donc pas devenir un document historique : il doit toujours décrire la
version réellement validée et poussée du site.
