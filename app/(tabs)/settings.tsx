import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Alert, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { setupNotifications, requestPermissions, scheduleDailyNotifications } from '@/utils/notifications';
import { Bell, Clock } from 'lucide-react-native';

export default function SettingsScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
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
    } catch (e) {
      console.error(e);
    }
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
      <View className="px-6 py-6">
        <Text className="text-white text-3xl font-bold tracking-tight mb-2">
          Paramètres
        </Text>
        <Text className="text-gray-500 text-sm mb-8">
          Personnalisez votre expérience Aura
        </Text>

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
            <Switch
              trackColor={{ false: "#333", true: "#FFF" }}
              thumbColor={isEnabled ? "#000" : "#f4f3f4"}
              ios_backgroundColor="#333"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>

          {isEnabled && (
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

        <View className="mt-8 px-2">
            <Text className="text-gray-600 text-center text-xs">
                Aura v1.0.0
            </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
