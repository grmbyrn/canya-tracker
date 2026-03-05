import { useCallback, useEffect, useMemo, useState } from "react";
import type { IBarRepository } from "../repositories/BarRepository";
import MockBarRepository from "../repositories/MockBarRepository";
import type { Bar } from "../types/Bar";

export type BarsFilter = "Tots" | "Ara obert" | "Menys d'€1.50";

export function useBars(repository?: IBarRepository) {
  const repo = useMemo(
    () => repository ?? new MockBarRepository(),
    [repository],
  );
  const [bars, setBars] = useState<Bar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeFilter, setActiveFilter] = useState<BarsFilter>("Tots");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await repo.getBars();
      setBars(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [repo]);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredBars = useMemo(() => {
    switch (activeFilter) {
      case "Ara obert":
        return bars.filter((b) => b.isOpen);
      case "Menys d'€1.50":
        return bars.filter((b) => b.price < 1.5);
      case "Tots":
      default:
        return bars;
    }
  }, [bars, activeFilter]);

  return {
    bars,
    loading,
    error,
    activeFilter,
    setActiveFilter,
    filteredBars,
    reload: load,
  };
}

export default useBars;
