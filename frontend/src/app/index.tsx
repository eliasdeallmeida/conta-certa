import { View, Text, StyleSheet, StatusBar } from "react-native";
import { goToLogin, goToRegister } from "../utils/navigation";
import Logo from "../components/Logo";
import ButtonPrimary from "../components/ButtonPrimary";
import ButtonSecondary from "../components/ButtonSecondary";

export default function Index() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Logo />
      <Text style={styles.title}>Bem-vindo ao Conta Certa</Text>
      <Text style={styles.subtitle}>
        Gerencie suas finanças de forma simples
      </Text>
      <ButtonPrimary title="Entrar" onPress={goToLogin} />
      <ButtonSecondary title="Criar conta" onPress={goToRegister} />
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
