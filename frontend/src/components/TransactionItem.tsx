import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  description: string;
  value: string;
  type: string; // 'Despesa' ou 'Receita'
  date: string;
  category: string;
  categoryColor?: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TransactionItem({
  description,
  value,
  type,
  date,
  category,
  categoryColor = "#ccc",
  onEdit,
  onDelete,
}: Props) {
  const valueColor =
    type === "Despesa" ? "#e53935" : type === "Receita" ? "#43a047" : "#555";

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.header}>
          <View style={[styles.colorDot, { backgroundColor: categoryColor }]} />
          <Text style={styles.title}>{description}</Text>
        </View>

        <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
        <Text style={styles.date}>{date}</Text>

        {category && (
          <Text style={[styles.categoryText, { color: categoryColor }]}>
            {category}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
          <Ionicons name="pencil" size={18} color="#167ec5" />
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
          <Ionicons name="trash" size={18} color="red" />
          <Text style={styles.deleteText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f4f7fa",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 1,
  },
  leftSection: {
    flex: 1,
    paddingRight: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 2,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  categoryText: {
    marginTop: 6,
    fontWeight: "600",
    fontSize: 14,
  },
  actions: {
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  editText: {
    color: "#167ec5",
    fontSize: 14,
    fontWeight: "600",
  },
  deleteText: {
    color: "red",
    fontSize: 14,
    fontWeight: "600",
  },
});
