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

export default function Categories() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    try {
      const response = await api.get("categories/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
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
  }, []);

  return (
    <View style={styles.container}>
      <ButtonPrimary
        title={"+ Nova Categoria"}
        onPress={() => router.push("/tabs/categories/add")}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#167ec5" />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CategoryItem
              name={item.name}
              onEdit={() => router.push(`/tabs/categories/${item.id}`)}
              onDelete={() => deleteCategory(item.id)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  addButton: {
    backgroundColor: "#167ec5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  item: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    marginTop: 8,
    gap: 16,
  },
  edit: {
    color: "#167ec5",
    fontWeight: "600",
  },
  delete: {
    color: "red",
    fontWeight: "600",
  },
});
