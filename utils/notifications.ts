import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import quotesData from '@/data/quotes.json';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const setupNotifications = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-motivation', {
      name: 'Daily Motivation',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Check permissions first without requesting
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  // If not granted, we'll return false so the UI can show the custom prompt
  if (existingStatus !== 'granted') {
    return false;
  }

  return true;
};

export const requestPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

export const scheduleDailyNotifications = async (hour: number, minute: number) => {
  // Cancel all existing notifications to avoid duplicates
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Schedule for the next 14 days
  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    // If today and time has passed, skip (or schedule for tomorrow, handled by loop)
    // Actually, trigger repeating: true is easier if we want just one generic message, 
    // but for dynamic content we need individual scheduling.
    
    // For today, if the time is passed, we should start from tomorrow? 
    // Or just schedule for the future.
    // Let's keep it simple: Schedule 14 individual notifications.
    
    // Adjust date to target time
    date.setHours(hour, minute, 0, 0);
    
    // If the time is in the past for today, add one day effectively (but loop handles it)
    if (date <= new Date()) {
      date.setDate(date.getDate() + 1);
    }

    const randomQuote = quotesData[Math.floor(Math.random() * quotesData.length)];

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Aura : Motivation du jour",
        body: randomQuote.text,
        data: { quoteId: randomQuote.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: date,
      },
    });
  }
};
