import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useState, useRef } from 'react';
import { Button, Platform, SafeAreaView, Text, View, Alert, ScrollView, StyleSheet } from 'react-native';

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Test Notification',
    body: 'This is a test notification sent at ' + new Date().toLocaleTimeString(),
    data: {
      someData: 'test data',
      timestamp: Date.now(),
      action: 'test_notification'
    },
  };

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();
    console.log('Push notification response:', result);

    if (result.data && result.data.status === 'error') {
      throw new Error(result.data.message || 'Failed to send notification');
    }

    return result;
  } catch (error) {
    console.error('Error sending push notification:', error);
    Alert.alert('Error', 'Failed to send push notification');
    throw error;
  }
}

function handleRegistrationError(errorMessage: string) {
  console.error('Registration error:', errorMessage);
  Alert.alert('Registration Error', errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }

    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log('Push token:', pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

// Test local notification function
async function scheduleTestNotification() {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Local Test Notification',
        body: 'This is a local notification scheduled at ' + new Date().toLocaleTimeString(),
        data: {
          type: 'local_test',
          timestamp: Date.now()
        },
      },
      trigger: null, // Show after 2 seconds
    });
    Alert.alert('Success', 'Local notification scheduled for 2 seconds from now');
  } catch (error) {
    console.error('Error scheduling local notification:', error);
    Alert.alert('Error', 'Failed to schedule local notification');
  }
}

export default function NotificationsPage() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationHistory, setNotificationHistory] = useState<Notifications.Notification[]>([]);

  // Use proper ref typing with null initial value
  const notificationListener = useRef<{ remove(): void } | null>(null);
  const responseListener = useRef<{ remove(): void } | null>(null);

  useEffect(() => {
    let isMounted = true;

    const setupNotifications = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (isMounted) {
          setExpoPushToken(token ?? '');
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setExpoPushToken(`Error: ${error}`);
          setIsLoading(false);
        }
      }
    };

    setupNotifications();

    // Set up notification listeners
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 Notification Received:', notification);
      if (isMounted) {
        setNotification(notification);
        setNotificationHistory(prev => [notification, ...prev.slice(0, 4)]); // Keep last 5
      }
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('🔔 Notification Response:', response);
      Alert.alert(
        'Notification Tapped',
        `You tapped on: ${response.notification.request.content.title}`
      );
      // Handle navigation or other actions based on notification data here
    });

    return () => {
      isMounted = false;

      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  const handleSendPushNotification = async () => {
    if (!expoPushToken || expoPushToken.startsWith('Error:')) {
      Alert.alert('Error', 'No valid push token available');
      return;
    }

    try {
      await sendPushNotification(expoPushToken);
      Alert.alert('Success', 'Push notification sent!');
    } catch (error) {
			console.log( error );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Notification Testing</Text>

          {/* Token Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Push Token Status:</Text>
            <Text style={styles.tokenText}>
              {isLoading ? 'Loading...' : (expoPushToken || 'No token available')}
            </Text>
          </View>

          {/* Current Notification Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Latest Notification:</Text>
            {notification ? (
              <View style={styles.notificationCard}>
                <Text style={styles.notificationTitle}>
                  Title: {notification.request.content.title || 'No title'}
                </Text>
                <Text style={styles.notificationBody}>
                  Body: {notification.request.content.body || 'No body'}
                </Text>
                <Text style={styles.notificationData}>
                  Data: {JSON.stringify(notification.request.content.data) || 'No data'}
                </Text>
                <Text style={styles.notificationTime}>
                  Received: {new Date(notification.date).toLocaleString()}
                </Text>
              </View>
            ) : (
              <Text style={styles.noNotification}>No notifications received yet</Text>
            )}
          </View>

          {/* Notification History */}
          {notificationHistory.length > 1 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Notifications:</Text>
              {notificationHistory.slice(1).map((notif, index) => (
                <View key={index} style={styles.historyCard}>
                  <Text style={styles.historyTitle}>{notif.request.content.title}</Text>
                  <Text style={styles.historyTime}>
                    {new Date(notif.date).toLocaleTimeString()}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Send Push Notification"
              onPress={handleSendPushNotification}
              disabled={isLoading || expoPushToken.startsWith('Error:')}
            />

            <View style={styles.buttonSpacer} />

            <Button
              title="Schedule Local Notification"
              onPress={scheduleTestNotification}
              color="#007AFF"
            />

            <View style={styles.buttonSpacer} />

            <Button
              title="Clear History"
              onPress={() => {
                setNotification(null);
                setNotificationHistory([]);
              }}
              color="#FF3B30"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  tokenText: {
    fontSize: 12,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 5,
  },
  notificationCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  notificationBody: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  notificationData: {
    fontSize: 12,
    color: '#888',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 5,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  noNotification: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  historyCard: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  historyTime: {
    fontSize: 12,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 20,
  },
  buttonSpacer: {
    height: 15,
  },
});