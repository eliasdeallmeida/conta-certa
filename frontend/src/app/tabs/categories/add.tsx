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
import InputField from "../../../components/InputField";
import ButtonPrimary from "../../../components/ButtonPrimary";
import ColorPicker from "../../../components/ColorPicker";

export default function AddCategory() {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");
  const [monthlyLimit, setMonthlyLimit] = useState("");
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
      console.error("Erro ao adicionar categoria:", error);
      Alert.alert("Erro", "Não foi possível adicionar a categoria");
    }
  };

  return (
    <View style={styles.container}>
      <InputField
        label="Nome da Categoria"
        value={name}
        onChangeText={setName}
        placeholder="Ex: Alimentação"
      />
      <InputField
        label="Meta de gasto mensal (opcional)"
        value={monthlyLimit}
        onChangeText={setMonthlyLimit}
        placeholder="Ex: 500.00"
        keyboardType="default"
      />
      <ColorPicker value={color} onChange={setColor} />
      <ButtonPrimary title="Adicionar" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
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
