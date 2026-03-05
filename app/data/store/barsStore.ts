import { Bar } from "../models";
import { BarService } from "../services/barService";

export class BarsStore {
  constructor(private service: BarService) {}

  async list(): Promise<Bar[]> {
    return this.service.listBars();
  }

  async setPrice(barId: string, price: number): Promise<number | null> {
    return this.service.setPrice(barId, price);
  }
}
