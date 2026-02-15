import { useAuth } from '@/src/context/AuthContext';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PaywallScreen() {
  const { signInWithApple, signInWithGoogle } = useAuth();
  const insets = useSafeAreaInsets();
  const isPresented = router.canGoBack();

  const handleClose = () => {
    console.log('✖️ Close button clicked in Paywall');
    router.back();
  };

  return (
    <View className="flex-1 bg-[#0F0F0F]" pointerEvents="box-none">
      {/* Bouton de fermeture positionné tout en haut de la hiérarchie */}
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
        <Text className="text-white text-2xl font-bold mb-4">Aura Pro</Text>
        <Text className="text-gray-400 text-center mb-8">
          Débloquez toutes les citations et supprimez les publicités.
        </Text>
        <View className="bg-[#1A1A1A] p-6 rounded-xl w-full mb-8">
          <Text className="text-white text-xl font-bold text-center mb-2">19.99€ / an</Text>
          <Text className="text-gray-400 text-center">3 jours d'essai gratuit</Text>
        </View>
        <TouchableOpacity
          onPress={() => console.log('🚀 Start Trial clicked')}
          className="bg-white py-4 px-8 rounded-full w-full items-center mb-4"
        >
          <Text className="text-black font-bold text-lg">Commencer l'essai gratuit</Text>
        </TouchableOpacity>

        <Text className="text-gray-500 mb-4 text-xs font-bold uppercase tracking-widest">
          Ou connectez-vous
        </Text>

        <TouchableOpacity
          onPress={() => {
            console.log('🍎 Login Apple clicked');
            signInWithApple().then(() => router.back());
          }}
          className="bg-black border border-gray-700 py-4 px-8 rounded-full w-full items-center mb-3 flex-row justify-center gap-2"
        >
          <Text className="text-white font-bold text-base">Continuer avec Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            console.log('🔷 Login Google clicked');
            signInWithGoogle().then(() => router.back());
          }}
          className="bg-white py-4 px-8 rounded-full w-full items-center flex-row justify-center gap-2"
        >
          <Text className="text-black font-bold text-base">Continuer avec Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
