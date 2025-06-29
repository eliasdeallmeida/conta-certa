import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function darkenColor(hex: string, amount = 0.6) {
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
  name: string;
  color?: string;
  monthlyLimit?: number;
  currentSpent?: number;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CategoryItem({
  name,
  color = "#e0e0e0",
  monthlyLimit,
  currentSpent,
  onEdit,
  onDelete,
}: Props) {
  const tagBgColor = color;
  const tagBorderColor = darkenColor(color, 0.6);
  const tagTextColor = tagBorderColor;
  const limitExceeded =
    monthlyLimit !== undefined &&
    currentSpent !== undefined &&
    currentSpent > monthlyLimit;
  return (
    <View style={styles.item}>
      <View style={{ gap: 8 }}>
        <View
          style={[
            styles.categoryTag,
            { backgroundColor: tagBgColor, borderColor: tagBorderColor },
          ]}
        >
          <Text style={[styles.categoryTagText, { color: tagTextColor }]}>
            {name}
          </Text>
        </View>
        {typeof monthlyLimit === "number" && !isNaN(monthlyLimit) ? (
          <Text
            style={{
              color: limitExceeded ? "#e53935" : "#43a047",
              fontWeight: "bold",
              marginLeft: 8,
            }}
          >
            Meta: R$ {monthlyLimit.toFixed(2)}
          </Text>
        ) : (
          <Text style={{ color: "#999", marginLeft: 8 }}>(sem meta)</Text>
        )}
        {typeof currentSpent === "number" && !isNaN(currentSpent) && (
          <Text
            style={{
              color: limitExceeded ? "#e53935" : "#43a047",
              marginLeft: 8,
            }}
          >
            Gasto: R$ {currentSpent.toFixed(2)}
          </Text>
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
  item: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryTag: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderWidth: 1.5,
    marginRight: 4,
  },
  categoryTagText: {
    fontSize: 15,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
});
