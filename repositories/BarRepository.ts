import type { Bar } from "../types/Bar";

export interface IBarRepository {
  getBars(): Promise<Bar[]>;
  getBarById(id: string): Promise<Bar | null>;
  submitBar(bar: Omit<Bar, "id">): Promise<void>;
  // optional persistence helpers
  addOrUpdate?(bar: Bar): Promise<void>;
  addPrice?(barId: string, price: number, timestamp?: string): Promise<void>;
}
