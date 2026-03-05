import { useBars } from "@/hooks/useBars";
import { useSavedBars } from "@/hooks/useSavedBars";
import { useUserLocation } from "@/hooks/useUserLocation";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { BARCELONA_REGION, DARK_MAP_STYLE } from "../../constants/map";
import {
  formatPrice,
  getDistance,
  getPriceColor,
} from "../../utils/priceHelpers";

const { height: windowHeight } = Dimensions.get("window");

export default function MapScreen(): React.ReactElement {
  const { filteredBars, activeFilter, setActiveFilter, bars } = useBars();
  const { userLocation, locateMe } = useUserLocation();
  const { saveBar, removeBar, isSaved } = useSavedBars();
  // `react-native-maps` is a native module. Resolve it at runtime so the JS
  // bundle doesn't crash when native binaries are not present (dev machines,
  // CI, or when the dependency isn't installed). When missing we render a
  // lightweight placeholder.
  let MapsModule: any = null;
  try {
    // avoid static analysis by Metro bundler

    const req: any = eval("require");
    MapsModule = req("react-native-maps");
  } catch (e) {
    MapsModule = null;
  }

  const MapView: any = MapsModule?.default ?? null;
  const Marker: any = MapsModule?.Marker ?? null;
  const PROVIDER_GOOGLE: any = MapsModule?.PROVIDER_GOOGLE ?? "google";
  type Region = any;
  const mapRef = useRef<any | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const sheetAnim = useRef(new Animated.Value(windowHeight)).current;

  const selectedBar = useMemo(
    () => bars.find((b) => b.id === selected) ?? null,
    [bars, selected],
  );
  const openSheet = () => {
    Animated.timing(sheetAnim, {
      toValue: windowHeight - 260,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(sheetAnim, {
      toValue: windowHeight,
      duration: 250,
      useNativeDriver: false,
    }).start(() => setSelected(null));
  };

  const onPinPress = (
    id: string,
    coord?: { latitude: number; longitude: number },
  ) => {
    setSelected(id);
    if (coord) {
      mapRef.current?.animateToRegion(
        {
          latitude: coord.latitude,
          longitude: coord.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        } as Region,
        350,
      );
    }
    openSheet();
  };

  const cheapest = useMemo(() => {
    if (!filteredBars.length) return null;
    return Math.min(...filteredBars.map((b) => b.price));
  }, [filteredBars]);

  const average = useMemo(() => {
    if (!filteredBars.length) return null;
    const sum = filteredBars.reduce((s, b) => s + b.price, 0);
    return +(sum / filteredBars.length).toFixed(2);
  }, [filteredBars]);

  return (
    <View style={styles.container}>
      {MapView ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          customMapStyle={DARK_MAP_STYLE}
          initialRegion={BARCELONA_REGION as Region}
        >
          {filteredBars
            .filter((bar) => bar.latitude != null && bar.longitude != null)
            .map((bar) => (
              <Marker
                key={bar.id}
                coordinate={{
                  latitude: bar.latitude as number,
                  longitude: bar.longitude as number,
                }}
                onPress={() =>
                  onPinPress(bar.id, {
                    latitude: bar.latitude as number,
                    longitude: bar.longitude as number,
                  })
                }
              >
                <View
                  style={[
                    styles.pin,
                    { backgroundColor: getPriceColor(bar.price) },
                  ]}
                >
                  <Text style={styles.pinText}>{formatPrice(bar.price)}</Text>
                </View>
              </Marker>
            ))}
        </MapView>
      ) : (
        <View
          style={[
            styles.map,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text style={{ color: COLORS.text, marginBottom: 8 }}>
            Mapa no disponible — instal·la react-native-maps
          </Text>
          {filteredBars.slice(0, 6).map((b) => (
            <Text key={b.id} style={{ color: COLORS.text }}>
              {b.name} — {formatPrice(b.price)}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.topBar}>
        <View style={styles.filtersRow}>
          <TouchableOpacity
            onPress={() => setActiveFilter("Tots")}
            style={[styles.chip, activeFilter === "Tots" && styles.chipActive]}
          >
            <Text style={styles.chipText}>Tots</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveFilter("Ara obert")}
            style={[
              styles.chip,
              activeFilter === "Ara obert" && styles.chipActive,
            ]}
          >
            <Text style={styles.chipText}>Ara obert</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveFilter("Menys d'€1.50")}
            style={[
              styles.chip,
              activeFilter === "Menys d'€1.50" && styles.chipActive,
            ]}
          >
            <Text style={styles.chipText}>Menys d&apos;€1.50</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.statText}>Locals: {filteredBars.length}</Text>
          <Text style={styles.statText}>
            Barat: {cheapest ? formatPrice(cheapest) : "n/a"}
          </Text>
          <Text style={styles.statText}>
            Mitjana: {average ? formatPrice(average) : "n/a"}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.locateBtn}
        onPress={() => {
          locateMe();
          mapRef.current?.animateToRegion(BARCELONA_REGION as Region, 500);
        }}
      >
        <Text style={{ color: COLORS.text }}>📍</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.sheet, { top: sheetAnim }]}>
        {selectedBar ? (
          <View>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{selectedBar.name}</Text>
              <Text style={styles.sheetSub}>{selectedBar.barri}</Text>
            </View>
            <Text style={styles.sheetRow}>
              Distància:{" "}
              {userLocation
                ? (() => {
                    if (
                      selectedBar.latitude == null ||
                      selectedBar.longitude == null
                    ) {
                      return "—";
                    }
                    return getDistance(
                      userLocation.latitude,
                      userLocation.longitude,
                      selectedBar.latitude as number,
                      selectedBar.longitude as number,
                    );
                  })()
                : "—"}
            </Text>
            <Text style={styles.sheetRow}>
              Estat: {selectedBar.isOpen ? "Obert" : "Tancat"}
            </Text>
            <Text style={styles.sheetRow}>
              Preu: {formatPrice(selectedBar.price)}
            </Text>
            <View style={styles.sheetButtons}>
              <Pressable
                style={styles.primaryBtn}
                onPress={() => {
                  /* open directions */
                }}
              >
                <Text style={styles.btnText}>Com arribar-hi</Text>
              </Pressable>
              {isSaved(selectedBar.id) ? (
                <Pressable
                  style={styles.ghostBtn}
                  onPress={() => removeBar(selectedBar.id)}
                >
                  <Text style={styles.btnText}>Eliminar</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.ghostBtn}
                  onPress={() => saveBar(selectedBar)}
                >
                  <Text style={styles.btnText}>Guardar</Text>
                </Pressable>
              )}
            </View>
            <Pressable style={styles.closeBtn} onPress={closeSheet}>
              <Text style={styles.closeText}>Tancar</Text>
            </Pressable>
          </View>
        ) : (
          <View>
            <Text style={styles.sheetTitle}>Cap selecció</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.navy },
  map: { flex: 1 },
  pin: { padding: 6, borderRadius: 6, alignItems: "center" },
  pinText: { color: "#000", fontWeight: "700" },
  topBar: { position: "absolute", top: 12, left: 12, right: 12 },
  filtersRow: { flexDirection: "row" },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    marginRight: 8,
  },
  chipActive: { borderColor: COLORS.accent, borderWidth: 1 },
  chipText: { color: COLORS.text },
  statsRow: {
    marginTop: 10,
    backgroundColor: COLORS.card,
    padding: 8,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statText: { color: COLORS.text, fontSize: 12 },
  locateBtn: {
    position: "absolute",
    right: 12,
    bottom: 180,
    backgroundColor: COLORS.card,
    padding: 10,
    borderRadius: 30,
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 260,
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 12,
  },
  sheetHeader: { marginBottom: 6 },
  sheetTitle: { color: COLORS.text, fontSize: 18, fontWeight: "700" },
  sheetSub: { color: COLORS.muted, fontSize: 13 },
  sheetRow: { color: COLORS.text, marginTop: 6 },
  sheetButtons: { flexDirection: "row", marginTop: 12 },
  primaryBtn: {
    flex: 1,
    backgroundColor: COLORS.accent,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  ghostBtn: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.text,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: COLORS.navy2, fontWeight: "700" },
  closeBtn: { marginTop: 10, alignItems: "center" },
  closeText: { color: COLORS.muted },
});
