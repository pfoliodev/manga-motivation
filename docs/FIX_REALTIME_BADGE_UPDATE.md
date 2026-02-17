# 🔄 Fix: Mise à Jour en Temps Réel du Badge de Rang

## Problème Identifié

Le badge de rang ne se mettait pas à jour automatiquement lors du changement de niveau via les boutons de debug. L'utilisateur restait bloqué sur "FER LVL 7" même après avoir cliqué sur RESET.

## Solution Implémentée

### 1. **Supabase Realtime** ⚡

Ajout d'un système de souscription en temps réel qui écoute les changements dans la table `profiles`.

#### Fichier: `hooks/usePowerLevel.ts`

```typescript
useEffect(() => {
    loadProfile();

    // Subscribe to profile changes in realtime
    let subscription: any = null;

    const setupSubscription = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            subscription = supabase
                .channel('profile-changes')
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'profiles',
                        filter: `id=eq.${user.id}`
                    },
                    (payload) => {
                        console.log('📡 Profile updated in realtime:', payload.new);
                        setProfile(payload.new as UserProfile);
                    }
                )
                .subscribe();
        }
    };

    setupSubscription();

    return () => {
        if (subscription) {
            subscription.unsubscribe();
        }
    };
}, [loadProfile]);
```

### 2. **Migration Supabase** 📊

Activation de Realtime sur la table `profiles`.

#### Fichier: `supabase/migrations/20260217_enable_realtime_profiles.sql`

```sql
-- Enable realtime on the profiles table
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
```

### 3. **Fonction Refresh** 🔄

Ajout d'une fonction `refresh()` pour forcer le rechargement manuel si nécessaire.

```typescript
interface UsePowerLevelReturn {
    // ... autres propriétés
    refresh: () => Promise<void>;
}

return {
    // ... autres valeurs
    refresh: loadProfile,
};
```

## Application de la Migration

### Option 1: Via Supabase Dashboard (Recommandé)

1. **Ouvrir le Dashboard Supabase**
   - Aller sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Sélectionner ton projet

2. **SQL Editor**
   - Cliquer sur "SQL Editor" dans le menu latéral
   - Cliquer sur "New Query"

3. **Exécuter la Migration**
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
   ```
   - Cliquer sur "Run" (ou Ctrl/Cmd + Enter)

4. **Vérifier**
   - Aller dans "Database" → "Replication"
   - Vérifier que `profiles` est dans la liste des tables avec Realtime activé

### Option 2: Via Supabase CLI

```bash
# Si tu as Supabase CLI installé
supabase db push

# Ou appliquer manuellement
supabase db execute -f supabase/migrations/20260217_enable_realtime_profiles.sql
```

## Test du Système

### Workflow de Test

1. **Recharger l'app**
   ```bash
   # Dans le terminal Expo, taper 'r'
   r
   ```

2. **Se connecter** (si pas déjà fait)

3. **Aller dans Settings**

4. **Tester un changement de rang**
   - Clic sur "🥇 OR" (niveau 35)
   - Observer la console : `📡 Profile updated in realtime: {...}`

5. **Naviguer vers Home**
   - Le badge devrait afficher immédiatement "LVL 35" avec la couronne dorée

6. **Scroller les quotes**
   - Vérifier que le badge s'anime correctement

7. **Tester RESET**
   - Retour dans Settings
   - Clic sur "🔄 RESET"
   - Retour sur Home
   - Le badge devrait afficher "LVL 1" avec l'arbre

### Vérification Console

Tu devrais voir dans les logs :

```
📡 Profile updated in realtime: {
  id: "...",
  level: 35,
  xp: 63000,
  ...
}
⚡ Gained 62850 XP!
```

## Comportement Attendu

### Avant le Fix ❌
- Clic sur bouton de rang → Pas de changement visible
- Nécessite rechargement complet de l'app
- Badge reste bloqué sur l'ancien niveau

### Après le Fix ✅
- Clic sur bouton de rang → Mise à jour instantanée
- Badge se met à jour en temps réel
- Changement visible immédiatement sur tous les écrans

## Fallback: Si Realtime ne Fonctionne Pas

Si Realtime n'est pas disponible ou ne fonctionne pas :

### Solution Alternative: Refresh Manuel

```typescript
// Dans QuoteCard.tsx ou index.tsx
const { profile, refresh } = usePowerLevel();

// Appeler refresh() après un changement
useEffect(() => {
    // Refresh toutes les 2 secondes en mode debug
    if (__DEV__) {
        const interval = setInterval(refresh, 2000);
        return () => clearInterval(interval);
    }
}, [refresh]);
```

## Troubleshooting

### Le badge ne se met toujours pas à jour

1. **Vérifier que Realtime est activé**
   ```sql
   -- Dans Supabase SQL Editor
   SELECT * FROM pg_publication_tables 
   WHERE pubname = 'supabase_realtime';
   ```
   → `profiles` doit apparaître dans les résultats

2. **Vérifier les logs de la console**
   - Chercher `📡 Profile updated in realtime`
   - Si absent → Realtime n'est pas configuré

3. **Vérifier la connexion Supabase**
   - Tester avec une requête simple
   - Vérifier les credentials dans `.env`

4. **Forcer un refresh**
   ```typescript
   // Temporairement dans QuoteCard
   const { refresh } = usePowerLevel();
   useEffect(() => {
       refresh();
   }, []); // Refresh au mount
   ```

### Erreur "permission denied for publication"

Si tu vois cette erreur lors de la migration :

```sql
-- Vérifier les permissions
SELECT * FROM pg_roles WHERE rolname = current_user;

-- Si nécessaire, utiliser le rôle postgres
SET ROLE postgres;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
RESET ROLE;
```

## Performance

### Impact sur les Performances

- **Minimal** : Realtime utilise WebSockets, très léger
- **Batterie** : Impact négligeable
- **Données** : ~1-2 KB par mise à jour

### Optimisation

Le système se désinscrit automatiquement quand le composant est démonté :

```typescript
return () => {
    if (subscription) {
        subscription.unsubscribe();
    }
};
```

---

**"Un système réactif est comme un ninja : il frappe avant que tu ne le voies venir."** — Philosophie AURA ⚡
