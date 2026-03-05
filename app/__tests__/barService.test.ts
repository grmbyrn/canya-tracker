import { InMemoryBarRepository } from "../data/repositories/inMemoryBarRepository";
import { BarService } from "../data/services/barService";

describe("BarService", () => {
  it("returns null for unknown bar", async () => {
    const repo = new InMemoryBarRepository();
    const svc = new BarService(repo);
    const price = await svc.getLatestPrice("unknown");
    expect(price).toBeNull();
  });

  it("sets and returns latest price", async () => {
    const repo = new InMemoryBarRepository([{ id: "1", name: "Bar X" } as any]);
    const svc = new BarService(repo);
    const updated = await svc.setPrice("1", 3.0);
    expect(updated).toBe(3.0);
    const after = await svc.getLatestPrice("1");
    expect(after).toBe(3.0);
  });
});
