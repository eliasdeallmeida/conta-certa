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
import InputField from "../../../components/InputField";
import ButtonPrimary from "../../../components/ButtonPrimary";
import ColorPicker from "../../../components/ColorPicker";

export default function EditCategory() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");
  const [monthlyLimit, setMonthlyLimit] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      try {
        const response = await api.get(`categories/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(response.data.name);
        setColor(response.data.color);
        setMonthlyLimit(
          response.data.monthly_limit ? String(response.data.monthly_limit) : ""
        );
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
        {
          name,
          color,
          monthly_limit: monthlyLimit
            ? parseFloat(monthlyLimit.replace(",", "."))
            : null,
        },
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
      <InputField
        label="Nome da categoria"
        value={name}
        onChangeText={setName}
        placeholder="Nome da categoria"
      />
      <InputField
        label="Meta de gasto mensal (opcional)"
        value={monthlyLimit}
        onChangeText={setMonthlyLimit}
        placeholder="Ex: 500.00"
        keyboardType="default"
      />
      <ColorPicker value={color} onChange={setColor} />
      <ButtonPrimary title="Salvar" onPress={handleSubmit} />
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
