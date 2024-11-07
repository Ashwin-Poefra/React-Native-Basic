import { View, StyleSheet } from 'react-native';
import * as ImagePickier from 'expo-image-picker';

import Button from '@/components/Button';
import ImageViewer from '../../components/ImageViewer';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  const pickImageAsync = async () => {
    let result = await ImagePickier.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
    } else {
      alert('You did not select any image.');
    }
  };

  return (
    <View style={ styles.container }>
      <View style={ styles.imageContainer }>
        <ImageViewer imageSource={ PlaceholderImage } />
      </View>
      <View style={ styles.footerContainer }>
        <Button theme='primary' label='Choose a photo' />
        <Button label='Use this photo' />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  }
});