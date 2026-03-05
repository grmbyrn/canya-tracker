import MockBarRepository from "../../repositories/MockBarRepository";

describe("MockBarRepository", () => {
  let repo: MockBarRepository;

  beforeEach(() => {
    repo = new MockBarRepository();
  });

  test("getBars returns all bars (10)", async () => {
    const bars = await repo.getBars();
    expect(Array.isArray(bars)).toBe(true);
    expect(bars.length).toBe(10);
  });

  test("getBarById returns correct bar and null for unknown id", async () => {
    const bars = await repo.getBars();
    const first = bars[0];
    const found = await repo.getBarById(first.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(first.id);

    const missing = await repo.getBarById("no-such-id");
    expect(missing).toBeNull();
  });

  test("submitBar resolves without error and increases count", async () => {
    const before = await repo.getBars();
    await repo.submitBar({
      name: "Test Bar",
      barri: "Test",
      address: "Nowhere 1",
      price: 1.5,
      latitude: 41.0,
      longitude: 2.0,
      isOpen: false,
      sizeLabel: "33cl",
    });
    const after = await repo.getBars();
    expect(after.length).toBe(before.length + 1);
  });
});
