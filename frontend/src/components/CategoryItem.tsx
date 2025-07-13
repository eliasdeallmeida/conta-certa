import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  name: string;
  color: string;
  monthlyLimit: number | null;
  currentSpent: number;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CategoryItem({
  name,
  color,
  monthlyLimit,
  currentSpent,
  onEdit,
  onDelete,
}: Props) {
  const progress =
    monthlyLimit && monthlyLimit > 0
      ? Math.min(currentSpent / monthlyLimit, 1)
      : 0;
  const progressColor = progress >= 1 ? "#e53935" : "#43a047";

  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <View style={styles.header}>
          <View style={[styles.colorDot, { backgroundColor: color }]} />
          <Text style={styles.name}>{name}</Text>
        </View>

        {/* {monthlyLimit !== null && (
          <> */}
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width:
                  monthlyLimit && monthlyLimit > 0
                    ? `${Math.min((currentSpent / monthlyLimit) * 100, 100)}%`
                    : "0%",
                backgroundColor:
                  monthlyLimit && monthlyLimit > 0
                    ? currentSpent > monthlyLimit
                      ? "#e53935" // vermelho
                      : "#43a047" // verde
                    : "#ccc", // cinza se não há meta
              },
            ]}
          />
        </View>
        <Text style={styles.spentText}>
          Gasto: R$ {currentSpent.toFixed(2)} /{" "}
          {monthlyLimit !== null ? `R$ ${monthlyLimit.toFixed(2)}` : "Sem meta"}
        </Text>
        {/* </>
        )} */}
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
  card: {
    backgroundColor: "#f9f9f9",
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
    marginBottom: 6,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 8,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  spentText: {
    fontSize: 14,
    marginTop: 4,
    color: "#555",
  },
  actions: {
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginVertical: 12,
    marginLeft: 8,
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
