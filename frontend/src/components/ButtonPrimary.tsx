import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function ButtonPrimary({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#167ec5",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginTop: 16,
    marginBottom: 16,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
