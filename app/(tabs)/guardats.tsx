import React from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { useSavedBars } from "../../hooks/useSavedBars";
import { formatPrice } from "../../utils/priceHelpers";

export default function GuardatsScreen() {
  const { savedBars, removeBar } = useSavedBars();

  const onRemove = (id: string) => {
    Alert.alert("Eliminar", "Vols eliminar aquest bar?", [
      { text: "Cancel·la", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => removeBar(id) },
    ]);
  };

  if (!savedBars.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          No tens cap bar guardat. Guarda els teus preferits aquí.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={savedBars}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.content}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.sub}>
                {item.barri} · {item.isOpen ? "Obert" : "Tancat"}
              </Text>
            </View>
            <View style={styles.actions}>
              <Text style={styles.price}>{formatPrice(item.price)}</Text>
              <TouchableOpacity
                onPress={() => onRemove(item.id)}
                style={styles.removeBtn}
              >
                <Text style={styles.removeText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.navy, padding: 12 },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: COLORS.navy,
  },
  emptyText: { color: COLORS.muted, textAlign: "center" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  content: { flex: 1 },
  name: { color: COLORS.text, fontWeight: "700" },
  sub: { color: COLORS.muted, marginTop: 4 },
  actions: { alignItems: "flex-end" },
  price: { color: COLORS.text, fontWeight: "700" },
  removeBtn: { marginTop: 8 },
  removeText: { color: COLORS.amber },
});
