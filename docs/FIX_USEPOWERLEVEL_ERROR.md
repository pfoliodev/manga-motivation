# 🔧 Correction de l'erreur "usePowerLevel doesn't exist"

## ✅ Problème résolu

L'erreur `Property 'usePowerLevel' doesn't exist` a été corrigée en :

1. **Nettoyage du cache Metro** : `npx expo start --clear`
2. **Recréation du hook** avec la bonne syntaxe d'export :
   - Avant : `export const usePowerLevel = () => { ... }`
   - Après : `export function usePowerLevel() { ... }`

## 🚀 Actions effectuées

### 1. Redémarrage du serveur Expo
```bash
# Arrêt du serveur précédent
pkill -f "expo start"

# Redémarrage avec cache vidé
npx expo start --clear
```

### 2. Correction du hook usePowerLevel.ts
- ✅ Suppression et recréation du fichier
- ✅ Utilisation de `export function` au lieu de `export const`
- ✅ Ordre des imports corrigé (React hooks en premier)

## 📱 Test de l'application

1. **Recharge l'app** sur ton simulateur/appareil :
   - Appuie sur `r` dans le terminal Expo
   - Ou secoue l'appareil et sélectionne "Reload"

2. **Va dans Paramètres** (bouton compte)

3. **Vérifie que tu vois** :
   - ⚡ Section **Power Level** avec la barre de progression
   - 🔥 Section **Streak** avec les jours consécutifs

## ⚠️ Note importante

**Tu dois exécuter la migration SQL** pour que le système fonctionne complètement :

1. Va sur ton **Supabase Dashboard**
2. Ouvre **SQL Editor**
3. Copie le contenu de `supabase/migrations/20260217_add_power_level_system.sql`
4. Exécute-le

Sans cette migration, tu verras une erreur "Profile not found" car les colonnes `xp`, `level`, `streak_count`, etc. n'existent pas encore dans ta base de données.

## 🎯 Prochaines étapes

Une fois la migration exécutée :
- ✅ Le Power Level s'affichera correctement
- ✅ Le streak se mettra à jour automatiquement au lancement
- ✅ Tu pourras tester en ajoutant du XP manuellement

---

**Le serveur Expo tourne maintenant avec le cache vidé. Recharge ton app pour voir les changements !** ⚡
