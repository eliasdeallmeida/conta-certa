import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../../services/axios";
import { router } from "expo-router";
import TransactionItem from "../../../components/TransactionItem";
import ButtonPrimary from "../../../components/ButtonPrimary";
import { Picker } from "@react-native-picker/picker";

interface Transaction {
  id: number;
  description: string;
  value: number;
  transaction_type: string;
  date: string;
  category: number | null; // ID da categoria
  category_name?: string; // Nome da categoria (read-only no serializer)
  category_color?: string; // Cor da categoria
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("categories/?page_size=100");

      const results = Array.isArray(response.data.results)
        ? response.data.results
        : [];

      setCategories(results);
      console.log("Categorias carregadas:", results);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      setCategories([]); // evita .map quebrar
    }
  };

  const fetchTransactions = async (pageNum = page, size = pageSize) => {
    setLoading(true);
    let url = `transactions/?page=${pageNum}&page_size=${size}`;
    if (typeFilter) url += `&tipo=${typeFilter}`;
    if (categoryFilter) url += `&categoria=${categoryFilter}`;
    if (dateFilter) url += `&data=${dateFilter}`;
    try {
      const response = await api.get(url);
      setTransactions(response.data.results);
      setTotal(response.data.count);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert("Confirmação", "Deseja excluir esta transação?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`transactions/${id}/`);
            fetchTransactions(); // Atualiza lista
          } catch (error) {
            console.error("Erro ao excluir:", error);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    fetchTransactions();
  }, [page, pageSize, typeFilter, categoryFilter, dateFilter]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Transações</Text> */}
      <ButtonPrimary
        title="Nova Transação"
        onPress={() => router.push("/tabs/transactions/add")}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <Text style={{ marginRight: 8 }}>Itens por página:</Text>
        <Picker
          selectedValue={pageSize}
          style={{ width: 100 }}
          onValueChange={(v) => {
            setPageSize(v);
            setPage(1);
          }}
        >
          {[10, 20, 50, 100].map((n) => (
            <Picker.Item key={n} label={String(n)} value={n} />
          ))}
        </Picker>
        <Text style={{ marginLeft: 16 }}>
          Página: {page} / {totalPages || 1}
        </Text>
        <TouchableOpacity
          disabled={page <= 1}
          onPress={() => setPage(page - 1)}
          style={{ marginLeft: 8, opacity: page <= 1 ? 0.5 : 1 }}
        >
          <Text>{"<"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={page >= totalPages}
          onPress={() => setPage(page + 1)}
          style={{ marginLeft: 4, opacity: page >= totalPages ? 0.5 : 1 }}
        >
          <Text>{">"}</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <Text style={{ marginRight: 8 }}>Tipo:</Text>
        <Picker
          selectedValue={typeFilter}
          style={{ width: 120 }}
          onValueChange={(v) => {
            setTypeFilter(v);
            setPage(1);
          }}
        >
          <Picker.Item label="Todos" value="" />
          <Picker.Item label="Despesa" value="expense" />
          <Picker.Item label="Receita" value="income" />
        </Picker>
        <Text style={{ marginLeft: 16 }}>Categoria:</Text>
        <Picker
          selectedValue={categoryFilter}
          style={{ width: 140 }}
          onValueChange={(v) => {
            setCategoryFilter(v);
            setPage(1);
          }}
        >
          <Picker.Item label="Todas" value="" />
          {Array.isArray(categories) &&
            categories.length > 0 &&
            categories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
            ))}
        </Picker>
        <Text style={{ marginLeft: 16 }}>Data:</Text>
        <TextInput
          style={{
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            padding: 8,
            width: 110,
            marginLeft: 4,
          }}
          value={dateFilter}
          onChangeText={(v) => {
            setDateFilter(v);
            setPage(1);
          }}
          placeholder="YYYY-MM-DD"
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#167ec5" />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TransactionItem
              description={item.description}
              value={`R$ ${item.value}`}
              type={item.transaction_type === "expense" ? "Despesa" : "Receita"}
              date={new Date(item.date).toLocaleDateString("pt-BR")}
              category={item.category_name || "Nenhuma"}
              categoryColor={item.category_color}
              onEdit={() => router.push(`/tabs/transactions/${item.id}`)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#167ec5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 1,
  },
  itemTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  details: {
    color: "#555",
    marginTop: 2,
  },
  actions: {
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 12,
  },
});
