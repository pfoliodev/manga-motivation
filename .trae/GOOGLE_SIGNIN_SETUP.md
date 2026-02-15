# Configuration Google Sign-In - Guide Complet

## ✅ État actuel de la configuration

### 1. IDs Clients configurés dans `.env`
- ✅ **Web Client ID** : `821332954022-ka3079qo9hi1sm8p34aggk3mkq19jndi.apps.googleusercontent.com`
- ✅ **iOS Client ID** : `821332954022-ei38j1urmg988h07no2ai6djqjskrkjl.apps.googleusercontent.com`
- ⏳ **Android Client ID** : À configurer (optionnel pour l'instant)

### 2. Bundle Identifier iOS
- ✅ Configuré dans `app.json` : `com.pfoliodev.aura-app`

## 📋 Prochaines étapes

### Étape 1 : Configuration Supabase (IMPORTANT !)

Dans votre console Supabase, vous devez configurer le provider Google :

1. Allez dans **Authentication > Providers > Google** (vous y êtes déjà !)
2. Cliquez sur **Google** pour ouvrir la configuration
3. Vous devez renseigner :
   - **Client ID (for OAuth)** : `821332954022-ka3079qo9hi1sm8p34aggk3mkq19jndi.apps.googleusercontent.com`
   - **Client Secret (for OAuth)** : Vous devez le récupérer depuis Google Cloud Console

#### Comment obtenir le Client Secret :
1. Allez dans [Google Cloud Console](https://console.cloud.google.com)
2. Sélectionnez votre projet
3. Allez dans **APIs & Services > Credentials**
4. Cliquez sur votre **Web Client ID** (celui qui se termine par `-ka3079qo9hi1sm8p34aggk3mkq19jndi`)
5. Copiez le **Client Secret**
6. Collez-le dans Supabase

### Étape 2 : Vérification Google Cloud Console

Assurez-vous que dans Google Cloud Console, pour chaque Client ID :

#### Web Client ID
- **Authorized JavaScript origins** : 
  - `https://efexfjiwwryhpvrbbyov.supabase.co`
  
- **Authorized redirect URIs** :
  - `https://efexfjiwwryhpvrbbyov.supabase.co/auth/v1/callback`

#### iOS Client ID
- **Bundle ID** : `com.pfoliodev.aura-app` (doit correspondre à celui dans `app.json`)

#### Android Client ID (si vous en créez un)
- **Package name** : À définir (ex: `com.pfoliodev.aura`)
- **SHA-1 certificate fingerprint** : Nécessaire pour Android

### Étape 3 : Tester l'authentification

⚠️ **IMPORTANT** : Google Sign-In ne fonctionne PAS dans Expo Go !

Vous devez créer un **Development Build** :

```bash
# Pour iOS
npx expo run:ios

# Pour Android
npx expo run:android
```

Ou utiliser EAS Build :

```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter
eas login

# Créer un build de développement
eas build --profile development --platform ios
# ou
eas build --profile development --platform android
```

### Étape 4 : Configuration Android (optionnel pour plus tard)

Si vous voulez supporter Android :

1. Créez un **Android Client ID** dans Google Cloud Console
2. Ajoutez le package name (ex: `com.pfoliodev.aura`)
3. Générez et ajoutez votre SHA-1 fingerprint :
   ```bash
   # Pour debug
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
4. Ajoutez l'ID dans `.env` : `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`
5. Ajoutez le package name dans `app.json` :
   ```json
   "android": {
     "package": "com.pfoliodev.aura"
   }
   ```

## 🔍 Vérification de la configuration

### Checklist Supabase
- [ ] Provider Google activé (Enabled)
- [ ] Client ID configuré
- [ ] Client Secret configuré
- [ ] Redirect URL correcte

### Checklist Google Cloud Console
- [ ] Web Client ID créé
- [ ] iOS Client ID créé avec le bon Bundle ID
- [ ] Authorized redirect URIs configurées
- [ ] APIs activées (Google+ API, Google Sign-In API)

### Checklist Application
- [x] `.env` configuré avec les IDs
- [x] `app.json` configuré avec le Bundle Identifier iOS
- [x] `authService.ts` configure GoogleSignin
- [x] Plugin `@react-native-google-signin/google-signin` installé

## 🚨 Points d'attention

1. **Expo Go ne supporte PAS Google Sign-In** → Utilisez un Development Build
2. Le **Web Client ID** est obligatoire pour Supabase
3. Le **Client Secret** doit être configuré dans Supabase
4. Les **Redirect URIs** doivent correspondre exactement
5. Pour iOS, le **Bundle ID** doit correspondre partout

## 📱 Test rapide

Une fois tout configuré :

1. Lancez un Development Build (pas Expo Go !)
2. Ouvrez l'app
3. Cliquez sur "Sign in with Google"
4. Vérifiez les logs dans la console
5. Si erreur, vérifiez :
   - Les IDs dans `.env`
   - La config Supabase
   - Les Redirect URIs dans Google Cloud

## 🆘 Dépannage

### Erreur "TurboModuleRegistry"
→ Vous êtes dans Expo Go. Utilisez un Development Build.

### Erreur "Invalid client"
→ Vérifiez que le Client ID dans Supabase correspond au Web Client ID.

### Erreur "Redirect URI mismatch"
→ Ajoutez `https://efexfjiwwryhpvrbbyov.supabase.co/auth/v1/callback` dans Google Cloud Console.

### L'authentification ne fait rien
→ Vérifiez les logs de la console et assurez-vous que le Client Secret est configuré dans Supabase.
