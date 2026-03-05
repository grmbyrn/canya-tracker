import { ThemedText } from "@/components/themed-text";
import { useBars } from "@/hooks/useBars";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function MapScreen() {
  const { bars, loading, setPrice } = useBars();

  const [maps, setMaps] = useState<{ MapView?: any; Marker?: any }>({});

  useEffect(() => {
    let mounted = true;
    // dynamic import so tests and environments without native maps don't fail
    import("react-native-maps")
      .then((RnMaps) => {
        if (!mounted) return;
        const anyMaps = RnMaps as any;
        setMaps({
          MapView: anyMaps.default ?? anyMaps.MapView ?? anyMaps,
          Marker: anyMaps.Marker ?? anyMaps,
        });
      })
      .catch(() => {
        // leave maps empty when module isn't available
      });

    return () => {
      mounted = false;
    };
  }, []);
  // Hooks must be called unconditionally at the top level
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [priceText, setPriceText] = useState("");
  const selected = bars.find((b) => b.id === selectedId) ?? null;

  if (maps.MapView) {
    const MapView = maps.MapView;
    const Marker = maps.Marker;

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
          {bars.map((b) => {
            const loc = (b as any).location
              ? (b as any).location
              : b.latitude != null && b.longitude != null
              ? { lat: b.latitude, lng: b.longitude }
              : null;

            return loc ? (
              <Marker
                key={b.id}
                coordinate={{
                  latitude: loc.lat,
                  longitude: loc.lng,
                }}
                title={b.name}
                description={b.latestPrice ? `€${b.latestPrice}` : "Price unknown"}
                onPress={() => {
                  setSelectedId(b.id);
                  setPriceText(b.latestPrice ? String(b.latestPrice) : "");
                }}
              />
            ) : null;
          })}
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
                  await setPrice(selected.id, p);
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
              {(() => {
                const loc = (item as any).location
                  ? (item as any).location
                  : item.latitude != null && item.longitude != null
                  ? { lat: item.latitude, lng: item.longitude }
                  : null;
                return loc ? `(${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})` : "";
              })()}
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
  bottomCard: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  input: {
    height: 40,
    paddingHorizontal: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#007aff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
});
