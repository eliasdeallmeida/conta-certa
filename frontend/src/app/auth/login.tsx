import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { goToRegister, replaceToHome } from "../utils/navigation";
import api from "../../services/axios";
import ButtonPrimary from "../../components/ButtonPrimary";
import InputField from "../../components/InputField";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      const response = await api.post("/token", { email, password: password });
      await AsyncStorage.setItem("accessToken", response.data.access);
      await AsyncStorage.setItem("refreshToken", response.data.refresh);
      replaceToHome();
    } catch (error) {
      console.error("Erro ao logar:", error);
      Alert.alert("Erro", "Email ou senha inválidos");
    }
  };

  return (
    <View>
      <Text style={styles.title}>Login</Text>
      <InputField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Informe seu email"
        keyboardType="email-address"
      />
      <InputField
        label="Senha"
        value={password}
        onChangeText={setPassword}
        placeholder="Informe sua senha"
        secureTextEntry
      />
      <ButtonPrimary title="Entrar" onPress={handleLogin} />
      <TouchableOpacity onPress={goToRegister}>
        <Text style={styles.link}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  link: {
    textAlign: "center",
    color: "#167ec5",
    fontSize: 16,
  },
});
