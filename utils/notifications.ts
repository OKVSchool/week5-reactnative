import * as Notifications from 'expo-notifications';

export async function scheduleInactivityReminder() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'macroTrack',
      body: 'No recent items logged',
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 10 },
  });
}

export async function scheduleDailyReminder() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'macroTrack',
      body: 'No recent items logged',
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 10 },
  });
}
