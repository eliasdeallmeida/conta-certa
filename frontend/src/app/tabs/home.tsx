import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import api from "../../services/axios";

interface Summary {
  total_income: number;
  total_expense: number;
  balance: number;
  by_category: {
    name: string;
    total: number;
    color?: string;
  }[];
}

export default function Home() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      const response = await api.get("transactions/summary/");
      setSummary(response.data);
    } catch (error) {
      console.error("Erro ao carregar resumo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#167ec5" />
      </View>
    );
  }

  if (!summary) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>
          Não foi possível carregar o relatório.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Relatório Financeiro</Text>

      <View style={styles.summaryBox}>
        <Text style={styles.label}>Receitas:</Text>
        <Text style={styles.income}>R$ {summary.total_income.toFixed(2)}</Text>

        <Text style={styles.label}>Despesas:</Text>
        <Text style={styles.expense}>
          R$ {summary.total_expense.toFixed(2)}
        </Text>

        <Text style={styles.label}>Saldo:</Text>
        <Text
          style={[
            styles.balance,
            { color: summary.balance >= 0 ? "#43a047" : "#e53935" },
          ]}
        >
          R$ {summary.balance.toFixed(2)}
        </Text>
      </View>

      <Text style={[styles.label, { marginTop: 24 }]}>
        Gastos por Categoria:
      </Text>
      {summary.by_category.length === 0 && (
        <Text style={{ marginTop: 8, color: "#666" }}>
          Nenhum gasto registrado.
        </Text>
      )}
      {summary.by_category.map((cat, index) => (
        <View key={index} style={styles.categoryItem}>
          <View
            style={[styles.colorDot, { backgroundColor: cat.color || "#ccc" }]}
          />
          <Text style={styles.categoryText}>
            {cat.name}: R$ {cat.total.toFixed(2)}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#e53935",
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#167ec5",
  },
  summaryBox: {
    backgroundColor: "#f4f7fa",
    borderRadius: 10,
    padding: 16,
    elevation: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },
  income: {
    fontSize: 18,
    color: "#43a047",
    fontWeight: "bold",
  },
  expense: {
    fontSize: 18,
    color: "#e53935",
    fontWeight: "bold",
  },
  balance: {
    fontSize: 18,
    fontWeight: "bold",
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  categoryText: {
    fontSize: 16,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
});
