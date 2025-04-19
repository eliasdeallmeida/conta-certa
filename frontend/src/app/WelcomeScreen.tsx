import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/conta-certa-logo.png')} // certifique-se que essa imagem exista!
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Bem-vindo ao Conta Certa!</Text>
      <Text style={styles.subtitle}>Gerencie suas contas com facilidade e segurança.</Text>

      <TouchableOpacity style={styles.buttonPrimary} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonTextLogin}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.buttonTextRegister}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  image: { width: 150, height: 150, marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 32 },
  buttonPrimary: {
    backgroundColor: '#007bff',
    padding: 14,
    // paddingHorizontal: 60,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
    width: '100%',
  },
  buttonSecondary: {
    // backgroundColor: '#28a745',
    backgroundColor: '#fff',
    padding: 14,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonTextLogin: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  buttonTextRegister: { color: '#007bff', fontSize: 16, fontWeight: 'bold' },
});
