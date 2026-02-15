# Fix de la synchronisation du bouton Like

## Problème identifié

Le bouton "like" n'était pas synchronisé entre l'écran principal (feed) et l'écran des favoris. 

**Cause racine** : Le hook `useFavorites` créait une instance locale de l'état pour chaque écran. Quand on unlikait une citation depuis l'écran favoris, l'écran principal ne recevait pas la mise à jour car il avait sa propre copie de l'état.

## Solution implémentée

### 1. Création d'un FavoritesContext global
**Fichier** : `src/context/FavoritesContext.tsx`

- Créé un contexte React pour partager l'état des favoris globalement
- Implémente le `FavoritesProvider` qui enveloppe toute l'application
- Maintient un état unique partagé entre tous les écrans
- Conserve les mises à jour optimistes pour une UX fluide

### 2. Mise à jour du hook useFavorites
**Fichier** : `hooks/useFavorites.ts`

- Simplifié pour ré-exporter le hook depuis le contexte
- Garantit que tous les composants utilisent le même état partagé

### 3. Intégration dans le layout principal
**Fichier** : `app/_layout.tsx`

- Ajouté le `FavoritesProvider` dans la hiérarchie des providers
- Placé après `AuthProvider` car il dépend de l'authentification
- Enveloppe toute l'application pour un accès global

## Architecture finale

```
<ThemeProvider>
  <AuthProvider>
    <FavoritesProvider>  ← État global des favoris
      <Stack>
        <Screen name="(tabs)" />  ← Feed + Favoris partagent le même état
        <Screen name="paywall" />
      </Stack>
    </FavoritesProvider>
  </AuthProvider>
</ThemeProvider>
```

## Comportement attendu

✅ **Liker depuis le feed** → Le like apparaît immédiatement dans les favoris
✅ **Unliker depuis les favoris** → Le bouton se désactive immédiatement dans le feed
✅ **Mises à jour optimistes** → L'UI se met à jour instantanément
✅ **Rollback en cas d'erreur** → Si Supabase échoue, l'état revient à sa valeur précédente
✅ **Synchronisation temps réel** → Tous les écrans voient les mêmes données

## Fichiers modifiés

1. ✨ **Nouveau** : `src/context/FavoritesContext.tsx`
2. 🔧 **Modifié** : `hooks/useFavorites.ts`
3. 🔧 **Modifié** : `app/_layout.tsx`

## Test recommandé

1. Ouvrir l'app et liker une citation depuis le feed
2. Naviguer vers l'écran Favoris
3. Vérifier que la citation apparaît
4. Cliquer sur le X pour unliker
5. Retourner au feed
6. ✅ Le bouton cœur devrait être désactivé (non rempli)
