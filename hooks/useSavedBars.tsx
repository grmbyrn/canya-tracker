import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import type { Bar } from "../types/Bar";

type SavedBarsContextValue = {
  savedBars: Bar[];
  saveBar: (bar: Bar) => void;
  removeBar: (id: string) => void;
  isSaved: (id: string) => boolean;
};

const SavedBarsContext = createContext<SavedBarsContextValue | null>(null);

export function SavedBarsProvider({ children }: { children: React.ReactNode }) {
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
    (id: string) => savedBars.some((b) => b.id === id),
    [savedBars],
  );

  const value = useMemo(
    () => ({ savedBars, saveBar, removeBar, isSaved }),
    [savedBars, saveBar, removeBar, isSaved],
  );

  return (
    <SavedBarsContext.Provider value={value}>
      {children}
    </SavedBarsContext.Provider>
  );
}

export function useSavedBars() {
  const ctx = useContext(SavedBarsContext);
  if (!ctx) {
    throw new Error("useSavedBars must be used within a SavedBarsProvider");
  }
  return ctx;
}

export default useSavedBars;
