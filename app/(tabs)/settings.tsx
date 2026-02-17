import { PowerLevelBar } from '@/components/PowerLevelBar';
import { usePowerLevel } from '@/hooks/usePowerLevel';
import { useAuth } from '@/src/context/AuthContext';
import { useRequireAuth } from '@/src/hooks/useRequireAuth';
import { userService } from '@/src/services/userService';
import { requestPermissions, scheduleDailyNotifications, setupNotifications } from '@/utils/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { Bell, Clock } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { isGuest, user, signOut } = useAuth();
  const requireAuth = useRequireAuth();
  const router = useRouter();
  const [isEnabled, setIsEnabled] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Power Level hook - always call (React Hooks rules)
  const { profile, updateDailyStreak, addXP, loading, error } = usePowerLevel();

  // Track if we already updated the streak to avoid infinite loops
  const streakUpdatedRef = useRef(false);

  useEffect(() => {
    loadSettings();
  }, []);

  // Update daily streak when user is authenticated and profile is loaded
  useEffect(() => {
    if (!isGuest && user && profile && !loading && !error && !streakUpdatedRef.current) {
      streakUpdatedRef.current = true;
      updateDailyStreak();
    }
  }, [user, profile, loading, error, isGuest]);

  const loadSettings = async () => {
    try {
      if (!isGuest && user) {
        // Load from Supabase logic here if needed, or stick to local for now but synced
        // For now, let's keep local storage as source of truth for device-specific notifications,
        // but we could sync with userService.getProfile() if we want cross-device sync.
        // Given the requirement "User Service... Gérer les préférences utilisateur... stockées dans la table profiles",
        // we should try to load from profile.
        const profile = await userService.getProfile();
        if (profile) {
          if (profile.notifications_enabled !== undefined) setIsEnabled(profile.notifications_enabled);
          if (profile.notification_time) {
            // Parse time string 'HH:MM:SS'
            const [h, m] = profile.notification_time.split(':');
            const d = new Date();
            d.setHours(parseInt(h), parseInt(m), 0, 0);
            setDate(d);
          }
          return;
        }
      }

      // Fallback to local storage (or if guest, though guests see disabled)
      const storedEnabled = await AsyncStorage.getItem('notificationsEnabled');
      const storedTime = await AsyncStorage.getItem('notificationTime');

      if (storedEnabled !== null) {
        setIsEnabled(JSON.parse(storedEnabled));
      }

      if (storedTime !== null) {
        const savedDate = new Date(JSON.parse(storedTime));
        // Ensure it's a valid date
        if (!isNaN(savedDate.getTime())) {
          setDate(savedDate);
        }
      } else {
        // Default 9:00 AM
        const defaultDate = new Date();
        defaultDate.setHours(9, 0, 0, 0);
        setDate(defaultDate);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveSettings = async (enabled: boolean, timeVal: Date) => {
    try {
      await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(enabled));
      await AsyncStorage.setItem('notificationTime', JSON.stringify(timeVal));

      if (!isGuest && user) {
        await userService.updateProfile({
          notifications_enabled: enabled,
          notification_time: `${timeVal.getHours().toString().padStart(2, '0')}:${timeVal.getMinutes().toString().padStart(2, '0')}:00`
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggle = () => {
    requireAuth(() => {
      toggleSwitch();
    });
  };

  const toggleSwitch = async () => {
    const newState = !isEnabled;

    if (newState) {
      // Turning ON
      const hasPermission = await setupNotifications();
      if (!hasPermission) {
        Alert.alert(
          "Autorisation requise",
          "Autorise Aura à t'envoyer ta dose de force chaque matin.",
          [
            { text: "Plus tard", style: "cancel", onPress: () => setIsEnabled(false) },
            {
              text: "Autoriser",
              onPress: async () => {
                const granted = await requestPermissions();
                if (granted) {
                  setIsEnabled(true);
                  await scheduleDailyNotifications(date.getHours(), date.getMinutes());
                  saveSettings(true, date);
                } else {
                  setIsEnabled(false);
                }
              }
            }
          ]
        );
      } else {
        setIsEnabled(true);
        await scheduleDailyNotifications(date.getHours(), date.getMinutes());
        saveSettings(true, date);
      }
    } else {
      // Turning OFF
      setIsEnabled(false);
      await Notifications.cancelAllScheduledNotificationsAsync();
      saveSettings(false, date);
    }
  };

  const onChange = async (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedDate) {
      setDate(selectedDate);
      if (isEnabled) {
        await scheduleDailyNotifications(selectedDate.getHours(), selectedDate.getMinutes());
        saveSettings(true, selectedDate);
      } else {
        saveSettings(false, selectedDate);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0F0F0F]" edges={['top']}>
      <ScrollView className="flex-1">
        <View className="px-6 py-6">
          <Text className="text-white text-3xl font-bold tracking-tight mb-2">
            Paramètres
          </Text>
          <Text className="text-gray-500 text-sm mb-8">
            Personnalisez votre expérience Aura
          </Text>

          {/* User Profile Section */}
          {!isGuest && user && (
            <View className="bg-[#1A1A1A] rounded-2xl p-6 mb-6">
              <View className="flex-row items-center gap-4">
                {/* Avatar */}
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    overflow: 'hidden',
                    backgroundColor: '#007AFF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: '#FFF',
                  }}
                >
                  {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                    <View style={{ width: 64, height: 64 }}>
                      <View style={{ width: 64, height: 64, backgroundColor: '#007AFF', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#FFF', fontSize: 24, fontWeight: 'bold' }}>
                          {(() => {
                            const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email;
                            if (!name) return '?';
                            const parts = name.split(' ');
                            if (parts.length >= 2) {
                              return (parts[0][0] + parts[1][0]).toUpperCase();
                            }
                            return name.substring(0, 2).toUpperCase();
                          })()}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <Text style={{ color: '#FFF', fontSize: 24, fontWeight: 'bold' }}>
                      {(() => {
                        const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email;
                        if (!name) return '?';
                        const parts = name.split(' ');
                        if (parts.length >= 2) {
                          return (parts[0][0] + parts[1][0]).toUpperCase();
                        }
                        return name.substring(0, 2).toUpperCase();
                      })()}
                    </Text>
                  )}
                </View>

                {/* User Info */}
                <View className="flex-1">
                  <Text className="text-white text-lg font-bold mb-1">
                    {user.user_metadata?.full_name || user.user_metadata?.name || 'Utilisateur'}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    {user.email}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Power Level Section */}
          {!isGuest && user && profile && (
            <View className="bg-[#1A1A1A] rounded-2xl p-6 mb-6">
              <View className="flex-row items-center mb-4">
                <Text className="text-2xl mr-2">⚡</Text>
                <Text className="text-white text-xl font-bold">
                  Aura Level
                </Text>
              </View>

              <PowerLevelBar
                level={profile.level}
                xp={profile.xp}
                animated={true}
              />
            </View>
          )}

          {/* DEBUG: Rank Testing Section - Only in Development */}
          {__DEV__ && !isGuest && user && profile && (
            <View className="bg-[#2A1A1A] rounded-2xl p-6 mb-6 border-2 border-red-500/30">
              <View className="flex-row items-center mb-4">
                <Text className="text-2xl mr-2">🧪</Text>
                <Text className="text-white text-xl font-bold">
                  Debug - Test des Rangs
                </Text>
              </View>

              <Text className="text-gray-400 text-xs mb-4">
                Teste les différents rangs en modifiant temporairement ton niveau
              </Text>

              <View className="flex-row flex-wrap gap-2">
                {/* BOIS - Level 1 */}
                <Pressable
                  onPress={() => addXP(-profile.xp + 10)} // level 1: 1² * 10 = 10 XP
                  className="bg-[#8B4513] px-4 py-3 rounded-lg flex-1 min-w-[45%]"
                >
                  <Text className="text-white text-xs font-bold text-center">🪵 BOIS</Text>
                  <Text className="text-white/70 text-[10px] text-center mt-1">LVL 1</Text>
                </Pressable>

                {/* FER - Level 5 */}
                <Pressable
                  onPress={() => addXP(-profile.xp + (5 * 5 * 10))} // level 5: 5² * 10 = 250 XP
                  className="bg-[#708090] px-4 py-3 rounded-lg flex-1 min-w-[45%]"
                >
                  <Text className="text-white text-xs font-bold text-center">⚙️ FER</Text>
                  <Text className="text-white/70 text-[10px] text-center mt-1">LVL 5</Text>
                </Pressable>

                {/* BRONZE - Level 10 */}
                <Pressable
                  onPress={() => addXP(-profile.xp + (10 * 10 * 10))} // level 10: 10² * 10 = 1000 XP
                  className="bg-[#CD7F32] px-4 py-3 rounded-lg flex-1 min-w-[45%]"
                >
                  <Text className="text-white text-xs font-bold text-center">🥉 BRONZE</Text>
                  <Text className="text-white/70 text-[10px] text-center mt-1">LVL 10</Text>
                </Pressable>

                {/* ARGENT - Level 20 */}
                <Pressable
                  onPress={() => addXP(-profile.xp + (20 * 20 * 10))} // level 20: 20² * 10 = 4000 XP
                  className="bg-[#C0C0C0] px-4 py-3 rounded-lg flex-1 min-w-[45%]"
                >
                  <Text className="text-black text-xs font-bold text-center">🥈 ARGENT</Text>
                  <Text className="text-black/70 text-[10px] text-center mt-1">LVL 20</Text>
                </Pressable>

                {/* OR - Level 35 */}
                <Pressable
                  onPress={() => addXP(-profile.xp + (35 * 35 * 10))} // level 35: 35² * 10 = 12,250 XP
                  className="bg-[#FFD700] px-4 py-3 rounded-lg flex-1 min-w-[45%]"
                >
                  <Text className="text-black text-xs font-bold text-center">🥇 OR</Text>
                  <Text className="text-black/70 text-[10px] text-center mt-1">LVL 35</Text>
                </Pressable>

                {/* PLATINE - Level 50 */}
                <Pressable
                  onPress={() => addXP(-profile.xp + (50 * 50 * 10))} // level 50: 50² * 10 = 25,000 XP
                  className="bg-[#E5E4E2] px-4 py-3 rounded-lg flex-1 min-w-[45%]"
                >
                  <Text className="text-black text-xs font-bold text-center">💎 PLATINE</Text>
                  <Text className="text-black/70 text-[10px] text-center mt-1">LVL 50</Text>
                </Pressable>

                {/* DIAMANT - Level 75 */}
                <Pressable
                  onPress={() => addXP(-profile.xp + (75 * 75 * 10))} // level 75: 75² * 10 = 56,250 XP
                  className="bg-[#B9F2FF] px-4 py-3 rounded-lg flex-1 min-w-[45%]"
                >
                  <Text className="text-black text-xs font-bold text-center">💠 DIAMANT</Text>
                  <Text className="text-black/70 text-[10px] text-center mt-1">LVL 75</Text>
                </Pressable>

                {/* RESET */}
                <Pressable
                  onPress={() => addXP(-profile.xp + 10)} // Reset to level 1: 1² * 10 = 10 XP
                  className="bg-red-600 px-4 py-3 rounded-lg flex-1 min-w-[45%]"
                >
                  <Text className="text-white text-xs font-bold text-center">🔄 RESET</Text>
                  <Text className="text-white/70 text-[10px] text-center mt-1">Retour LVL 1</Text>
                </Pressable>
              </View>

              <Text className="text-yellow-500 text-xs mt-4 text-center">
                ⚠️ Mode Debug uniquement - Visible en développement
              </Text>
            </View>
          )}

          {/* Streak Section */}
          {!isGuest && user && profile && (
            <View className="bg-[#1A1A1A] rounded-2xl p-6 mb-6">
              <View className="flex-row items-center mb-4">
                <Text className="text-2xl mr-2">🔥</Text>
                <Text className="text-white text-xl font-bold">
                  Streak
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-gray-400 text-sm mb-1">Current Streak</Text>
                  <Text className="text-white text-5xl font-bold">
                    {profile.streakCount}
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1">days</Text>
                </View>

                <View className="items-end">
                  <Text className="text-gray-400 text-sm mb-1">Best Streak</Text>
                  <Text className="text-yellow-400 text-5xl font-bold">
                    {profile.maxStreak}
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1">days</Text>
                </View>
              </View>
            </View>
          )}

          {/* Guest CTA */}
          {isGuest && (
            <Pressable
              onPress={() => router.push('/login')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-6"
              style={{
                backgroundColor: '#007AFF',
              }}
            >
              <Text className="text-white text-lg font-bold mb-2">
                Connectez-vous pour débloquer toutes les fonctionnalités
              </Text>
              <Text className="text-white/80 text-sm">
                Synchronisez vos favoris, activez les notifications et bien plus encore
              </Text>
            </Pressable>
          )}

          {/* Notifications Section */}

          <View className="bg-[#1A1A1A] rounded-2xl p-4">
            <View className="flex-row items-center justify-between py-2">
              <View className="flex-row items-center gap-3">
                <View className="bg-[#2A2A2A] p-2 rounded-full">
                  <Bell size={20} color={isEnabled ? "#FFF" : "#666"} />
                </View>
                <View>
                  <Text className="text-white text-base font-semibold">
                    Notifications
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    Recevoir une citation quotidienne
                  </Text>
                </View>
              </View>
              <View style={{ opacity: isGuest ? 0.5 : 1 }}>
                <Switch
                  trackColor={{ false: "#333", true: "#FFF" }}
                  thumbColor={isEnabled ? "#000" : "#f4f3f4"}
                  ios_backgroundColor="#333"
                  onValueChange={handleToggle}
                  value={isEnabled}
                  disabled={isGuest} // Actually disabled, but we want the press to trigger auth? 
                // Switch doesn't support onPress easily when disabled.
                // We'll wrap it or just let the handleToggle handle it (helper function)
                // If we disable it, onPress won't fire. 
                // Better to NOT disable it in prop, but handle logic in onValueChange (which calls requireAuth)
                />
              </View>
            </View>

            {isGuest && (
              <Pressable onPress={() => router.push('/login')} className="mt-2 mb-2 bg-[#2A2A2A] p-2 rounded-lg">
                <Text className="text-yellow-500 text-xs text-center">
                  Connectez-vous pour activer les notifications
                </Text>
              </Pressable>
            )}

            {isEnabled && !isGuest && (
              <View className="mt-6 pt-6 border-t border-[#2A2A2A]">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="bg-[#2A2A2A] p-2 rounded-full">
                      <Clock size={20} color="#FFF" />
                    </View>
                    <Text className="text-white text-base font-semibold">
                      Heure de rappel
                    </Text>
                  </View>

                  {Platform.OS === 'android' ? (
                    <Pressable
                      onPress={() => setShowPicker(true)}
                      className="bg-[#2A2A2A] px-4 py-2 rounded-lg"
                    >
                      <Text className="text-white font-mono">
                        {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </Pressable>
                  ) : (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode="time"
                      is24Hour={true}
                      onChange={onChange}
                      themeVariant="dark"
                      accentColor="white"
                      textColor="white"
                      style={{ width: 100 }}
                    />
                  )}
                </View>

                {Platform.OS === 'android' && showPicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                  />
                )}
              </View>
            )}
          </View>

          {!isGuest && (
            <Pressable
              onPress={async () => {
                await signOut();
              }}
              className="mt-8 bg-[#1A1A1A] p-4 rounded-2xl items-center"
            >
              <Text className="text-red-500 font-bold">Se déconnecter</Text>
            </Pressable>
          )}

          <View className="mt-8 px-2">
            <Text className="text-gray-600 text-center text-xs">
              Aura v1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
