import { Bar } from "../models";
import { BarRepository } from "../repositories/barRepository";

export class BarService {
  constructor(private repo: BarRepository) {}

  async getLatestPrice(barId: string): Promise<number | null> {
    const bar = await this.repo.getById(barId);
    return bar?.latestPrice ?? null;
  }

  async setPrice(barId: string, price: number): Promise<number | null> {
    await this.repo.addPrice(barId, price);
    return this.getLatestPrice(barId);
  }

  async listBars(): Promise<Bar[]> {
    return this.repo.listAll();
  }
}
