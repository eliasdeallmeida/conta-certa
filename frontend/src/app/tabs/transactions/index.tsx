import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../../services/axios";
import { router } from "expo-router";

interface Transaction {
  id: number;
  description: string;
  value: number;
  transaction_type: string;
  date: string;
  category: number | null; // ID da categoria
  category_name?: string; // Nome da categoria (read-only no serializer)
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const typeMap: { [key: string]: string } = {
    expense: "Despesa",
    income: "Receita",
  };

  const fetchTransactions = async () => {
    try {
      const response = await api.get("transactions/");
      setTransactions(response.data);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
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
    fetchTransactions();
  }, []);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Transações</Text> */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/tabs/transactions/add")}
      >
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.addText}>Nova Transação</Text>
      </TouchableOpacity>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.description}</Text>
              <Text style={styles.details}>R$ {item.value}</Text>
              <Text style={styles.details}>
                {typeMap[item.transaction_type] || item.transaction_type}
              </Text>
              <Text style={styles.details}>
                {new Date(item.date).toLocaleDateString("pt-BR")}
              </Text>
              {/* {item.category ? (
                <Text style={styles.details}>{item.category}</Text>
              ) : (
                <Text style={styles.details}>Sem categoria</Text>
              )} */}
              <Text style={styles.details}>
                Categoria: {item.category_name || "Nenhuma"}
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => router.push(`/tabs/transactions/${item.id}`)}
              >
                <Ionicons name="pencil" size={20} color="#167ec5" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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
