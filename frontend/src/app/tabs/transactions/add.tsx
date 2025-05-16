import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../services/axios";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddTransaction() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [transactionType, setTransactionType] = useState("expense");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [categories, setCategories] = useState([]);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      try {
        const response = await api.get("categories/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (!description || !value || !transactionType) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios");
      return;
    }

    const token = await AsyncStorage.getItem("accessToken");

    try {
      await api.post(
        "transactions/",
        {
          description,
          value: parseFloat(value.replace(/[^\d,]/g, "").replace(",", ".")),
          date: date.toISOString().split("T")[0],
          transaction_type: transactionType,
          category: categoryId || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      router.push("/tabs/transactions");
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);

      if (error.response) {
        console.log("Dados retornados:", error.response.data);
        Alert.alert("Erro", JSON.stringify(error.response.data));
      } else {
        Alert.alert("Erro", "Não foi possível adicionar a transação");
      }
    }
  };

  function formatDateToDisplay(date: string | Date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Nova Transação</Text> */}

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Ex: Mercado"
      />

      <Text style={styles.label}>Valor</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(text) => {
          const clean = text.replace(/[^\d]/g, "");
          const formatted = (Number(clean) / 100).toFixed(2).replace(".", ",");
          setValue(`R$ ${formatted}`);
        }}
        placeholder="Ex: R$ 500,00"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Data</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateInput}
      >
        {/* <Text>{date.toISOString().split("T")[0]}</Text> */}
        <Text>{formatDateToDisplay(date)}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Tipo</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={transactionType}
          onValueChange={(itemValue) => setTransactionType(itemValue)}
        >
          <Picker.Item label="Despesa" value="expense" />
          <Picker.Item label="Receita" value="income" />
        </Picker>
      </View>

      <Text style={styles.label}>Categoria (opcional)</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={categoryId}
          onValueChange={(itemValue) => setCategoryId(itemValue)}
        >
          <Picker.Item label="Nenhuma" value={undefined} />
          {categories.map((category: any) => (
            <Picker.Item
              key={category.id}
              label={category.name}
              value={category.id}
            />
          ))}
        </Picker>
      </View>

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Adicionar Transação</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
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
  dateInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
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
