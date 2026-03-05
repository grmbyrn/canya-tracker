import { InMemoryBarRepository } from "../data/repositories/inMemoryBarRepository";
import { BarService } from "../data/services/barService";
import { BarsStore } from "../data/store/barsStore";

describe("BarsStore", () => {
  it("lists bars and sets price through service", async () => {
    const repo = new InMemoryBarRepository([{ id: "1", name: "Bar A" } as any]);
    const svc = new BarService(repo);
    const store = new BarsStore(svc);

    const list = await store.list();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThanOrEqual(1);

    const updated = await store.setPrice("1", 4.5);
    expect(updated).toBe(4.5);
  });
});
