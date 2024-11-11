import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

export default function LocatinoScreen() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: 'Warn',
          textBody: 'Permission to access location was denied!',
        });
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);
  return (
    <View>
      <Text>
        Location: {location ? JSON.stringify(location) : 'Fetching location...'}
      </Text>
    </View>
  )
}