import { View, StyleSheet, Platform } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as ImagePickier from 'expo-image-picker';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import { type ImageSource } from 'expo-image';
import domtoimage from 'dom-to-image';

import Button from '@/components/Button';
import ImageViewer from '../../components/ImageViewer';
import IconButton from '@/components/IconButton';
import CircleButton from '@/components/CircleButton';
import EmojiPicker from '@/components/EmojiPicker';
import EmojiList from '@/components/EmojiList';
import EmojiSticker from '@/components/EmojiSticker';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pickedEmoji, setPickedEmoji] = useState<ImageSource | undefined>(undefined);

  const imageRef = useRef<View>(null);

  const [status, requestPermission] = MediaLibrary.usePermissions();

  if (status === null) {
    requestPermission();
  }

  const pickImageAsync = async () => {
    let result = await ImagePickier.launchImageLibraryAsync({
      mediaTypes: ImagePickier.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'No Image Selected',
        button: 'Close'
      });
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
  };

  const onShare = async () => {
    try {
      const uri = await captureRef(imageRef, {
        format: 'png',
        quality: 0.8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: "Share Image",
        });
      } else {
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: 'Not supported content',
          textBody: 'Sharing is not available on this platform.',
          button: 'Close'
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onSaveImageAsync = async () => {
    if (Platform.OS !== 'web') {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        });

        await MediaLibrary.saveToLibraryAsync(localUri);

        if (localUri) {
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Congratulations',
            textBody: 'Saved successfully!',
          });
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const dataUrl = await domtoimage.toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        });

        let link = document.createElement('a');
        link.download = 'sticker-smash.jpeg';
        link.href = dataUrl;
        link.click();
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <AlertNotificationRoot>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <View ref={imageRef} collapsable={false}>
              <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
              {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
            </View>
          </View>
          {
            showAppOptions ? (
              <View style={styles.optionsContainer}>
                <View style={styles.optionsColumn}>
                  <View>
                    <CircleButton onPress={onAddSticker} />
                  </View>
                  <View style={styles.optionsRow}>
                    <IconButton icon="arrow-back" label="Back" onPress={onReset} />
                    <IconButton icon="share" label="Share" onPress={onShare} />
                    <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.footerContainer}>
                <Button theme='primary' label='Choose a photo' onPress={pickImageAsync} />
                <Button label='Use this photo' onPress={() => setShowAppOptions(true)} />
              </View>
            )
          }
          <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
            <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
          </EmojiPicker>
        </View>
      </AlertNotificationRoot>
    </GestureHandlerRootView>
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
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 10,
  },
  optionsColumn: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    gap: 10
  },
  optionsRow: {
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
});