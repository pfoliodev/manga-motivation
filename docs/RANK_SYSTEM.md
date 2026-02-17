# 🏆 Système de Rangs AURA

## Vue d'ensemble

Le système de rangs d'AURA est inspiré des progressions RPG et des mangas Shōnen. Chaque utilisateur progresse à travers 7 rangs distincts, chacun avec sa propre couleur d'aura et son prestige.

## Rangs Disponibles

| Rang | Icône | Niveau Min | Couleur | Glow | Description |
|------|-------|-----------|---------|------|-------------|
| 🪵 **BOIS** | TreePine | 1 | `#8B4513` (Marron) | Marron | Rang de départ - Les fondations |
| ⚙️ **FER** | Hammer | 5 | `#708090` (Gris ardoise) | Gris | Première évolution - La forge |
| 🥉 **BRONZE** | Award | 10 | `#CD7F32` (Bronze) | Bronze | Rang intermédiaire - La détermination |
| 🥈 **ARGENT** | Medal | 20 | `#C0C0C0` (Argent) | Argent | Rang avancé - L'excellence |
| 🥇 **OR** | Crown | 35 | `#FFD700` (Or) | Or | Rang d'élite - La maîtrise |
| 💎 **PLATINE** | Gem | 50 | `#E5E4E2` (Platine) | `#00CED1` (Cyan) | Rang légendaire - L'aura divine |
| 💠 **DIAMANT** | Sparkles | 75 | `#B9F2FF` (Bleu clair) | `#00BFFF` (Bleu profond) | Rang ultime - La transcendance |

## Progression XP

- **Formule de niveau** : `niveau = floor(sqrt(xp / 10))`
- **Sources d'XP** :
  - **Connexion quotidienne** : +10 XP
  - **Découverte de citation** : +5 XP (par citation jamais vue)
  - **Partage Social** : +5 XP (recommandé)
  - **Ajout Favoris** : +3 XP (recommandé)

## Affichage Visuel

Le badge de rang s'affiche en **haut à gauche** de chaque citation avec :
- **Icône** : Icône Lucide correspondant au rang (taille 20, strokeWidth 2.5)
- **Bordure** : Couleur du rang
- **Glow/Shadow** : Effet lumineux de la couleur du rang
- **Texte** :
  - Ligne 1 : `LVL {niveau}` (taille 16, bold)
  - Ligne 2 : `{NOM_RANG}` (taille 9, lettres espacées)

### Animation
- **Scroll-driven** : Le badge apparaît du haut (`translateY: -50 → 0`) en synchronisation avec le scroll
- **Opacity** : Fade in/out selon la position de la carte

## Implémentation Technique

### Fichier : `components/QuoteCard.tsx`

```typescript
// Imports des icônes
import { Award, Crown, Gem, Hammer, Medal, Sparkles, TreePine } from 'lucide-react-native';

// Définition des rangs
interface RankTier {
  name: string;
  color: string;
  glowColor: string;
  minLevel: number;
  icon: React.ComponentType<any>;
}

const RANK_TIERS: RankTier[] = [
  { name: 'BOIS', color: '#8B4513', glowColor: '#8B4513', minLevel: 1, icon: TreePine },
  { name: 'FER', color: '#708090', glowColor: '#708090', minLevel: 5, icon: Hammer },
  { name: 'BRONZE', color: '#CD7F32', glowColor: '#CD7F32', minLevel: 10, icon: Award },
  { name: 'ARGENT', color: '#C0C0C0', glowColor: '#C0C0C0', minLevel: 20, icon: Medal },
  { name: 'OR', color: '#FFD700', glowColor: '#FFD700', minLevel: 35, icon: Crown },
  { name: 'PLATINE', color: '#E5E4E2', glowColor: '#00CED1', minLevel: 50, icon: Gem },
  { name: 'DIAMANT', color: '#B9F2FF', glowColor: '#00BFFF', minLevel: 75, icon: Sparkles },
];

// Calcul du rang actuel
function getRankForLevel(level: number): RankTier {
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (level >= RANK_TIERS[i].minLevel) {
      return RANK_TIERS[i];
    }
  }
  return RANK_TIERS[0];
}

// Affichage de l'icône dans le badge
{React.createElement(currentRank.icon, {
  size: 20,
  color: currentRank.color,
  strokeWidth: 2.5,
})}
```

## Évolutions Futures

### Idées d'amélioration
- [ ] Animation de level-up avec particules
- [ ] Notification push lors du changement de rang
- [ ] Écran dédié "Profil" avec historique de progression
- [ ] Badges spéciaux pour rangs PLATINE et DIAMANT
- [ ] Effets visuels supplémentaires (particules, aura animée)
- [ ] Classement global des utilisateurs par rang

### Rangs Secrets (Potentiels)
- **MYTHIQUE** (Niveau 100) : Couleur arc-en-ciel
- **LÉGENDAIRE** (Niveau 150) : Aura dorée animée
- **DIVIN** (Niveau 200) : Effet galaxie

---

**"Le rang n'est qu'un reflet de ton voyage. C'est la volonté qui forge les légendes."** — AURA Philosophy
