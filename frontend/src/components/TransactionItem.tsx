import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  description: string;
  value: string;
  type: string;
  date: string;
  category: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TransactionItem({
  description,
  value,
  type,
  date,
  category,
  onEdit,
  onDelete,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{description}</Text>
        <Text style={styles.details}>{value}</Text>
        <Text style={styles.details}>{type}</Text>
        <Text style={styles.details}>{date}</Text>
        <Text style={styles.details}>Categoria: {category}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit}>
          <Ionicons name="pencil" size={20} color="#167ec5" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
