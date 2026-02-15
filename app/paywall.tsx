import { useAuth } from '@/src/context/AuthContext';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

export default function PaywallScreen() {
  const { signInWithApple, signInWithGoogle } = useAuth();
  const isPresented = router.canGoBack();
  return (
    <View className="flex-1 bg-[#0F0F0F] items-center justify-center p-4">
      {isPresented && (
        <Pressable onPress={() => router.back()} className="absolute top-12 right-4 z-10 p-2">
          <X color="#fff" size={24} />
        </Pressable>
      )}
      <Text className="text-white text-2xl font-bold mb-4">Aura Pro</Text>
      <Text className="text-gray-400 text-center mb-8">
        Débloquez toutes les citations et supprimez les publicités.
      </Text>
      <View className="bg-[#1A1A1A] p-6 rounded-xl w-full mb-8">
        <Text className="text-white text-xl font-bold text-center mb-2">19.99€ / an</Text>
        <Text className="text-gray-400 text-center">3 jours d'essai gratuit</Text>
      </View>
      <Pressable className="bg-white py-4 px-8 rounded-full w-full items-center mb-4">
        <Text className="text-black font-bold text-lg">Commencer l'essai gratuit</Text>
      </Pressable>

      <Text className="text-gray-500 mb-4 text-xs font-bold uppercase tracking-widest">
        Ou connectez-vous
      </Text>

      <Pressable
        onPress={() => signInWithApple().then(() => router.back())}
        className="bg-black border border-gray-700 py-4 px-8 rounded-full w-full items-center mb-3 flex-row justify-center gap-2"
      >
        <Text className="text-white font-bold text-base">Continuer avec Apple</Text>
      </Pressable>

      <Pressable
        onPress={() => signInWithGoogle().then(() => router.back())}
        className="bg-white py-4 px-8 rounded-full w-full items-center flex-row justify-center gap-2"
      >
        <Text className="text-black font-bold text-base">Continuer avec Google</Text>
      </Pressable>
    </View>
  );
}
