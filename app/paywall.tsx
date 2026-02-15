import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Sparkles, X } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PaywallScreen() {
  const insets = useSafeAreaInsets();

  const handleClose = () => {
    console.log('✖️ Close button clicked in Paywall');
    router.back();
  };

  const handleStartTrial = () => {
    console.log('🚀 Start Trial clicked');
    // TODO: Implement subscription logic
  };

  const handleLogin = () => {
    console.log('🔑 Redirect to login');
    router.push('/login');
  };

  return (
    <View className="flex-1 bg-[#0F0F0F]" pointerEvents="box-none">
      {/* Gradient Background */}
      <LinearGradient
        colors={['#0F0F0F', '#1A1A1A', '#0F0F0F']}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        pointerEvents="none"
      />

      {/* Close Button */}
      <TouchableOpacity
        onPress={handleClose}
        hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        activeOpacity={0.7}
        style={{
          position: 'absolute',
          top: insets.top + 10,
          right: 10,
          zIndex: 9999,
          backgroundColor: 'rgba(26, 26, 26, 0.3)',
          padding: 16,
          borderRadius: 999,
        }}
      >
        <View pointerEvents="none">
          <X color="#fff" size={32} />
        </View>
      </TouchableOpacity>

      <View className="flex-1 items-center justify-center p-8">
        {/* Icon */}
        <View className="bg-white/10 p-6 rounded-3xl mb-6 backdrop-blur-xl">
          <Sparkles size={48} color="#FFD700" strokeWidth={1.5} />
        </View>

        {/* Title */}
        <Text className="text-white text-3xl font-bold mb-4">Aura Pro</Text>

        {/* Subtitle */}
        <Text className="text-gray-400 text-center mb-8 text-base leading-6">
          Débloquez toutes les citations et supprimez les publicités.
        </Text>

        {/* Pricing Card */}
        <View className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] p-8 rounded-3xl w-full mb-8 border border-gray-800">
          <View className="items-center">
            <Text className="text-white text-4xl font-bold mb-2">19.99€</Text>
            <Text className="text-gray-400 text-base mb-4">par an</Text>
            <View className="bg-yellow-500/20 px-4 py-2 rounded-full">
              <Text className="text-yellow-500 font-bold text-sm">
                3 jours d'essai gratuit
              </Text>
            </View>
          </View>

          {/* Features */}
          <View className="mt-6 gap-3">
            <View className="flex-row items-center gap-3">
              <Text className="text-green-500 text-xl">✓</Text>
              <Text className="text-gray-300 text-sm">Accès illimité à toutes les citations</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Text className="text-green-500 text-xl">✓</Text>
              <Text className="text-gray-300 text-sm">Aucune publicité</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Text className="text-green-500 text-xl">✓</Text>
              <Text className="text-gray-300 text-sm">Synchronisation multi-appareils</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Text className="text-green-500 text-xl">✓</Text>
              <Text className="text-gray-300 text-sm">Notifications personnalisées</Text>
            </View>
          </View>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          onPress={handleStartTrial}
          className="bg-white py-5 px-8 rounded-2xl w-full items-center mb-4 shadow-lg"
          activeOpacity={0.8}
        >
          <Text className="text-black font-bold text-lg">Commencer l'essai gratuit</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity
          onPress={handleLogin}
          className="py-3"
          activeOpacity={0.7}
        >
          <Text className="text-gray-400 text-sm">
            Déjà un compte ?{' '}
            <Text className="text-white font-semibold underline">Se connecter</Text>
          </Text>
        </TouchableOpacity>

        {/* Terms */}
        <Text className="text-gray-600 text-center text-xs mt-6 leading-5">
          L'abonnement sera renouvelé automatiquement.{'\n'}
          Annulez à tout moment dans les réglages.
        </Text>
      </View>
    </View>
  );
}
