import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function darkenColor(hex: string, amount = 0.2) {
  // hex: #RRGGBB
  let c = hex.replace("#", "");
  if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  const num = parseInt(c, 16);
  let r = Math.max(0, ((num >> 16) & 0xff) * (1 - amount));
  let g = Math.max(0, ((num >> 8) & 0xff) * (1 - amount));
  let b = Math.max(0, (num & 0xff) * (1 - amount));
  return `#${[r, g, b]
    .map((x) => Math.round(x).toString(16).padStart(2, "0"))
    .join("")}`;
}

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
  categoryColor = "#e0e0e0",
  onEdit,
  onDelete,
}: Props) {
  // Define a cor do valor com base no tipo
  const valueColor =
    type === "Despesa" ? "#e53935" : type === "Receita" ? "#43a047" : "#555";
  const tagBgColor = categoryColor;
  const tagBorderColor = darkenColor(categoryColor, 0.6);
  const tagTextColor = tagBorderColor;
  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{description}</Text>
        <Text
          style={[styles.details, { color: valueColor, fontWeight: "bold" }]}
        >
          {value}
        </Text>
        <Text style={styles.details}>{date}</Text>
        {category && (
          <View
            style={[
              styles.categoryTag,
              { backgroundColor: tagBgColor, borderColor: tagBorderColor },
            ]}
          >
            <Text style={[styles.categoryTagText, { color: tagTextColor }]}>
              {category}
            </Text>
          </View>
        )}
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
  categoryTag: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginTop: 6,
    borderWidth: 1.5,
  },
  categoryTagText: {
    fontSize: 13,
    fontWeight: "600",
  },
  actions: {
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 12,
  },
});
