import { View, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Props = {
  onPress: () => void;
}

export default function CircleButton({ onPress }: Props) {
  return (
    <View style={styles.circleButtonContainer}>
      <Pressable style={styles.circleButton} onPress={onPress}>
        <MaterialIcons name='add' size={32} color="#25292e" />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  circleButtonContainer: {
    width: 300,
    height: 50,
    marginHorizontal: 60,
    borderWidth: 4,
    borderColor: '#ffd33d',
    borderRadius: 10,
    padding: 3,
  },
  circleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#fff',
  }
});