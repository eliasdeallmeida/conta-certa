import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../services/axios";

export default function EditCategory() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      try {
        const response = await api.get(`categories/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(response.data.name);
      } catch (error) {
        console.error("Erro ao buscar categoria:", error);
        Alert.alert("Erro", "Categoria não encontrada");
        router.back();
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async () => {
    if (!name) {
      Alert.alert("Erro", "Informe o nome da categoria");
      return;
    }

    const token = await AsyncStorage.getItem("accessToken");
    try {
      await api.put(
        `categories/${id}/`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push("/tabs/categories");
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      Alert.alert("Erro", "Não foi possível atualizar");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Editar Categoria</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nome da categoria"
      />
      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
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
