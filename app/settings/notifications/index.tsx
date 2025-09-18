// app/settings/notifications/index.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Switch,
  Alert,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput
} from 'react-native';
import { useNotificationStore } from '@/store/notification.store';
import CustomButton from '@/components/CustomButton';

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
  const [ tempHour, setTempHour ] = useState( '18' );
  const [ tempMinute, setTempMinute ] = useState( '00' );

  useEffect( () => {
    if ( !permissions ) {
      requestPermissions();
    }

    // Initialiser les valeurs temporaires avec l'heure actuelle
    const [ hours, minutes ] = preferences.dailyTime.split( ':' );
    setTempHour( hours );
    setTempMinute( minutes );
  }, [ permissions, requestPermissions, preferences.dailyTime ] );

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

  const handleTimeConfirm = () => {
    const hour = parseInt( tempHour );
    const minute = parseInt( tempMinute );

    if ( hour < 0 || hour > 23 || minute < 0 || minute > 59 ) {
      Alert.alert( 'Erreur', 'Veuillez entrer une heure valide (00:00 - 23:59)' );
      return;
    }

    const timeString = `${hour.toString().padStart( 2, '0' )}:${minute.toString().padStart( 2, '0' )}`;
    updateDailyNotification( preferences.dailyReminder, timeString );
    setShowTimePicker( false );
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

  if ( isLoading ) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg">Chargement des paramètres...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        {/* Status des permissions */ }
        <View className="border border-primary-50 p-4 rounded-md mb-6">
          <Text className="title-4 mb-2">
            État des notifications
          </Text>
          <View className="flex-row items-center">
            <Text className={ `indicator-text ${permissions ? 'text-green' : 'text-red-600'}` }>
              { permissions ? 'Autorisées' : 'Non autorisées' }
            </Text>
          </View>

          { !permissions && (
            <CustomButton title='Autoriser les notifications' onPress={ handlePermissionRequest } customStyles='mt-3' />
          ) }
        </View>

        <Text className="title-2 mb-4">
          Paramètres de notifications
        </Text>

        {/* Section Rappel quotidien */ }
        <View className="border border-primary-50 px-4 py-6 rounded-md mb-6">
          <View className="flex-row justify-between items-end mb-3">
            <View className="flex-1">
              <Text className="title-4">
                Rappel quotidien
              </Text>
              <Text className="text-md text-primary-100 mt-1">
                Notification quotidienne pour votre entraînement
              </Text>
            </View>
            <Switch
              value={ preferences.dailyReminder }
              onValueChange={ handleDailyReminderToggle }
              disabled={ !permissions }
              trackColor={ { false: '#f3f4f6', true: '#FC7942' } }
              thumbColor={ preferences.dailyReminder ? '#ffffff' : '#9ca3af' }
            />
          </View>

          {/* Sélecteur d'heure */ }
          <TouchableOpacity
            onPress={ () => setShowTimePicker( true ) }
            disabled={ !permissions || !preferences.dailyReminder }
            className={ `border border-primary-50 p-4 rounded-md ${!permissions || !preferences.dailyReminder
              ? 'bg-primary-100 opacity-50'
              : 'bg-background'
              }` }
          >
            <View className="flex-row justify-between items-center">
              <Text className="title-4">
                Heure du rappel
              </Text>
              <Text className="text-secondary text">
                { preferences.dailyTime }
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Section Rappel entrainement programmé */ }
        {/* <View className="border border-primary-50 px-4 py-6 rounded-md mb-6">
          <View className="flex-row justify-between items-end">
            <View className="flex-1">
              <Text className="title-4">
                Rappels d&apos;entraînement
              </Text>
              <Text className="text-md text-primary-100 mt-1">
                Avant vos séances programmées
              </Text>
            </View>
            <Switch
              value={ preferences.workoutReminder }
              onValueChange={ ( value ) => updatePreferences( { workoutReminder: value } ) }
              disabled={ !permissions }
              trackColor={ { false: '#f3f4f6', true: '#FC7942' } }
              thumbColor={ preferences.workoutReminder ? '#ffffff' : '#9ca3af' }
            />
          </View>
        </View> */}

        {/* Section Test */ }
        <View className="border border-primary-50 px-4 py-6 rounded-md mb-6">
          <Text className="title-4 mb-3">
            Test notification
          </Text>
          <CustomButton title='Envoyer une notification test' onPress={ handleTestNotification } isLoading={ !permissions } customStyles={ `p-4 rounded-lg ${permissions
            ? 'bg-blue-500'
            : 'bg-gray-300'
            }` } />
        </View>
      </View>

      {/* Modal Time Picker Custom */ }
      <Modal
        animationType="slide"
        transparent={ true }
        visible={ showTimePicker }
        onRequestClose={ () => setShowTimePicker( false ) }
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-background w-[80%] p-5 rounded-xl">
            <Text className="title-3 text-center mb-3">
              Choisir l&apos;heure
            </Text>

            <View className="flex-row justify-center items-center mb-6">
              <View className="items-center">
                <Text className="indicator-text">Heure</Text>
                <TextInput
                  value={ tempHour }
                  onChangeText={ setTempHour }
                  keyboardType="numeric"
                  maxLength={ 2 }
                  className="text-xl font-bold text-center border border-primary-100 rounded-md w-16"
                />
              </View>

              <Text className="text-3xl font-bold mx-4">:</Text>

              <View className="items-center">
                <Text className="indicator-text">Minutes</Text>
                <TextInput
                  value={ tempMinute }
                  onChangeText={ setTempMinute }
                  keyboardType="numeric"
                  maxLength={ 2 }
                  className="text-xl font-bold text-center border border-primary-100 rounded-md w-16"
                />
              </View>
            </View>

            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={ () => setShowTimePicker( false ) }
                className="bg-gray-300 px-6 py-3 rounded-lg flex-1 mr-2"
              >
                <Text className="text-center font-medium">Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={ handleTimeConfirm }
                className="bg-blue-500 px-6 py-3 rounded-lg flex-1 ml-2"
              >
                <Text className="text-white text-center font-medium">Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}