import { getRankForLevel, RANK_TIERS } from '@/constants/ranks';
import { usePowerLevel } from '@/hooks/usePowerLevel';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import { Eye, Heart, Share2 } from 'lucide-react-native';
import React, { useRef } from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';
import { captureRef } from 'react-native-view-shot';
import { useRequireAuth } from '../src/hooks/useRequireAuth';
import { RankEvolutionModal } from './RankEvolutionModal';


const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

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
  'poe/poe01.png': require('../assets/images/background-quotes/poe/poe01.png'),
  'poe/poe02.png': require('../assets/images/background-quotes/poe/poe02.png'),
  'poe/poe03.png': require('../assets/images/background-quotes/poe/poe03.png'),
  'poe/poe04.png': require('../assets/images/background-quotes/poe/poe04.png'),
  'poe/poe05.png': require('../assets/images/background-quotes/poe/poe05.png'),
  'poe/poe06.png': require('../assets/images/background-quotes/poe/poe06.png'),
  'poe/poe07.png': require('../assets/images/background-quotes/poe/poe07.png'),
  'poe/poe08.png': require('../assets/images/background-quotes/poe/poe08.png'),
  'poe/poe09.png': require('../assets/images/background-quotes/poe/poe09.png'),
  'poe/poe10.png': require('../assets/images/background-quotes/poe/poe10.png'),
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
  const { profile, isQuoteSeen } = usePowerLevel();
  const alreadySeen = isQuoteSeen(quote.id);
  const [showRankModal, setShowRankModal] = React.useState(false);

  // Get current rank based on level
  const currentRank = profile ? getRankForLevel(profile.level) : RANK_TIERS[0];

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
      [50, 0, -50],
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
      [-50, 0, 50],
      Extrapolation.CLAMP
    );

    return {
      opacity: interpolate(scrollY.value, inputRange, [0, 1, 0]),
      transform: [{ translateX }]
    };
  });

  // Animation pour le badge de niveau (arrive du haut)
  const levelBadgeAnimatedStyle = useAnimatedStyle(() => {
    if (!scrollY || index === undefined) return { opacity: 1 };

    const inputRange = [
      (index - 1) * sizeForInterpolation,
      index * sizeForInterpolation,
      (index + 1) * sizeForInterpolation
    ];

    const translateY = interpolate(
      scrollY.value,
      inputRange,
      [-50, 0, -50],
      Extrapolation.CLAMP
    );

    return {
      opacity: interpolate(scrollY.value, inputRange, [0, 1, 0]),
      transform: [{ translateY }]
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

        <View className="px-10 items-center w-full z-10" pointerEvents="none">
          <Animated.Text
            style={[
              textAnimatedStyle,
              { width: '100%', paddingHorizontal: 4 }
            ]}
            numberOfLines={0}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            className={`text-white font-serif text-center mb-8 tracking-wide italic opacity-90 ${quote.text.length > 120 ? 'text-xl leading-8' :
                quote.text.length > 80 ? 'text-2xl leading-9' :
                  'text-3xl leading-10'
              }`}
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

        <Animated.View
          style={[authorAnimatedStyle, { position: 'absolute', bottom: 32, width: '100%', alignItems: 'center' }]}
          pointerEvents="none"
        >
          <Text className="text-white/20 text-[9px] font-sans uppercase tracking-[5px]">
            AURA : Manga & Motivation
          </Text>
        </Animated.View>

        {/* Power Level Badge - Horizontal Pill Style */}
        {profile && (
          <AnimatedTouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowRankModal(true)}
            style={[
              levelBadgeAnimatedStyle,
              {
                position: 'absolute',
                top: 55,
                left: 20,
                zIndex: 100, // Higher zIndex
              }
            ]}
          >
            <Animated.View
              style={[
                {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor: currentRank.color,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  alignItems: 'center',
                  gap: 4,
                  shadowColor: currentRank.glowColor,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 10,
                }
              ]}
            >
              {/* Top Row: Icon + Level + Separator + Rank Name */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {/* Left Group: Icon + Level */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  {React.createElement(currentRank.icon, {
                    size: 16,
                    color: currentRank.color,
                    strokeWidth: 2.5,
                    style: {
                      shadowColor: currentRank.glowColor,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.8,
                      shadowRadius: 6,
                    }
                  })}

                  <Text
                    style={{
                      color: 'white',
                      fontFamily: 'Bangers_400Regular',
                      fontSize: 18,
                      letterSpacing: 1
                    }}
                  >
                    LVL {profile.level}
                  </Text>
                </View>

                {/* Separator */}
                <View
                  style={{
                    width: 1,
                    height: 14,
                    backgroundColor: currentRank.color,
                    opacity: 0.5
                  }}
                />

                {/* Right Group: Rank Name */}
                <Text
                  style={{
                    color: currentRank.color,
                    fontSize: 12,
                    fontWeight: '800',
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    textShadowColor: currentRank.glowColor,
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 8,
                  }}
                >
                  {currentRank.name}
                </Text>
              </View>

              {/* XP Bar - Discreet */}
              <View style={{
                width: '100%',
                height: 2,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 1,
                marginTop: 1,
                overflow: 'hidden'
              }}>
                <View style={{
                  width: `${(() => {
                    const level = profile.level;
                    const currentLevelXP = level ** 2 * 10;
                    const nextLevelXP = (level + 1) ** 2 * 10;
                    const xpInCurrentLevel = profile.xp - currentLevelXP;
                    const xpNeededForLevel = nextLevelXP - currentLevelXP;
                    const progress = Math.min(1, Math.max(0, xpInCurrentLevel / xpNeededForLevel));
                    return progress * 100;
                  })()}%`,
                  height: '100%',
                  backgroundColor: currentRank.color,
                  borderRadius: 1
                }} />
              </View>

            </Animated.View>
          </AnimatedTouchableOpacity>
        )}

        {/* Rank Evolution Modal */}
        {profile && (
          <RankEvolutionModal
            visible={showRankModal}
            onClose={() => setShowRankModal(false)}
            currentLevel={profile.level}
          />
        )}

        {/* Already Seen Indicator - Discreet Top Right */}
        {alreadySeen && (
          <Animated.View
            style={[
              levelBadgeAnimatedStyle, // Use same fade/slide animation as level badge for consistency
              {
                position: 'absolute',
                top: 55,
                right: 20,
                zIndex: 50,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                gap: 4
              }
            ]}
          >
            <Eye size={12} color="rgba(255, 255, 255, 0.5)" />
            <Text style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: 10,
              fontWeight: '600',
              letterSpacing: 0.5
            }}>
              DÉJÀ LU
            </Text>
          </Animated.View>
        )}
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
