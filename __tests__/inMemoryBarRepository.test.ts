import { Bar } from "@/app/data/models";
import { InMemoryBarRepository } from "@/app/data/repositories/inMemoryBarRepository";

describe("InMemoryBarRepository", () => {
  it("returns bar with latest cana price", async () => {
    const initial: Bar[] = [
      {
        id: "1",
        name: "Bar X",
        latestPrice: 2.5,
        prices: [{ price: 2.5, timestamp: new Date().toISOString() }],
      },
    ];

    const repo = new InMemoryBarRepository(initial);
    const bar = await repo.getById("1");
    expect(bar).toBeDefined();
    expect(bar!.latestPrice).toBe(2.5);
  });
});
