# 🧪 Guide de Debug - Système de Rangs

## Vue d'ensemble

Un panneau de debug a été ajouté dans l'écran **Paramètres** pour tester facilement tous les rangs sans avoir à accumuler de l'XP manuellement.

## Accès au Panneau Debug

### Conditions d'affichage
- ✅ Mode développement (`__DEV__ === true`)
- ✅ Utilisateur connecté (pas en mode invité)
- ✅ Profil chargé

### Localisation
**Écran** : `app/(tabs)/settings.tsx`  
**Position** : Entre la section "Power Level" et la section "Streak"

## Utilisation

### Boutons Disponibles

| Bouton | Action | Niveau Cible | XP Calculé | Formule |
|--------|--------|--------------|------------|---------|
| 🪵 **BOIS** | Retour au rang de départ | 1 | 10 XP | 1² × 10 |
| ⚙️ **FER** | Passe au rang Fer | 5 | 250 XP | 5² × 10 |
| 🥉 **BRONZE** | Passe au rang Bronze | 10 | 1,000 XP | 10² × 10 |
| 🥈 **ARGENT** | Passe au rang Argent | 20 | 4,000 XP | 20² × 10 |
| 🥇 **OR** | Passe au rang Or | 35 | 12,250 XP | 35² × 10 |
| 💎 **PLATINE** | Passe au rang Platine | 50 | 25,000 XP | 50² × 10 |
| 💠 **DIAMANT** | Passe au rang Diamant | 75 | 56,250 XP | 75² × 10 |
| 🔄 **RESET** | Réinitialise au niveau 1 | 1 | 10 XP | 1² × 10 |

### Workflow de Test

1. **Ouvrir l'app en mode développement**
   ```bash
   npx expo start
   ```

2. **Se connecter** (si pas déjà fait)

3. **Aller dans Paramètres** (onglet Settings)

4. **Scroller jusqu'au panneau Debug** (fond rouge foncé avec bordure rouge)

5. **Cliquer sur un bouton de rang** pour tester
   - Le niveau change instantanément
   - Le badge sur les quotes se met à jour
   - La Power Level Bar se met à jour

6. **Naviguer vers l'écran Home** pour voir le badge en action

7. **Scroller les quotes** pour voir l'animation du badge

### Exemple de Session de Test

```
1. Clic sur "🥉 BRONZE" → Niveau 10
   → Vérifie que le badge affiche l'icône Award (🏆) en bronze

2. Clic sur "🥇 OR" → Niveau 35
   → Vérifie que le badge affiche la couronne (👑) en or

3. Clic sur "💠 DIAMANT" → Niveau 75
   → Vérifie que le badge affiche les sparkles (✨) en bleu cristal

4. Clic sur "🔄 RESET" → Retour niveau 1
   → Vérifie que tout revient à la normale
```

## Calcul de l'XP

Le système utilise la formule inverse de `level = floor(sqrt(xp / 10))` :

```typescript
XP_necessaire = niveau² * 10
```

### Exemples
- **Niveau 1** : 1² * 10 = 10 XP
- **Niveau 5** : 5² * 10 = 250 XP
- **Niveau 10** : 10² * 10 = 1,000 XP
- **Niveau 75** : 75² * 10 = 56,250 XP

## Fonctionnement Technique

### Méthode `addXP(amount)`

```typescript
// Exemple: Passer au niveau 35 (OR)
// XP cible = 35 * 35 * 10 = 12,250
addXP(-profile.xp + (35 * 35 * 10));
```

**Explication** :
1. Calcule l'XP exact nécessaire pour le niveau cible
2. Soustrait l'XP actuel (`-profile.xp`)
3. Ajoute l'XP cible (`+ targetXP`)
4. Le hook `usePowerLevel` (via Context) met à jour le niveau automatiquement

### Persistance

⚠️ **Important** : Les changements sont **persistés dans Supabase**.

- Les modifications sont enregistrées dans la table `profiles`
- Le niveau reste même après rechargement de l'app
- Utilise le bouton **RESET** pour revenir à la normale

## Désactivation en Production

Le panneau est automatiquement masqué en production grâce à :

```typescript
{__DEV__ && !isGuest && user && profile && (
  // Panneau debug
)}
```

- `__DEV__` est `false` en build de production
- Le code n'est même pas exécuté en production

## Vérification Visuelle

### Checklist de Test

Pour chaque rang, vérifier :

- [ ] **Couleur de bordure** correspond au rang
- [ ] **Icône** est la bonne (TreePine, Hammer, Award, etc.)
- [ ] **Couleur de l'icône** correspond au rang
- [ ] **Effet glow** est visible et de la bonne couleur
- [ ] **Nom du rang** s'affiche correctement
- [ ] **Animation scroll** fonctionne (badge apparaît du haut)
- [ ] **Power Level Bar** se met à jour dans Settings

## Troubleshooting

### Le panneau n'apparaît pas
- ✅ Vérifier que tu es en mode développement
- ✅ Vérifier que tu es connecté (pas en mode invité)
- ✅ Recharger l'app (`r` dans le terminal Expo)

### Le niveau ne change pas
- ✅ Vérifier la connexion Supabase
- ✅ Vérifier les logs dans la console
- ✅ Vérifier que la migration `20260217_add_power_level_system.sql` a été appliquée

### Le badge ne se met pas à jour
- ✅ Naviguer vers un autre écran puis revenir
- ✅ Scroller les quotes pour forcer le re-render
- ✅ Recharger l'app

---

**"Le debug est l'art de transformer les bugs en features."** — Philosophie Dev AURA 🧪
