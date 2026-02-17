# AURA : Manga Motivation Daily

AURA est une application mobile élégante et inspirante conçue pour motiver les fans de manga à travers des citations quotidiennes issues de leurs œuvres préférées. Alliant une esthétique manga moderne à une expérience utilisateur fluide, AURA vous aide à rester concentré, motivé et inspiré chaque jour.

## ✨ Fonctionnalités

- **Citations Quotidiennes** : Recevez une dose d'inspiration chaque jour avec des citations de personnages iconiques (Goku, Naruto, Luffy, etc.).
- **Catégories Variées** : Parcourez les citations par thèmes (Discipline, Amitié, Force, Sagesse, etc.).
- **Favoris** : Enregistrez vos citations préférées pour les retrouver facilement.
- **Partage Social** : Partagez des citations stylisées directement sur vos réseaux sociaux (Instagram, WhatsApp, etc.).
- **Animations Manga** : Une interface immersive avec des animations parallaxes et des transitions fluides inspirées de l'univers manga.
- **Écran de démarrage Dynamique** : Un écran "Splash" animé pour une immersion dès l'ouverture de l'application.
- **Authentification Sécurisée** : Connexion simplifiée via Google, Apple ou Email (via Supabase).

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
