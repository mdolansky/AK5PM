import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { storeTransaction } from '@/components/storageHandler';

export default function AddTransactionModal() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async () => {
    await storeTransaction({
      name: name,
      category: category,
      price: Number(price) || 0,
      date: new Date(),
    });

    // Zpět na předchozí obrazovku
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Přidat transakci</Text>

      <TextInput
        style={styles.input}
        placeholder="Název"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Kategorie"
        placeholderTextColor="#888"
        value={category}
        onChangeText={setCategory}
      />

      <TextInput
        style={styles.input}
        placeholder="Cena"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Zrušit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Uložit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 24,
  },
  button: {
    backgroundColor: '#007EA7',
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: '#007EA7',
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#007EA7',
    fontSize: 16,
    fontWeight: '600',
  },
});
