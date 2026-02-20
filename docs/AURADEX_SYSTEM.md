# AuraDex - Système de Collection & Filtrage

L'AuraDex est le cœur de la progression de l'utilisateur dans AURA. Il permet de visualiser l'ensemble des citations disponibles, de suivre sa progression et de filtrer les découvertes.

## 🎴 Les Cartes de Collection

Chaque citation est représentée par une carte dynamique :

- **État Verrouillé (Mystère)** : La carte est sombre, affiche une icône de cadenas et ne révèle ni le texte ni l'auteur complet.
- **État Débloqué** : La carte s'illumine avec son décor immersif dédié, le texte de la citation, l'auteur et sa source. Un badge "NEW" apparaît pour les découvertes récentes.
- **Optimisation** : Les cartes utilisent `React.memo` et un rendu optimisé pour garantir un scroll fluide même avec des centaines d'éléments.

## 🔍 Système de Filtrage & Recherche

L'utilisateur peut explorer sa collection via trois axes :

1.  **Par Catégories** : Un ScrollView horizontal permet de filtrer par thème (Discipline, Ambition, Mental, etc.).
2.  **Par Sources** : Un second ScrollView horizontal permet de filtrer par œuvre (Naruto, One Piece, Path of Exile, etc.).
3.  **Filtrage Combiné** : Il est possible de combiner un filtre de catégorie et un filtre de source.
4.  **Recherche Textuelle** : Une barre de recherche fouille en temps réel dans le texte, l'auteur et la source.

## 📈 Progression & Statistiques

L'AuraDex affiche des statistiques détaillées :

- **Progression globale** : Un pourcentage total de complétion du Dex.
- **Maîtrise par Catégorie/Source** : Chaque badge de filtre affiche son propre pourcentage de complétion et le nombre de citations débloquées (ex: 18/66).
- **Tri Intelligent** : Les citations débloquées remontent automatiquement en haut de la liste pour une consultation plus facile.

## 🛠 Détails Techniques

- **Composant** : `AuraDexScreen` dans `app/(tabs)/auradex.tsx`.
- **Performance** : Utilisation de `getItemLayout` pour un calcul de scroll instantané.
- **Navigation** : Un bouton "Scroll to Top" (Rouge) apparaît dynamiquement pour faciliter la navigation rapide.
- **Réinitialisation** : Un bouton "Réinitialiser" permet de nettoyer tous les filtres actifs en un seul clic.

---

*"Le savoir est la seule arme qui s'accroît quand on la partage."* — **Sagesse Ninja**
