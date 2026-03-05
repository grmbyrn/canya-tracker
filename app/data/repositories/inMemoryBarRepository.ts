import { Bar, PriceEntry } from "../models";
import { BarRepository } from "./barRepository";

export class InMemoryBarRepository implements BarRepository {
  private bars: Bar[];

  constructor(initial: Bar[] = []) {
    this.bars = initial.map((b) => ({ ...b }));
  }

  async listAll(): Promise<Bar[]> {
    return this.bars;
  }

  async getById(id: string): Promise<Bar | undefined> {
    return this.bars.find((b) => b.id === id);
  }

  async addOrUpdate(bar: Bar): Promise<void> {
    const idx = this.bars.findIndex((b) => b.id === bar.id);
    if (idx >= 0) this.bars[idx] = { ...this.bars[idx], ...bar };
    else this.bars.push(bar);
  }

  async addPrice(
    barId: string,
    price: number,
    timestamp: string = new Date().toISOString(),
  ): Promise<void> {
    const bar = this.bars.find((b) => b.id === barId);
    const entry: PriceEntry = { price, timestamp };
    if (bar) {
      bar.prices = bar.prices ? [...bar.prices, entry] : [entry];
      bar.latestPrice = price;
    } else {
      this.bars.push({
        id: barId,
        name: "Unknown",
        prices: [entry],
        latestPrice: price,
      });
    }
  }
}
