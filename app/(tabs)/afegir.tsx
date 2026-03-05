import React, { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import MockBarRepository from "../../repositories/MockBarRepository";

const repo = new MockBarRepository();

export default function AfegirScreen() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("33cl");

  const onSubmit = async () => {
    if (!name || !address || !price) {
      Alert.alert("Error", "Si us plau, completa tots els camps");
      return;
    }
    const parsed = parseFloat(price.replace("€", "").replace(",", "."));
    try {
      await repo.submitBar({
        name,
        address,
        price: parsed,
        sizeLabel: size,
        barri: "Desconegut",
        latitude: 41.3917,
        longitude: 2.1649,
        isOpen: true,
      });
      Alert.alert("Fet", "Bar afegit correctament");
      setName("");
      setAddress("");
      setPrice("");
      setSize("33cl");
    } catch (err) {
      Alert.alert("Error", "No s'ha pogut enviar el bar");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nom del bar</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nom"
        placeholderTextColor={COLORS.muted}
      />

      <Text style={styles.label}>Adreça</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Adreça"
        placeholderTextColor={COLORS.muted}
      />

      <Text style={styles.label}>Preu (€)</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="1.50"
        keyboardType="decimal-pad"
        placeholderTextColor={COLORS.muted}
      />

      <Text style={styles.label}>Mida</Text>
      <View style={styles.sizeRow}>
        {["20cl", "25cl", "33cl"].map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.sizeBtn, size === s && styles.sizeActive]}
            onPress={() => setSize(s)}
          >
            <Text style={{ color: COLORS.text }}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ marginTop: 18 }}>
        <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
          <Text style={{ color: COLORS.navy2, fontWeight: "700" }}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.navy },
  label: { color: COLORS.muted, marginTop: 8 },
  input: {
    backgroundColor: COLORS.card,
    color: COLORS.text,
    padding: 12,
    borderRadius: 8,
    marginTop: 6,
  },
  sizeRow: { flexDirection: "row", marginTop: 8, gap: 8 },
  sizeBtn: { padding: 10, backgroundColor: COLORS.card, borderRadius: 8 },
  sizeActive: { borderColor: COLORS.accent, borderWidth: 1 },
  submitBtn: {
    backgroundColor: COLORS.accent,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
