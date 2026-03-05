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

  const setPrice = useCallback(
    async (id: string, price: number) => {
      setBars((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, price, latestPrice: price } : b,
        ),
      );
      // Optionally persist change to repository if API supports it
      try {
        // best-effort: if repo has addPrice or addOrUpdate, call it
        if (typeof repo.addPrice === "function") {
          await repo.addPrice(id, price);
        } else if (typeof repo.addOrUpdate === "function") {
          // attempt to update via addOrUpdate
          const existing = // try to get existing bar
            typeof repo.getBarById === "function"
              ? await repo.getBarById(id)
              : null;
          if (existing) {
            await repo.addOrUpdate({ ...existing, latestPrice: price });
          }
        }
      } catch {
        /* ignore persistence errors for now */
      }
    },
    [repo],
  );

  return {
    bars,
    loading,
    error,
    activeFilter,
    setActiveFilter,
    filteredBars,
    reload: load,
    setPrice,
  };
}

export default useBars;
