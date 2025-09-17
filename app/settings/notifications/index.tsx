// app/settings/notifications/index.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Switch,
  Alert,
  TouchableOpacity,
  ScrollView,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNotificationStore } from '@/store/notification.store';

export default function NotificationsPage () {
  const {
    permissions,
    preferences,
    isLoading,
    requestPermissions,
    updatePreferences,
    updateDailyNotification,
    testNotification,
  } = useNotificationStore();

  const [ showTimePicker, setShowTimePicker ] = useState( false );

  useEffect( () => {
    // Demander les permissions au chargement si pas encore accordées
    if ( !permissions ) {
      requestPermissions();
    }
  }, [ permissions, requestPermissions ] );

  const handlePermissionRequest = async () => {
    await requestPermissions();
    if ( !permissions ) {
      Alert.alert(
        'Permissions requises',
        'Veuillez autoriser les notifications dans les paramètres de votre téléphone',
        [ { text: 'OK' } ]
      );
    }
  };

  const handleTimeChange = ( selectedTime: Date ) => {
    const hours = selectedTime.getHours().toString().padStart( 2, '0' );
    const minutes = selectedTime.getMinutes().toString().padStart( 2, '0' );
    const timeString = `${hours}:${minutes}`;

    // Mettre à jour l'heure tout en gardant l'état activé/désactivé
    updateDailyNotification( preferences.dailyReminder, timeString );

    // Sur iOS, fermer le picker manuellement
    if ( Platform.OS === 'ios' ) {
      setShowTimePicker( false );
    }
  };

  const handleDailyReminderToggle = ( value: boolean ) => {
    updateDailyNotification( value, preferences.dailyTime );
  };

  const handleTestNotification = () => {
    if ( !permissions ) {
      Alert.alert( 'Permissions manquantes', 'Veuillez d\'abord autoriser les notifications' );
      return;
    }
    testNotification();
    Alert.alert( 'Test envoyé', 'Vérifiez votre barre de notifications !' );
  };

  const formatTime = ( timeString: string ) => {
    const [ hours, minutes ] = timeString.split( ':' );
    const hour24 = parseInt( hours );

    if ( Platform.OS === 'ios' ) {
      // Format 12h pour iOS
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const period = hour24 >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minutes} ${period}`;
    } else {
      // Format 24h pour Android
      return `${hours}:${minutes}`;
    }
  };

  const getInitialTimeForPicker = () => {
    const [ hours, minutes ] = preferences.dailyTime.split( ':' ).map( Number );
    const date = new Date();
    date.setHours( hours, minutes, 0, 0 );
    return date;
  };

  if ( isLoading ) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg">Chargement des paramètres...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-6 text-gray-900">
          Paramètres de notifications
        </Text>

        {/* Status des permissions */ }
        <View className="bg-gray-50 border border-gray-200 p-4 rounded-xl mb-6">
          <Text className="font-semibold mb-2 text-gray-900">
            État des notifications
          </Text>
          <View className="flex-row items-center">
            <Text className={ `text-sm ${permissions ? 'text-green-600' : 'text-red-600'}` }>
              { permissions ? '✅ Autorisées' : '❌ Non autorisées' }
            </Text>
          </View>

          { !permissions && (
            <TouchableOpacity
              onPress={ handlePermissionRequest }
              className="bg-blue-500 p-3 rounded-lg mt-3"
            >
              <Text className="text-white text-center font-medium">
                Autoriser les notifications
              </Text>
            </TouchableOpacity>
          ) }
        </View>

        {/* Section Rappel quotidien */ }
        <View className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900">
                Rappel quotidien
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                Notification quotidienne pour votre entraînement
              </Text>
            </View>
            <Switch
              value={ preferences.dailyReminder }
              onValueChange={ handleDailyReminderToggle }
              disabled={ !permissions }
              trackColor={ { false: '#f3f4f6', true: '#3b82f6' } }
              thumbColor={ preferences.dailyReminder ? '#ffffff' : '#9ca3af' }
            />
          </View>

          {/* Sélecteur d'heure */ }
          <TouchableOpacity
            onPress={ () => setShowTimePicker( true ) }
            disabled={ !permissions || !preferences.dailyReminder }
            className={ `border border-gray-300 p-4 rounded-lg ${!permissions || !preferences.dailyReminder
                ? 'bg-gray-100 opacity-50'
                : 'bg-white'
              }` }
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-700 font-medium">
                Heure du rappel
              </Text>
              <Text className="text-blue-600 font-semibold text-lg">
                { formatTime( preferences.dailyTime ) }
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Section Autres notifications */ }
        <View className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Autres notifications
          </Text>

          {/* Rappels d'entraînement */ }
          <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <View className="flex-1">
              <Text className="font-medium text-gray-900">
                Rappels d&apos;entraînement
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                Avant vos séances programmées
              </Text>
            </View>
            <Switch
              value={ preferences.workoutReminder }
              onValueChange={ ( value ) => updatePreferences( { workoutReminder: value } ) }
              disabled={ !permissions }
              trackColor={ { false: '#f3f4f6', true: '#3b82f6' } }
              thumbColor={ preferences.workoutReminder ? '#ffffff' : '#9ca3af' }
            />
          </View>

          {/* Mises à jour de progression */ }
          <View className="flex-row justify-between items-center py-3">
            <View className="flex-1">
              <Text className="font-medium text-gray-900">
                Mises à jour de progression
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                Notifications sur vos réalisations
              </Text>
            </View>
            <Switch
              value={ preferences.progressUpdates }
              onValueChange={ ( value ) => updatePreferences( { progressUpdates: value } ) }
              disabled={ !permissions }
              trackColor={ { false: '#f3f4f6', true: '#3b82f6' } }
              thumbColor={ preferences.progressUpdates ? '#ffffff' : '#9ca3af' }
            />
          </View>
        </View>

        {/* Section Test */ }
        <View className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Test
          </Text>
          <TouchableOpacity
            onPress={ handleTestNotification }
            disabled={ !permissions }
            className={ `p-4 rounded-lg ${permissions
                ? 'bg-blue-500'
                : 'bg-gray-300'
              }` }
          >
            <Text className="text-white text-center font-semibold">
              Envoyer une notification test
            </Text>
          </TouchableOpacity>
        </View>

        {/* Informations */ }
        <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <Text className="text-blue-800 font-medium mb-2">
            💡 À savoir
          </Text>
          <Text className="text-blue-700 text-sm leading-5">
            • Les notifications quotidiennes se répètent automatiquement{ '\n' }
            • Vous pouvez changer l&apos;heure à tout moment{ '\n' }
            • Les permissions peuvent être modifiées dans les réglages de votre téléphone
          </Text>
        </View>
      </View>

      {/* DateTimePicker - Affichage conditionnel selon la plateforme */ }
      { showTimePicker && (
        <DateTimePicker
          value={ getInitialTimeForPicker() }
          mode="time"
          is24Hour={ Platform.OS === 'android' }
          display={ Platform.OS === 'ios' ? 'spinner' : 'default' }
          onChange={ ( event, selectedTime ) => {
            if ( Platform.OS === 'android' ) {
              setShowTimePicker( false );
            }
            if ( selectedTime && event.type === 'set' ) {
              handleTimeChange( selectedTime );
            }
            if ( event.type === 'dismissed' ) {
              setShowTimePicker( false );
            }
          } }
        />
      ) }
    </ScrollView>
  );
}