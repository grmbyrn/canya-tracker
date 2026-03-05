import { useCallback, useEffect, useState } from "react";

type UserLocation = { latitude: number; longitude: number } | null;

type LocationApi = any;

export function useUserLocation(LocationApiParam?: LocationApi) {
  // Resolve `expo-location` safely at runtime so bundlers don't fail when
  // the optional native module isn't installed. Use state + effect so the
  // reference is stable for `locateMe`.
  const [resolvedLocationApi, setResolvedLocationApi] = useState<
    LocationApi | undefined
  >(LocationApiParam ?? undefined);

  useEffect(() => {
    let mounted = true;
    if (LocationApiParam) {
      setResolvedLocationApi(LocationApiParam);
      return;
    }

    // Dynamic import; will reject at runtime if module isn't available.
    import("expo-location")
      .then((mod) => {
        if (!mounted) return;
        setResolvedLocationApi(mod as any);
      })
      .catch(() => {
        if (!mounted) return;
        setResolvedLocationApi(undefined);
      });

    return () => {
      mounted = false;
    };
  }, [LocationApiParam]);

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
