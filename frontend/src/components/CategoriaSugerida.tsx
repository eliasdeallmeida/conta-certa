import React, { useState, useCallback } from "react";
import { TextInput, View, Text, TouchableOpacity } from "react-native";
import axios from "axios";
import debounce from "lodash.debounce";

export default function CategoriaSugerida({ onCategoriaSelecionada }) {
  const [descricao, setDescricao] = useState("");
  const [sugestoes, setSugestoes] = useState<string[]>([]);

  const buscarSugestoes = async (texto: string) => {
    try {
      const res = await axios.get(
        `http://192.168.100.22:8000/api/categorias/sugestoes/?q=${texto}`
      );
      setSugestoes(res.data);
    } catch (e) {
      console.error("Erro ao buscar sugestões", e);
    }
  };

  const debouncedBuscar = useCallback(debounce(buscarSugestoes, 300), []);

  const handleChangeDescricao = (text: string) => {
    setDescricao(text);
    debouncedBuscar(text);
  };

  return (
    <View>
      <TextInput
        placeholder="Descrição da transação"
        value={descricao}
        onChangeText={handleChangeDescricao}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />
      {sugestoes.map((categoria) => (
        <TouchableOpacity
          key={categoria}
          onPress={() => onCategoriaSelecionada(categoria)}
        >
          <Text style={{ padding: 8 }}>{categoria}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
