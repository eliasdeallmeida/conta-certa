import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../services/axios";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import InputField from "../../../components/InputField";
import ButtonPrimary from "../../../components/ButtonPrimary";

export default function EditTransaction() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem("accessToken");

      try {
        const [txRes, catRes] = await Promise.all([
          api.get(`transactions/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("categories/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const tx = txRes.data;
        setDescription(tx.description);
        setValue(`R$ ${parseFloat(tx.value).toFixed(2).replace(".", ",")}`);
        setDate(new Date(tx.date));
        setTransactionType(tx.transaction_type);
        setCategoryId(tx.category);
        // const categoryFromAPI = tx.category;
        // const matchedCategory = catRes.data.find(
        //   (cat: any) => cat.name === categoryFromAPI
        // );
        // setCategoryId(matchedCategory?.id);
        setCategories(catRes.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error.response?.data || error);
        Alert.alert("Erro", "Erro ao carregar dados da transação.");
        router.replace("/tabs/transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    if (!description || !value || !transactionType) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    const token = await AsyncStorage.getItem("accessToken");

    try {
      await api.put(
        `transactions/${id}/`,
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

      Alert.alert("Sucesso", "Transação atualizada com sucesso!");
      router.replace("/tabs/transactions");
    } catch (error) {
      console.error("Erro ao atualizar:", error.response?.data || error);
      Alert.alert("Erro", "Erro ao atualizar a transação.");
    }
  };

  function formatDateToDisplay(date: string | Date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#167ec5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Editar Transação</Text> */}

      <InputField
        label="Descrição"
        value={description}
        onChangeText={setDescription}
        placeholder="Descrição"
      />

      <InputField
        label="Valor"
        value={value}
        onChangeText={(text) => {
          const clean = text.replace(/[^\d]/g, "");
          const formatted = (Number(clean) / 100).toFixed(2).replace(".", ",");
          setValue(`R$ ${formatted}`);
        }}
        placeholder="Ex: R$ 500,00"
        keyboardType="default"
      />

      <Text style={styles.label}>Data</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateInput}
      >
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

      <Text style={styles.label}>Categoria</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={categoryId}
          onValueChange={(itemValue) => setCategoryId(itemValue)}
        >
          <Picker.Item label="Nenhuma" value={undefined} />
          {categories.map((cat: any) => (
            <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
          ))}
        </Picker>
      </View>

      <ButtonPrimary title="Salvar Alterações" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
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
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
