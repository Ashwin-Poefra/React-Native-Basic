import { StyleSheet } from "react-native";
import { Image, type ImageSource } from "expo-image";

type Props = {
  imageSource: ImageSource
}

export default function ImageViewer({ imageSource }: Props) {
  return <Image source={ imageSource } style={ styles.image } />;
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 360,
    borderRadius: 18,
  },
});