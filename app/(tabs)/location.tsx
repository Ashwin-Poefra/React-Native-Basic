import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

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

      const subscription = await Location.watchPositionAsync({
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLocation) => {
          setLocation(newLocation)
        }
      );

      return () => subscription.remove();
    })();
  }, []);
  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          region={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title={"You're here!"}
          />
        </MapView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});