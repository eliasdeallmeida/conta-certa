import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../services/axios";

export default function AddCategory() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!name) {
      Alert.alert("Erro", "Informe o nome da categoria");
      return;
    }

    const token = await AsyncStorage.getItem("accessToken");
    try {
      await api.post(
        "categories/",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push("/tabs/categories");
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
      Alert.alert("Erro", "Não foi possível adicionar a categoria");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome da Categoria</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ex: Alimentação"
      />
      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#167ec5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
