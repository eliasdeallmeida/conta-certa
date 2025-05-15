import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function ButtonSecondary({
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
    backgroundColor: "#fff",
    borderColor: "#167ec5",
    borderWidth: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  text: {
    color: "#167ec5",
    fontSize: 16,
    fontWeight: "bold",
  },
});
