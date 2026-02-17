# 🔧 Debug: Test sans Power Level

Si l'écran reste blanc, essaie cette version simplifiée pour isoler le problème.

## Option 1: Commenter temporairement le Power Level

Dans `app/(tabs)/settings.tsx`, commente ces lignes (lignes 24-40 environ) :

```tsx
// TEMPORAIRE - Pour tester
// const { profile, updateDailyStreak, addXP, loading, error } = usePowerLevel();
// const streakUpdatedRef = useRef(false);

// useEffect(() => {
//   loadSettings();
// }, []);

// useEffect(() => {
//   if (!isGuest && user && profile && !loading && !error && !streakUpdatedRef.current) {
//     streakUpdatedRef.current = true;
//     updateDailyStreak();
//   }
// }, [user, profile, loading, error, isGuest]);
```

Et remplace par :

```tsx
useEffect(() => {
  loadSettings();
}, []);
```

Puis commente aussi les sections Power Level et Streak dans le JSX (lignes 234-280 environ).

## Option 2: Ouvre le debugger

**Appuie sur `j`** dans le terminal Expo et regarde la console JavaScript pour voir l'erreur exacte.

## Option 3: Vérifie les logs React Native

Si tu es sur iOS Simulator :
```bash
xcrun simctl spawn booted log stream --predicate 'processImagePath endswith "Expo Go"' --level=debug
```

Si tu es sur Android :
```bash
adb logcat *:S ReactNative:V ReactNativeJS:V
```

---

**Dis-moi ce que tu vois dans le debugger !** 🔍
