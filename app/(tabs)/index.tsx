import { View, StyleSheet, Platform } from 'react-native';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import * as ImagePickier from 'expo-image-picker';
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
      alert('You did not select any image.');
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
  };

  const onShare = async () => {
    try {
      const message = "Hi, this is the photo of Vervesoft's office";
      const link = "https://vervesoft.io/";
      const dataUrl = await domtoimage.toJpeg(imageRef.current, {
        quality: 0.95,
        width: 320,
        height: 440,
      });

      const shareOptions = {
        message: `${message}\n${link}`
      };

      try {
        RNFS.downloadFile({
          fromUrl: dataUrl,
          toFile: `${RNFS.CachesDirectoryPath}/image.png`,
        })
          .promise.then(() => {
            RNFS.readFile(`${RNFS.CachesDirectoryPath}/image.png`, 'base64')
            .then(res => {
              shareOptions.url = `data:image/png;base64,${res}`;

              Share.shareSingle({
                ...shareOptions,
                social: Share.Social.WHATSAPP,
              });
            })
            .catch(e => {
              console.log(e);
            })
          })
      } catch (e) {
        console.log(e);
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
  
        if(localUri) {
          alert('Saved successfully!');
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
      <View style={ styles.container }>
        <View style={ styles.imageContainer }>
          <View ref={imageRef} collapsable={false}>
            <ImageViewer imgSource={ PlaceholderImage } selectedImage={selectedImage} />
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
                  <IconButton icon="refresh" label="Reset" onPress={onReset} />
                  <IconButton icon="share" label="Share" onPress={onShare} />
                  <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
                </View>
              </View>
            </View>
          ) : (
          <View style={ styles.footerContainer }>
            <Button theme='primary' label='Choose a photo' onPress={pickImageAsync} />
            <Button label='Use this photo' onPress={() => setShowAppOptions(true)} />
          </View>
          )
        }
        <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
          <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
        </EmojiPicker>
      </View>
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