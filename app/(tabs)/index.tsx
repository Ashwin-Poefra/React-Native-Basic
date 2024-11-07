import { View, StyleSheet } from 'react-native';

import ImageViewer from '../../components/ImageViewer';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  return (
    <View style={ styles.container }>
      <View style={ styles.imageContainer }>
        <ImageViewer imageSource={ PlaceholderImage } />
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
  }
});