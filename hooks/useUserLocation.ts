import { useCallback, useEffect, useState } from "react";

type UserLocation = { latitude: number; longitude: number } | null;

type LocationApi = any;

export function useUserLocation(LocationApiParam?: LocationApi) {
  // Resolve `expo-location` dynamically to avoid bundler errors when the
  // dependency is not installed (useful for environments without native
  // modules or during certain test setups).
  let resolvedLocationApi: LocationApi | undefined = LocationApiParam;
  if (!resolvedLocationApi) {
    try {
      // Use eval to prevent static analysis of require by Metro bundler.
      // eslint-disable-next-line no-eval
      const req: any = eval("require");
      resolvedLocationApi = req("expo-location");
    } catch (err) {
      resolvedLocationApi = undefined;
    }
  }

  const [userLocation, setUserLocation] = useState<UserLocation>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const locateMe = useCallback(async () => {
    try {
      setLocationError(null);
      if (!resolvedLocationApi) {
        setLocationError("expo-location-missing");
        return;
      }
      const { status } =
        await resolvedLocationApi.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("permission-denied");
        setUserLocation(null);
        return;
      }
      const pos = await resolvedLocationApi.getCurrentPositionAsync({});
      const { latitude, longitude } = pos.coords;
      setUserLocation({ latitude, longitude });
    } catch (err) {
      setLocationError(err instanceof Error ? err.message : String(err));
    }
  }, [resolvedLocationApi]);

  useEffect(() => {
    void locateMe();
  }, [locateMe]);

  return { userLocation, locationError, locateMe };
}

export default useUserLocation;
