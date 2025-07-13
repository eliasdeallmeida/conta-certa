import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import api from "../../../services/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CategoryItem from "../../../components/CategoryItem";
import ButtonPrimary from "../../../components/ButtonPrimary";
import { Picker } from "@react-native-picker/picker";

export default function Categories() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);

  const fetchCategories = async (pageNum = page, size = pageSize) => {
    setLoading(true);
    const token = await AsyncStorage.getItem("accessToken");
    try {
      const response = await api.get(
        `categories/?page=${pageNum}&page_size=${size}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(response.data.results);
      setTotal(response.data.count);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    const token = await AsyncStorage.getItem("accessToken");
    try {
      await api.delete(`categories/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories(); // Atualiza lista após exclusão
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
      Alert.alert("Erro", "Não foi possível excluir a categoria");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#167ec5" />
      ) : (
        <FlatList
          ListHeaderComponent={
            <View style={{ gap: 10, marginBottom: 16 }}>
              <ButtonPrimary
                title="Nova Categoria"
                onPress={() => router.push("/tabs/categories/add")}
              />

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
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CategoryItem
              name={item.name}
              color={item.color}
              monthlyLimit={
                item.monthly_limit !== null ? Number(item.monthly_limit) : null
              }
              currentSpent={Number(item.current_spent) || 0}
              onEdit={() => router.push(`/tabs/categories/${item.id}`)}
              onDelete={() => deleteCategory(item.id)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 40, color: "#666" }}>
              Nenhuma categoria encontrada.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  pickerGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  picker: {
    width: 100,
    backgroundColor: "#f4f7fa",
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
