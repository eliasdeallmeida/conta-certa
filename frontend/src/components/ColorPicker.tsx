import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";

// Função para converter HSL para HEX
function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  let m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Gera uma faixa de cores (hex) para o usuário escolher
function generateHueColors(steps = 20) {
  const colors = [];
  for (let i = 0; i < steps; i++) {
    const hue = Math.round((i * 360) / steps);
    colors.push(hslToHex(hue, 80, 50));
  }
  return colors;
}

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [input, setInput] = useState(value);
  const colors = generateHueColors(24);

  // Atualiza cor ao digitar
  const handleInputChange = (text: string) => {
    setInput(text);
    // Valida formato hex simples
    if (/^#[0-9A-Fa-f]{6}$/.test(text)) {
      onChange(text);
    }
  };

  // Atualiza input ao clicar na faixa
  const handleSelect = (color: string) => {
    setInput(color);
    onChange(color);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Escolha uma cor:</Text>
      <View style={styles.colorsRow}>
        {colors.map((c) => (
          <TouchableOpacity
            key={c}
            style={[
              styles.colorCircle,
              {
                backgroundColor: c,
                borderWidth: value === c ? 3 : 1,
                borderColor: value === c ? "#333" : "#ccc",
              },
            ]}
            onPress={() => handleSelect(c)}
          />
        ))}
      </View>
      <View style={styles.inputRow}>
        {Platform.OS === "web" && (
          <input
            type="color"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            style={{
              width: 36,
              height: 36,
              border: "none",
              background: "none",
              borderRadius: 18,
              marginRight: 8,
            }}
          />
        )}
        <TextInput
          style={styles.hexInput}
          value={input}
          onChangeText={handleInputChange}
          placeholder="#167ec5"
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={7}
        />
        <View style={[styles.preview, { backgroundColor: input }]} />
      </View>
      <Text style={styles.hexText}>Hex: {input}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontSize: 15, fontWeight: "bold", marginBottom: 8 },
  colorsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    gap: 6,
  },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 4,
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  hexInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    width: 100,
    marginRight: 8,
    fontSize: 15,
  },
  preview: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  hexText: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
});
