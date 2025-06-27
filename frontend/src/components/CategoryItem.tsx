import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  name: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CategoryItem({ name, onEdit, onDelete }: Props) {
  return (
    <View style={styles.item}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit}>
          <Text style={styles.edit}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Text style={styles.delete}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
