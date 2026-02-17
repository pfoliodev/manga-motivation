# AURA : Manga Motivation Daily

AURA est une application mobile élégante et inspirante conçue pour motiver les fans de manga à travers des citations quotidiennes issues de leurs œuvres préférées. Alliant une esthétique manga moderne à une expérience utilisateur fluide, AURA vous aide à rester concentré, motivé et inspiré chaque jour.

## ✨ Fonctionnalités

- **Citations Quotidiennes** : Recevez une dose d'inspiration chaque jour avec des citations de personnages iconiques (Goku, Naruto, Luffy, etc.).
- **Système d'Aura (Gamification)** : Progressez à travers 7 rangs épiques (Bois, Fer, Bronze, Argent, Or, Platine, Diamant) basés sur votre assiduité.
- **Gain d'XP Dynamique** : Gagnez de l'XP en découvrant de nouvelles citations chaque jour.
- **Progression en Temps Réel** : Suivez votre niveau d'Aura et votre barre d'XP qui évoluent instantanément.
- **Suivi des Découvertes** : Identifiez facilement les citations déjà lues grâce à l'indicateur discret "DÉJÀ LU".
- **Catégories Variées** : Parcourez les citations par thèmes (Discipline, Amitié, Force, Sagesse, etc.).
- **Favoris** : Enregistrez vos citations préférées pour les retrouver facilement.
- **Partage Social** : Partagez des citations stylisées directement sur vos réseaux sociaux (Instagram, WhatsApp, etc.).
- **Animations Shōnen** : Une interface immersive avec des animations de gain d'XP et des feedbacks haptiques.
- **Authentification Sécurisée** : Connexion simplifiée via Google, Apple ou Email (via Supabase).

## 🏆 Système de Rangs

Votre dévouement est récompensé par des grades de plus en plus prestigieux :
- 🪵 **BOIS** (Level 1)
- ⚙️ **FER** (Level 5)
- 🥉 **BRONZE** (Level 10)
- 🥈 **ARGENT** (Level 20)
- 🥇 **OR** (Level 35)
- 💎 **PLATINE** (Level 50)
- 💠 **DIAMANT** (Level 75)

## 🛠 Architecture & Stack Technique

L'application est construite avec des technologies modernes pour assurer performance et scalabilité :

- **Framework** : [Expo](https://expo.dev/) (React Native) avec SDK 54.
- **Navigation** : [Expo Router](https://docs.expo.dev/router/introduction/) (Navigation basée sur le système de fichiers).
- **Stylisation** : [NativeWind](https://www.nativewind.dev/) (Tailwind CSS pour React Native).
- **Backend & Auth** : [Supabase](https://supabase.com/) (Base de données PostgreSQL, Authentification, Stockage).
- **Animations** : [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) & [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/).
- **Gestion des données** : Pattern Repository pour une abstraction propre entre la logique métier et les sources de données (Supabase).

### Structure du Projet

```text
├── app/                  # Routes et écrans de l'application (Expo Router)
│   ├── (tabs)/           # Navigation par onglets (Accueil, Catégories, Favoris, Paramètres)
│   ├── category/         # Détails des catégories
│   ├── login.tsx         # Écran de connexion
│   └── paywall.tsx       # Écran d'abonnement / Premium
├── components/           # Composants UI réutilisables
├── repositories/         # Couche d'accès aux données (Supabase)
├── src/                  # Logique métier, Contextes et Services
├── supabase/             # Configurations et migrations Supabase
├── assets/               # Images, polices et icônes
├── constants/            # Thèmes et constantes de l'application
└── utils/                # Fonctions utilitaires
```

## 🚀 Installation & Lancement

### Prérequis

- Node.js (v18+)
- npm ou yarn
- Expo Go sur votre simulateur ou appareil physique

### Étapes

1. **Cloner le projet** :
   ```bash
   git clone <url-du-repo>
   cd manga-motivation
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configuration de l'environnement** :
   Créez un fichier `.env` à la racine en vous basant sur `.env.example` :
   ```env
   EXPO_PUBLIC_SUPABASE_URL=votre_url_supabase
   EXPO_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
   ```

4. **Lancer l'application** :
   ```bash
   npx expo start
   ```

## 🎨 Design

AURA utilise un **Design System** sombre et épuré, mettant en avant les visuels manga.
- **Couleurs** : Noirs profonds, gris anthracite et accents vibrants.
- **Typographie** : Polices modernes et lisibles adaptées au mobile.

---

Développé avec ❤️ par [Votre Nom/Organisation]
