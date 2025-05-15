import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import Logo from "../../components/Logo";
import InputField from "../../components/InputField";
import ButtonPrimary from "../../components/ButtonPrimary";
import axios from "axios";

export default function Register() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const handleCadastro = async () => {
    if (!nome || !usuario || !email || !senha || !confirmarSenha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }
    try {
      await axios.post("http://192.168.100.26:8000/api/user/register", {
        name: nome,
        username: usuario,
        email: email,
        password: senha,
        confirm_password: confirmarSenha,
      });
      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      router.replace("/auth/login");
    } catch (error) {
      console.error("Erro no cadastro:", error);
      Alert.alert(
        "Erro",
        "Não foi possível cadastrar. Verifique os dados e tente novamente."
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Logo />
      <Text style={styles.title}>Cadastro</Text>
      <InputField
        label="Nome"
        value={nome}
        onChangeText={setNome}
        placeholder="Informe seu nome completo"
      />
      <InputField
        label="Usuário"
        value={usuario}
        onChangeText={setUsuario}
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
        value={senha}
        onChangeText={setSenha}
        placeholder="Informe sua senha"
        secureTextEntry
      />
      <InputField
        label="Confirmar Senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        placeholder="Informe novamente sua senha"
        secureTextEntry
      />
      <ButtonPrimary title="Cadastrar" onPress={handleCadastro} />
      <TouchableOpacity onPress={() => router.push("/auth/login")}>
        <Text style={styles.link}>Já tem uma conta? Efetue login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
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
