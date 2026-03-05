import type { Bar } from "../types/Bar";
import type { IBarRepository } from "./BarRepository";

export class MockBarRepository implements IBarRepository {
  private bars: Bar[] = [
    {
      id: "b1",
      name: "Bar Marsella",
      barri: "El Raval",
      address: "Carrer de Sant Pau, 65",
      price: 1.5,
      latitude: 41.38,
      longitude: 2.169,
      isOpen: true,
      sizeLabel: "33cl",
    },
    {
      id: "b2",
      name: "La Xampanyeria",
      barri: "Barceloneta",
      address: "Carrer de la Maquinista, 14",
      price: 1.8,
      latitude: 41.3794,
      longitude: 2.1886,
      isOpen: false,
      sizeLabel: "25cl",
    },
    {
      id: "b3",
      name: "Els 4 Gats",
      barri: "Barri Gòtic",
      address: "Carrer de Montsió, 3",
      price: 2.5,
      latitude: 41.3839,
      longitude: 2.176,
      isOpen: true,
      sizeLabel: "33cl",
    },
    {
      id: "b4",
      name: "Cervecería Catalana",
      barri: "Eixample",
      address: "Carrer de Mallorca, 236",
      price: 2.2,
      latitude: 41.3925,
      longitude: 2.1649,
      isOpen: true,
      sizeLabel: "33cl",
    },
    {
      id: "b5",
      name: "Bar Central",
      barri: "Gràcia",
      address: "Plaça del Sol, 5",
      price: 1.2,
      latitude: 41.3956,
      longitude: 2.1526,
      isOpen: false,
      sizeLabel: "25cl",
    },
    {
      id: "b6",
      name: "Bodega Biarritz",
      barri: "Poble Sec",
      address: "Carrer de Blai, 32",
      price: 1.9,
      latitude: 41.3744,
      longitude: 2.1609,
      isOpen: true,
      sizeLabel: "33cl",
    },
    {
      id: "b7",
      name: "Bar del Bosc",
      barri: "Sant Antoni",
      address: "Carrer del Parlament, 45",
      price: 2.8,
      latitude: 41.3781,
      longitude: 2.1569,
      isOpen: true,
      sizeLabel: "50cl",
    },
    {
      id: "b8",
      name: "La Plata",
      barri: "Barri Gòtic",
      address: "Carrer de la Merce, 28",
      price: 1.1,
      latitude: 41.382,
      longitude: 2.1765,
      isOpen: false,
      sizeLabel: "20cl",
    },
    {
      id: "b9",
      name: "Bar Velódromo",
      barri: "Eixample",
      address: "Carrer de Valencia, 200",
      price: 2.0,
      latitude: 41.392,
      longitude: 2.1655,
      isOpen: true,
      sizeLabel: "33cl",
    },
    {
      id: "b10",
      name: "Bar L'Antiga",
      barri: "Sants",
      address: "Carrer de Sants, 100",
      price: 1.6,
      latitude: 41.3799,
      longitude: 2.1375,
      isOpen: false,
      sizeLabel: "33cl",
    },
  ];

  async getBars(): Promise<Bar[]> {
    // return a shallow copy to avoid external mutation
    return Promise.resolve(this.bars.slice());
  }

  async getBarById(id: string): Promise<Bar | null> {
    const found = this.bars.find((b) => b.id === id) ?? null;
    return Promise.resolve(found);
  }

  async submitBar(bar: Omit<Bar, "id">): Promise<void> {
    const id = `b_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    this.bars.push({ id, ...bar });
    return Promise.resolve();
  }
}

export default MockBarRepository;
