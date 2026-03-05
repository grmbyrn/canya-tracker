import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { LIST_SORTS } from "../../constants/map";
import { useBars } from "../../hooks/useBars";
import { formatPrice, getPriceColor } from "../../utils/priceHelpers";

export default function ListScreen() {
  const { filteredBars } = useBars();

  const sorted = useMemo(() => {
    return [...filteredBars].sort((a, b) => a.price - b.price);
  }, [filteredBars]);

  return (
    <View style={styles.container}>
      <View style={styles.sortRow}>
        {LIST_SORTS.map((s) => (
          <View key={s.key} style={styles.sortChip}>
            <Text style={styles.sortText}>{s.label}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(i) => i.id}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <View
              style={[
                styles.leftStripe,
                { backgroundColor: getPriceColor(item.price) },
              ]}
            />
            <View style={styles.cardContent}>
              <Text style={styles.rank}>#{index + 1}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.tag}>{item.barri}</Text>
                <Text style={styles.tag}>{item.sizeLabel}</Text>
                <Text
                  style={[
                    styles.badge,
                    {
                      backgroundColor: item.isOpen ? COLORS.green : COLORS.red,
                    },
                  ]}
                >
                  {item.isOpen ? "Obert" : "Tancat"}
                </Text>
              </View>
            </View>
            <Text style={styles.price}>{formatPrice(item.price)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.navy },
  sortRow: { flexDirection: "row", padding: 12 },
  sortChip: {
    backgroundColor: COLORS.card,
    padding: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  sortText: { color: COLORS.text },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: COLORS.card,
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  leftStripe: { width: 6, height: 56, borderRadius: 4, marginRight: 12 },
  cardContent: { flex: 1 },
  rank: { color: COLORS.muted, fontSize: 12 },
  name: { color: COLORS.text, fontWeight: "700", fontSize: 16 },
  metaRow: { flexDirection: "row", gap: 8, marginTop: 6, alignItems: "center" },
  tag: { color: COLORS.muted, backgroundColor: "transparent", marginRight: 6 },
  badge: {
    color: COLORS.text,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  price: { color: COLORS.text, fontWeight: "700", marginLeft: 12 },
});
