# Aura - Configuration Supabase

## 🚀 Guide de démarrage rapide

### 1. Créer un projet Supabase

1. Allez sur [https://app.supabase.com](https://app.supabase.com)
2. Cliquez sur "New Project"
3. Remplissez les informations :
   - **Name** : aura-app (ou votre choix)
   - **Database Password** : Choisissez un mot de passe fort
   - **Region** : Choisissez la région la plus proche
4. Attendez que le projet soit créé (~2 minutes)

### 2. Récupérer les clés API

1. Dans votre projet, allez dans **Settings** → **API**
2. Copiez :
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (la clé publique)

### 3. Configurer l'application

Éditez le fichier `.env` à la racine du projet :

```env
EXPO_PUBLIC_SUPABASE_URL=https://votre-projet-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anonyme-ici
```

### 4. Exécuter les migrations SQL
Les migrations doivent être exécutées dans l'ordre suivant pour garantir la cohérence de la base de données :

1. **Initial Schema** : `supabase/migrations/001_initial_schema.sql` (Tables de base)
2. **Profiles** : `supabase/migrations/004_create_profiles_with_email.sql` (Gestion utilisateur avancée)
3. **Background Images** : `supabase/migrations/005_add_background_image_to_quotes.sql` (Esthétique des citations)
4. **Power Level System** : `supabase/migrations/20260217_add_power_level_system.sql` (XP, Niveaux, Rangs)
5. **User Tracking** : `supabase/migrations/20260217_create_user_seen_quotes.sql` (Suivi des lectures)
6. **Realtime** : `supabase/migrations/20260217_enable_realtime_profiles.sql` (Mises à jour instantanées)
7. **PoE Content** : `supabase/migrations/20260219_2345_insert_poe_quotes.sql` (Extension Path of Exile)

### 5. Vérifier l'installation

1. Allez dans **Database** → **Tables**
2. Vous devriez voir :
   - `quotes` : Les sagesses des maîtres.
   - `favorites` : Tes trésors personnels.
   - `profiles` : Ton identité de guerrier (XP, Niveau, Streak).
   - `user_seen_quotes` : Tes archives de lecture.

### 6. Activer le Realtime (Optionnel mais recommandé)
Pour une expérience fluide (Aura qui s'actualise en temps réel), assurez-vous que la publication Realtime est activée pour la table `profiles` :
1. Dans Supabase : **Database** → **Replication**
2. Dans la section **Source**, cliquez sur "Tables" pour le slot `supabase_realtime`
3. Activez l'interrupteur pour la table `profiles`.

### 7. Activer l'authentification anonyme

1. Allez dans **Authentication** → **Providers**
2. Activez **Anonymous sign-ins**
3. Sauvegardez

### 7. Lancer l'application

```bash
npm start
```

---

## 🔐 Sécurité

Les Row Level Security (RLS) policies sont automatiquement configurées :

- **quotes** : Lecture publique
- **favorites** : Chaque utilisateur ne peut voir que ses propres favoris

---

## 📊 Vérification dans Supabase

### Voir les utilisateurs

```sql
SELECT * FROM auth.users;
```

### Voir les favoris

```sql
SELECT f.*, q.text, q.author 
FROM favorites f
JOIN quotes q ON f.quote_id = q.id;
```

---

## 🐛 Problèmes courants

### "Failed to fetch quotes"

- Vérifiez que les variables d'environnement sont correctes
- Vérifiez que la table `quotes` existe et contient des données
- Vérifiez que les policies RLS sont actives

### "Authentication error"

- Vérifiez que l'authentification anonyme est activée
- Vérifiez que la clé `anon` est correcte

---

**✅ Configuration terminée !** Votre application est maintenant connectée à Supabase.
