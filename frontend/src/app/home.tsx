import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { replaceToLogin } from "./utils/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const handleLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    replaceToLogin();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Text style={styles.title}>Bem-vindo à tela inicial!</Text>
      <TouchableOpacity onPress={handleLogout} style={styles.logout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logout: {
    marginTop: 20,
    padding: 12,
  },
  logoutText: {
    color: "#007bff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
