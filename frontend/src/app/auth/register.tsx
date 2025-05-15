import { useState } from "react";
import { Text, StyleSheet, Alert, View, TouchableOpacity } from "react-native";
import { goToLogin, replaceToLogin } from "../utils/navigation";
import InputField from "../../components/InputField";
import ButtonPrimary from "../../components/ButtonPrimary";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !username || !email || !password || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }
    try {
      await axios.post("http://192.168.100.26:8000/api/user/register", {
        name: name,
        username: username,
        email: email,
        password: password,
        confirm_password: confirmPassword,
      });
      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      replaceToLogin();
    } catch (error) {
      console.error("Erro no cadastro:", error);
      Alert.alert(
        "Erro",
        "Não foi possível cadastrar. Verifique os dados e tente novamente."
      );
    }
  };

  return (
    <View>
      <Text style={styles.title}>Cadastro</Text>
      <InputField
        label="Nome"
        value={name}
        onChangeText={setName}
        placeholder="Informe seu nome completo"
      />
      <InputField
        label="Usuário"
        value={username}
        onChangeText={setUsername}
        placeholder="Informe seu nome de usuário"
      />
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
      <InputField
        label="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Informe novamente sua senha"
        secureTextEntry
      />
      <ButtonPrimary title="Cadastrar" onPress={handleRegister} />
      <TouchableOpacity onPress={goToLogin}>
        <Text style={styles.link}>Já tem uma conta? Efetue login</Text>
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
