import React from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import Logo from "../components/Logo";
import ButtonPrimary from "../components/ButtonPrimary";
import ButtonSecondary from "../components/ButtonSecondary";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Logo />
      <Text style={styles.title}>Bem-vindo ao Conta Certa</Text>
      <Text style={styles.subtitle}>
        Gerencie suas finanças de forma simples
      </Text>
      <ButtonPrimary
        title="Entrar"
        onPress={() => router.push("/auth/login")}
      />
      <ButtonSecondary
        title="Criar conta"
        onPress={() => router.push("/auth/register")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    color: "#555",
  },
});
