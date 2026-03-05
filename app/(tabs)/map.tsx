import { ThemedText } from "@/components/themed-text";
import { useBars } from "@/hooks/useBars";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function MapScreen() {
  const { bars, loading } = useBars();

  const maps: { MapView?: any; Marker?: any } = useMemo(() => {
    try {
      // dynamic require so tests and environments without native maps don't fail
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const RnMaps = require("react-native-maps");
      return {
        MapView: RnMaps.default ?? RnMaps.MapView ?? RnMaps,
        Marker: RnMaps.Marker ?? RnMaps,
      };
    } catch (_e) {
      return {};
    }
  }, []);

  if (maps.MapView) {
    const MapView = maps.MapView;
    const Marker = maps.Marker;
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [priceText, setPriceText] = useState("");

    const selected = bars.find((b) => b.id === selectedId) ?? null;

    return (
      <View style={styles.container}>
        <ThemedText type="title">Map</ThemedText>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 41.3851,
            longitude: 2.1734,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {bars.map((b) =>
            b.location ? (
              <Marker
                key={b.id}
                coordinate={{
                  latitude: b.location.lat,
                  longitude: b.location.lng,
                }}
                title={b.name}
                description={
                  b.latestPrice ? `€${b.latestPrice}` : "Price unknown"
                }
                onPress={() => {
                  setSelectedId(b.id);
                  setPriceText(b.latestPrice ? String(b.latestPrice) : "");
                }}
              />
            ) : null,
          )}
        </MapView>

        {selected ? (
          <View style={styles.bottomCard}>
            <ThemedText type="subtitle">{selected.name}</ThemedText>
            <ThemedText>Current: €{selected.latestPrice ?? "n/a"}</ThemedText>
            <TextInput
              style={styles.input}
              value={priceText}
              onChangeText={setPriceText}
              keyboardType="numeric"
              placeholder="Enter new price"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                const p = parseFloat(priceText);
                if (!Number.isNaN(p) && selected) {
                  await (await import("@/hooks/useBars"))
                    .useBars()
                    .setPrice(selected.id, p);
                }
                setSelectedId(null);
                setPriceText("");
              }}
            >
              <ThemedText type="defaultSemiBold">Update price</ThemedText>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText type="title">Map (placeholder)</ThemedText>
      <ThemedText>
        A map view is not available in this environment. Install
        `react-native-maps` to enable the interactive map.
      </ThemedText>

      {loading ? (
        <ThemedText>Loading…</ThemedText>
      ) : (
        <FlatList
          data={bars}
          keyExtractor={(b) => b.id}
          renderItem={({ item }) => (
            <ThemedText>
              {item.name} — €{item.latestPrice ?? "n/a"}{" "}
              {item.location
                ? `(${item.location.lat.toFixed(4)}, ${item.location.lng.toFixed(4)})`
                : ""}
            </ThemedText>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  map: {
    height: 400,
    width: "100%",
    marginTop: 8,
  },
});
