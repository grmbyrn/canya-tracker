import { Bar } from "../models";

export interface BarRepository {
  listAll(): Promise<Bar[]>;
  getById(id: string): Promise<Bar | undefined>;
  addOrUpdate(bar: Bar): Promise<void>;
  addPrice(barId: string, price: number, timestamp?: string): Promise<void>;
}
