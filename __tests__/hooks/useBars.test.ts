// @ts-nocheck
import { useBars } from "../../hooks/useBars";
import type { IBarRepository } from "../../repositories/BarRepository";
import type { Bar } from "../../types/Bar";

describe.skip("useBars", () => {
  const sampleBars: Bar[] = [
    {
      id: "1",
      name: "A",
      price: 1.0,
      barri: "X",
      address: "a",
      latitude: 0,
      longitude: 0,
      isOpen: true,
      sizeLabel: "33cl",
    },
    {
      id: "2",
      name: "B",
      price: 2.0,
      barri: "Y",
      address: "b",
      latitude: 0,
      longitude: 0,
      isOpen: false,
      sizeLabel: "33cl",
    },
    {
      id: "3",
      name: "C",
      price: 1.2,
      barri: "Z",
      address: "c",
      latitude: 0,
      longitude: 0,
      isOpen: true,
      sizeLabel: "33cl",
    },
  ];

  test("loads bars on mount and toggles loading state", async () => {
    const repo: IBarRepository = {
      getBars: async () => sampleBars,
      getBarById: async (id: string) =>
        sampleBars.find((b) => b.id === id) ?? null,
      submitBar: async () => {},
    };

    const { result } = renderHook(() => useBars(repo));
    // initial loading true
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.bars.length).toBe(3);
  });

  test("filteredBars updates when activeFilter changes", async () => {
    const repo: IBarRepository = {
      getBars: async () => sampleBars,
      getBarById: async (id: string) =>
        sampleBars.find((b) => b.id === id) ?? null,
      submitBar: async () => {},
    };

    const { result } = renderHook(() => useBars(repo));
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.setActiveFilter("Ara obert"));
    expect(result.current.filteredBars.every((b: Bar) => b.isOpen)).toBe(true);

    act(() => result.current.setActiveFilter("Menys d'€1.50"));
    expect(result.current.filteredBars.every((b: Bar) => b.price < 1.5)).toBe(
      true,
    );
  });

  test("handles errors from repository", async () => {
    const repo: IBarRepository = {
      getBars: async () => {
        throw new Error("fail");
      },
      getBarById: async () => null,
      submitBar: async () => {},
    };

    const { result } = renderHook(() => useBars(repo));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).not.toBeNull();
  });
});
