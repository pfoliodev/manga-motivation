import { AppleLogo, GoogleLogo } from '@/components/SocialLogos';
import { useAuth } from '@/src/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const { signInWithApple, signInWithGoogle } = useAuth();
    const insets = useSafeAreaInsets();

    const handleAppleSignIn = async () => {
        console.log('🍎 Apple Sign In clicked');
        try {
            await signInWithApple();
            router.back();
        } catch (error) {
            console.error('Apple sign in error:', error);
        }
    };

    const handleGoogleSignIn = async () => {
        console.log('🔷 Google Sign In clicked');
        try {
            await signInWithGoogle();
            router.back();
        } catch (error) {
            console.error('Google sign in error:', error);
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <View className="flex-1 bg-[#121212]">
                {/* Background with Manga Atmosphere */}
                <LinearGradient
                    colors={['#1a1a1a', '#0a0a0a', '#000000']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />

                {/* Subtle Electric Blue Glow in corners */}
                <LinearGradient
                    colors={['rgba(0, 122, 255, 0.15)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0.5, y: 0.5 }}
                    style={[StyleSheet.absoluteFill, { height: '50%' }]}
                />
                <LinearGradient
                    colors={['transparent', 'rgba(255, 69, 0, 0.1)']}
                    start={{ x: 0.5, y: 0.5 }}
                    end={{ x: 1, y: 1 }}
                    style={[StyleSheet.absoluteFill, { top: '50%', height: '50%' }]}
                />

                {/* Custom Header - Minimalist */}
                <View
                    className="flex-row items-center px-4 pb-4 z-10"
                    style={{ paddingTop: insets.top + 10 }}
                >
                    <TouchableOpacity
                        onPress={() => router.back()}
                        hitSlop={{ top: 40, bottom: 40, left: 40, right: 40 }}
                        activeOpacity={0.7}
                        className="p-4"
                    >
                        <View pointerEvents="none">
                            <ArrowLeft size={28} color="#FFF" />
                        </View>
                    </TouchableOpacity>
                </View>

                <View className="flex-1 items-center justify-center px-6">
                    {/* Main Graphic - Aura Icon */}
                    <View className="mb-8 items-center justify-center">
                        <View className="absolute w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
                        <Image
                            source={require('@/assets/images/aura_icon.png')}
                            style={{ width: 160, height: 160 }}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Typography - Aggressive Title */}
                    <Text className="text-white text-4xl font-black text-center mb-2 tracking-tighter italic" style={{ textShadowColor: 'rgba(0, 122, 255, 0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 10 }}>
                        CONNEXION
                    </Text>

                    {/* Subtitle - Monospace style for tech feel */}
                    <Text className="text-gray-400 text-center text-sm mb-12 px-8 font-medium tracking-wide leading-6 uppercase italic">
                        Libère ton Aura, dépasse tes limites
                    </Text>

                    {/* Social Login Buttons - Sleek & Modern */}
                    <View className="w-full gap-4 mb-8">
                        {/* Google Button */}
                        <TouchableOpacity
                            onPress={handleGoogleSignIn}
                            activeOpacity={0.9}
                            className="bg-white py-4 px-6 rounded-lg flex-row items-center justify-center gap-3 shadow-lg border border-gray-200"
                            style={{ elevation: 5 }}
                        >
                            <View pointerEvents="none">
                                <GoogleLogo size={22} />
                            </View>
                            <Text className="text-black font-bold text-base tracking-wide uppercase">
                                Continuer avec Google
                            </Text>
                        </TouchableOpacity>

                        {/* Apple Button */}
                        <TouchableOpacity
                            onPress={handleAppleSignIn}
                            activeOpacity={0.9}
                            className="bg-black py-4 px-6 rounded-lg flex-row items-center justify-center gap-3 border border-white/20"
                        >
                            <View pointerEvents="none">
                                <AppleLogo size={22} color="#FFFFFF" />
                            </View>
                            <Text className="text-white font-bold text-base tracking-wide uppercase">
                                Continuer avec Apple
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Divider - Tech Style */}
                    <View className="flex-row items-center w-full mb-8 opacity-50">
                        <View className="flex-1 h-[1px] bg-gray-600" />
                        <Text className="text-gray-500 text-[10px] mx-4 font-bold tracking-[4px] uppercase">
                            OU
                        </Text>
                        <View className="flex-1 h-[1px] bg-gray-600" />
                    </View>

                    {/* Guest Button - Manga Style (Rough Border) */}
                    <TouchableOpacity
                        onPress={() => {
                            console.log('👤 Continue as guest');
                            router.back();
                        }}
                        activeOpacity={0.8}
                        className="w-full py-4 px-6 items-center border-[3px] border-white bg-transparent"
                        style={{
                            shadowColor: '#FFF',
                            shadowOffset: { width: 4, height: 4 },
                            shadowOpacity: 0.2,
                            shadowRadius: 0, // Sharp shadow for comic look
                            transform: [{ skewX: '-3deg' }] // Slight skew for dynamic feel
                        }}
                    >
                        <Text className="text-white font-black text-base uppercase tracking-widest italic">
                            Continuer sans compte
                        </Text>
                    </TouchableOpacity>

                    {/* Footer - Minimal */}
                    <View className="absolute bottom-8 w-full items-center opacity-60">
                        <Text className="text-gray-600 text-[10px] text-center font-medium tracking-wide">
                            En continuant, vous acceptez nos termes et conditions.
                        </Text>
                    </View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    mangaButton: {
        borderWidth: 2,
        borderColor: 'white',
        borderStyle: 'dashed', // Fallback if image not used
    }
});
