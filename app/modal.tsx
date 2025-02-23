import { Button, StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import { importMockData } from '@/components/storageHandler';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Button title='Import Mock Data' onPress={() => importMockData()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
