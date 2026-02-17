# 🔍 Diagnostic de l'écran blanc

## Causes possibles

### 1. ⏱️ SplashScreen en cours (5.5 secondes)
L'app affiche un splash screen qui dure **5.5 secondes**. Si tu viens de recharger, attends simplement que ça passe.

### 2. ❌ Migration SQL non exécutée
Le système Power Level nécessite des colonnes dans la base de données qui n'existent peut-être pas encore.

**Solution** :
1. Ouvre ton **Supabase Dashboard**
2. Va dans **SQL Editor**
3. Copie le contenu de `supabase/migrations/20260217_add_power_level_system.sql`
4. Exécute-le

### 3. 🐛 Erreur JavaScript silencieuse

**Pour débugger** :
1. Appuie sur **`j`** dans le terminal Expo
2. Ouvre la **Console** du debugger
3. Regarde les erreurs rouges

## ✅ Corrections déjà appliquées

J'ai corrigé :
- ✅ Import manquant de `usePowerLevel` dans `settings.tsx`
- ✅ Import manquant de `PowerLevelBar` 
- ✅ Import manquant de `ScrollView`
- ✅ Meilleur error handling dans `usePowerLevel` hook
- ✅ Gestion des utilisateurs invités

## 🎯 Prochaine étape

**Recharge l'app** : Appuie sur `r` dans le terminal Expo et attends 6 secondes.

Si l'écran reste blanc :
1. Appuie sur `j` pour ouvrir le debugger
2. Envoie-moi le message d'erreur de la console

---

**"Un ninja ne recule jamais devant un bug !"** 🔥
