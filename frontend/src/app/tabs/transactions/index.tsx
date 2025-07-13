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
  Platform,
  Modal,
} from "react-native";
import api from "../../../services/axios";
import { router } from "expo-router";
import TransactionItem from "../../../components/TransactionItem";
import ButtonPrimary from "../../../components/ButtonPrimary";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

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
      <FlatList
        ListHeaderComponent={
          <View style={{ marginBottom: 16 }}>
            <ButtonPrimary
              title="Nova Transação"
              onPress={() => router.push("/tabs/transactions/add")}
              // style={{ marginBottom: 16 }}
            />

            <ButtonPrimary
              title="Filtrar"
              onPress={() => setFilterVisible(true)}
              // style={{ marginBottom: 16 }}
            />

            <Modal
              visible={filterVisible}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setFilterVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Filtros</Text>

                  <Text style={styles.filterLabel}>Tipo:</Text>
                  <Picker
                    selectedValue={typeFilter}
                    onValueChange={(v) => {
                      setTypeFilter(v);
                    }}
                  >
                    <Picker.Item label="Todos" value="" />
                    <Picker.Item label="Despesa" value="expense" />
                    <Picker.Item label="Receita" value="income" />
                  </Picker>

                  <Text style={styles.filterLabel}>Categoria:</Text>
                  <Picker
                    selectedValue={categoryFilter}
                    onValueChange={(v) => {
                      setCategoryFilter(v);
                    }}
                  >
                    <Picker.Item label="Todas" value="" />
                    {categories.map((cat) => (
                      <Picker.Item
                        key={cat.id}
                        label={cat.name}
                        value={cat.id}
                      />
                    ))}
                  </Picker>

                  <Text style={styles.filterLabel}>Data:</Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={styles.dateInput}
                  >
                    <Text>
                      {selectedDate
                        ? selectedDate.toLocaleDateString("pt-BR")
                        : "Selecionar data"}
                    </Text>
                  </TouchableOpacity>

                  {showDatePicker && (
                    <DateTimePicker
                      value={selectedDate || new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(event, date) => {
                        setShowDatePicker(false);
                        if (event.type === "set" && date) {
                          setSelectedDate(date);
                          setDateFilter(date.toISOString().split("T")[0]);
                        }
                      }}
                    />
                  )}

                  <View style={styles.modalButtons}>
                    <ButtonPrimary
                      title="Aplicar"
                      onPress={() => {
                        setFilterVisible(false);
                        setPage(1);
                        fetchTransactions(1);
                      }}
                    />

                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={() => {
                        setTypeFilter("");
                        setCategoryFilter("");
                        setDateFilter("");
                        setSelectedDate(null);
                        setFilterVisible(false);
                        setPage(1);
                        fetchTransactions(1);
                      }}
                    >
                      <Text style={styles.buttonText}>Limpar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <View style={styles.pagination}>
              <View style={styles.pickerGroup}>
                <Text style={styles.label}>Itens por página:</Text>
                <Picker
                  selectedValue={pageSize}
                  style={styles.picker}
                  onValueChange={(v) => {
                    setPageSize(v);
                    setPage(1);
                  }}
                >
                  {[10, 20, 50, 100].map((n) => (
                    <Picker.Item key={n} label={String(n)} value={n} />
                  ))}
                </Picker>
              </View>

              <View style={styles.pageControls}>
                <Text style={styles.label}>
                  Página {page} de {totalPages || 1}
                </Text>
                <View style={{ flexDirection: "row", gap: 8, marginLeft: 8 }}>
                  <TouchableOpacity
                    disabled={page <= 1}
                    onPress={() => setPage(page - 1)}
                    style={[styles.pageButton, page <= 1 && { opacity: 0.5 }]}
                  >
                    <Text style={styles.pageButtonText}>{"<"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={page >= totalPages}
                    onPress={() => setPage(page + 1)}
                    style={[
                      styles.pageButton,
                      page >= totalPages && { opacity: 0.5 },
                    ]}
                  >
                    <Text style={styles.pageButtonText}>{">"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        }
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
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#167ec5" />
          ) : (
            <Text style={{ textAlign: "center", marginTop: 40, color: "#666" }}>
              Nenhuma transação encontrada.
            </Text>
          )
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
  actions: {
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 12,
  },
  filterGroup: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#f4f7fa",
    borderRadius: 10,
    elevation: 1,
  },
  filterLabel: {
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 4,
    color: "#333",
  },
  // picker: {
  //   backgroundColor: "#fff",
  //   borderRadius: 8,
  //   marginBottom: 8,
  //   elevation: 1,
  // },
  picker: {
    width: 100,
    height: 50,
    padding: 0,
    backgroundColor: "#f4f7fa",
  },
  pickerGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  dateInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // escurece fundo
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    elevation: 10,
    gap: 10, // adiciona espaçamento entre elementos
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#167ec5",
  },
  modalButtons: {
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 20,
  },
  clearButton: {
    // flex: 1,
    backgroundColor: "#e53935",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#167ec5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  label: {
    fontWeight: "600",
    color: "#333",
  },
  pageControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  pageButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#167ec5",
    borderRadius: 4,
  },
  pageButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
