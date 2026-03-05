import { useCallback, useState } from "react";
import type { Bar } from "../types/Bar";

export function useSavedBars() {
  const [savedBars, setSavedBars] = useState<Bar[]>([]);

  const saveBar = useCallback((bar: Bar) => {
    setSavedBars((prev) => {
      if (prev.find((b) => b.id === bar.id)) return prev;
      return [...prev, bar];
    });
  }, []);

  const removeBar = useCallback((id: string) => {
    setSavedBars((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const isSaved = useCallback(
    (id: string) => {
      return savedBars.some((b) => b.id === id);
    },
    [savedBars],
  );

  return { savedBars, saveBar, removeBar, isSaved };
}

export default useSavedBars;
