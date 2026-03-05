import { Tabs } from "expo-router";
import { default as React } from "react";
import { COLORS } from "../../constants/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.navy2,
          borderTopColor: COLORS.border,
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.muted,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "🗺️ Mapa" }} />
      <Tabs.Screen name="list" options={{ title: "📋 Llista" }} />
      <Tabs.Screen name="afegir" options={{ title: "➕ Afegir" }} />
      <Tabs.Screen name="guardats" options={{ title: "❤️ Guardats" }} />
    </Tabs>
  );
}
