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

#### 4.1 Créer les tables

1. Dans Supabase, allez dans **SQL Editor**
2. Cliquez sur **New Query**
3. Copiez-collez le contenu de `supabase/migrations/001_initial_schema.sql`
4. Cliquez sur **Run**

#### 4.2 Peupler les données

1. Créez une nouvelle query
2. Copiez-collez le contenu de `supabase/seed.sql`
3. Cliquez sur **Run**

### 5. Vérifier l'installation

1. Allez dans **Database** → **Tables**
2. Vous devriez voir :
   - `quotes` (30 lignes)
   - `favorites` (0 lignes)

### 6. Activer l'authentification anonyme

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
