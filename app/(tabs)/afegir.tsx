import { useUserLocation } from "@/hooks/useUserLocation";
import React, { useEffect, useState } from "react";
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
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const { userLocation, locateMe } = useUserLocation();

  useEffect(() => {
    if (userLocation?.latitude != null && userLocation?.longitude != null) {
      setLatitude(userLocation.latitude);
      setLongitude(userLocation.longitude);
    }
  }, [userLocation]);

  const onSubmit = async () => {
    if (!name || !address || !price) {
      Alert.alert("Error", "Si us plau, completa tots els camps");
      return;
    }
    const parsed = parseFloat(price.replace("€", "").replace(",", "."));
    if (Number.isNaN(parsed)) {
      Alert.alert("Error", "Preu no vàlid");
      return;
    }
    try {
      const payload: any = {
        name,
        address,
        price: parsed,
        sizeLabel: size,
        barri: "Desconegut",
        // isOpen set from the form (null -> undefined)
        isOpen: isOpen ?? undefined,
      };
      if (latitude != null && longitude != null) {
        payload.latitude = latitude;
        payload.longitude = longitude;
      }

      // submit as any to allow optional coordinates
      await repo.submitBar(payload as any);
      Alert.alert("Fet", "Bar afegit correctament");
      setName("");
      setAddress("");
      setPrice("");
      setSize("33cl");
      setLatitude(null);
      setLongitude(null);
      setIsOpen(null);
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

      <Text style={styles.label}>Ubicació</Text>
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <TouchableOpacity
          style={[styles.sizeBtn, { flex: 1 }]}
          onPress={() => {
            void locateMe();
          }}
        >
          <Text style={{ color: COLORS.text }}>
            {latitude != null && longitude != null
              ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
              : "Usa la meva ubicació"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Estat</Text>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
      >
        <TouchableOpacity
          style={[
            styles.sizeBtn,
            isOpen === true && styles.sizeActive,
            { marginRight: 8 },
          ]}
          onPress={() => setIsOpen(true)}
        >
          <Text style={{ color: COLORS.text }}>Obert</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sizeBtn, isOpen === false && styles.sizeActive]}
          onPress={() => setIsOpen(false)}
        >
          <Text style={{ color: COLORS.text }}>Tancat</Text>
        </TouchableOpacity>
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
