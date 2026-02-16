import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import { Heart, Share2 } from 'lucide-react-native';
import React, { useRef } from 'react';
import { Dimensions, ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';
import { captureRef } from 'react-native-view-shot';
import { useRequireAuth } from '../src/hooks/useRequireAuth';

interface Quote {
  id: string;
  text: string;
  author: string;
  source: string;
  category: string;
  background_image?: string | null;
}

// Static mapping of background images
const BACKGROUND_IMAGES: Record<string, any> = {
  'alley.png': require('../assets/images/background-quotes/alley.png'),
  'arbre-monde.png': require('../assets/images/background-quotes/arbre-monde.png'),
  'bambou-forest.png': require('../assets/images/background-quotes/bambou-forest.png'),
  'bibliotheque-nuage.png': require('../assets/images/background-quotes/bibliotheque-nuage.png'),
  'cascade-cachee.png': require('../assets/images/background-quotes/cascade-cachee.png'),
  'caverne-dragon.png': require('../assets/images/background-quotes/caverne-dragon.png'),
  'champ-lavande.png': require('../assets/images/background-quotes/champ-lavande.png'),
  'champs-cristaux.png': require('../assets/images/background-quotes/champs-cristaux.png'),
  'city-night-moon.png': require('../assets/images/background-quotes/city-night-moon.png'),
  'cuisine-lemon.png': require('../assets/images/background-quotes/cuisine-lemon.png'),
  'desert-diamants.png': require('../assets/images/background-quotes/desert-diamants.png'),
  'house-view.png': require('../assets/images/background-quotes/house-view.png'),
  'ile-flottante-magic.png': require('../assets/images/background-quotes/ile-flottante-magic.png'),
  'ile-flottante.png': require('../assets/images/background-quotes/ile-flottante.png'),
  'laverie.png': require('../assets/images/background-quotes/laverie.png'),
  'lighthouse-cat.png': require('../assets/images/background-quotes/lighthouse-cat.png'),
  'morning-sun.png': require('../assets/images/background-quotes/morning-sun.png'),
  'mountain-sunset.png': require('../assets/images/background-quotes/mountain-sunset.png'),
  'nightbiblio.png': require('../assets/images/background-quotes/nightbiblio.png'),
  'parc-night.png': require('../assets/images/background-quotes/parc-night.png'),
  'plage-soleil.png': require('../assets/images/background-quotes/plage-soleil.png'),
  'portail.png': require('../assets/images/background-quotes/portail.png'),
  'rue-restaurant.png': require('../assets/images/background-quotes/rue-restaurant.png'),
  'sommet-colline.png': require('../assets/images/background-quotes/sommet-colline.png'),
  'toit-upside.png': require('../assets/images/background-quotes/toit-upside.png'),
  'train-galaxy.png': require('../assets/images/background-quotes/train-galaxy.png'),
  'train-night.png': require('../assets/images/background-quotes/train-night.png'),
  'under-water.png': require('../assets/images/background-quotes/under-water.png'),
  'ville-enneige.png': require('../assets/images/background-quotes/ville-enneige.png'),
  'Gemini_Generated_Image_8zdx9q8zdx9q8zdx.png': require('../assets/images/background-quotes/Gemini_Generated_Image_8zdx9q8zdx9q8zdx.png'),
};

interface QuoteCardProps {
  quote: Quote;
  isLiked?: boolean;
  onLike?: () => void;
  onShare?: () => void;
  height: number;
  scrollY?: SharedValue<number>;
  index?: number;
  itemSize?: number; // Taille totale de la cellule pour l'interpolation (hauteur + marge)
}

const { width: WINDOW_WIDTH } = Dimensions.get('window');

export default function QuoteCard({ quote, isLiked, onLike, onShare, height, scrollY, index, itemSize }: QuoteCardProps) {
  const { width } = Dimensions.get('window');
  const scale = useSharedValue(1);
  const viewRef = useRef<View>(null);

  // Taille utilisée pour le calcul de l'interpolation
  // Si itemSize est fourni (cas de la liste avec header/margins), on l'utilise.
  // Sinon on utilise height (cas du plein écran pagingEnabled)
  const sizeForInterpolation = itemSize || height;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Animations drivées par le scroll : GAUCHE / DROITE
  const textAnimatedStyle = useAnimatedStyle(() => {
    if (!scrollY || index === undefined) return { opacity: 1 };

    const inputRange = [
      (index - 1) * sizeForInterpolation,
      index * sizeForInterpolation,
      (index + 1) * sizeForInterpolation
    ];

    // LA CITATION : Arrive de la GAUCHE (-120) -> Centre (0) -> Part à DROITE (+120)
    // Mouvement beaucoup plus doux (amplitude réduite)
    const translateX = interpolate(
      scrollY.value,
      inputRange,
      [120, 0, -120],
      Extrapolation.CLAMP
    );

    return {
      opacity: interpolate(scrollY.value, inputRange, [0, 1, 0]),
      transform: [{ translateX }]
    };
  });

  const authorAnimatedStyle = useAnimatedStyle(() => {
    if (!scrollY || index === undefined) return { opacity: 1 };

    const inputRange = [
      (index - 1) * sizeForInterpolation,
      index * sizeForInterpolation,
      (index + 1) * sizeForInterpolation
    ];

    // L'AUTEUR : Arrive de la DROITE (+120) -> Centre (0) -> Part à GAUCHE (-120)
    const translateX = interpolate(
      scrollY.value,
      inputRange,
      [-120, 0, 120],
      Extrapolation.CLAMP
    );

    return {
      opacity: interpolate(scrollY.value, inputRange, [0, 1, 0]),
      transform: [{ translateX }]
    };
  });

  const requireAuth = useRequireAuth();

  // Handlers (like, share)
  const handleLike = () => {
    console.log('❤️ Like pressed for quote:', quote.id);
    requireAuth(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      scale.value = withSequence(
        withSpring(1.2, { damping: 10, stiffness: 200 }),
        withSpring(1, { damping: 10, stiffness: 200 })
      );
      onLike?.();
    });
  };

  const handleShare = async () => {
    console.log('📤 Share pressed for quote:', quote.id);
    requireAuth(async () => {
      try {
        if (viewRef.current) {
          const uri = await captureRef(viewRef, {
            format: 'png',
            quality: 0.9,
          });
          await Sharing.shareAsync(uri);
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } catch (error) {
        console.error('Error sharing quote:', error);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      onShare?.();
    });
  };

  return (
    <View style={{ width, height }} className="bg-[#0F0F0F] relative" pointerEvents="box-none">
      <View
        ref={viewRef}
        style={{ width, height }}
        className="justify-center items-center"
        pointerEvents="box-none"
      >
        {/* Background Image */}
        {quote.background_image && BACKGROUND_IMAGES[quote.background_image] && (
          <ImageBackground
            source={BACKGROUND_IMAGES[quote.background_image]}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          >
            {/* Dark overlay for better text readability */}
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />
          </ImageBackground>
        )}

        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.05)', 'transparent']}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />

        <View className="px-8 items-center w-full z-10" pointerEvents="none">
          <Animated.Text
            style={textAnimatedStyle}
            className="text-white text-3xl font-serif text-center leading-10 mb-8 tracking-wide italic opacity-90"
          >
            "{quote.text}"
          </Animated.Text>

          <Animated.Text
            style={authorAnimatedStyle}
            className="text-white text-lg font-sans uppercase tracking-widest mb-2 font-bold shadow-black"
          >
            {quote.author}
          </Animated.Text>

          <Animated.Text
            style={authorAnimatedStyle}
            className="text-gray-200 text-xs font-sans uppercase tracking-widest font-medium opacity-90"
          >
            {quote.source}
          </Animated.Text>
        </View>

        <Animated.Text
          style={authorAnimatedStyle}
          className="absolute bottom-8 text-white/50 text-[10px] font-sans uppercase tracking-widest"
          pointerEvents="none"
        >
          AURA : Manga & Motivation
        </Animated.Text>
      </View>

      <View
        className="absolute right-6 bottom-32 gap-6 items-center"
        style={{ zIndex: 9999 }}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          onPress={() => {
            console.log('❤️ HEART CLICKED');
            handleLike();
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          style={{ backgroundColor: '#1A1A1A', padding: 12, borderRadius: 30 }}
        >
          <Animated.View style={animatedStyle} pointerEvents="none">
            <Heart
              size={28}
              color={isLiked ? "#EF4444" : "#FFF"}
              fill={isLiked ? "#EF4444" : "transparent"}
            />
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            console.log('📤 SHARE CLICKED');
            handleShare();
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          style={{ backgroundColor: '#1A1A1A', padding: 12, borderRadius: 30 }}
        >
          <View pointerEvents="none">
            <Share2 size={28} color="#FFF" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
