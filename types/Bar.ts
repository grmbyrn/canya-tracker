export interface Bar {
  id: string;
  name: string;
  /** price in euros (e.g. 1.50) */
  price: number;
  /** optional latest observed price */
  latestPrice?: number;
  /** neighbourhood / barri */
  barri: string;
  address: string;
  latitude: number;
  longitude: number;
  isOpen: boolean;
  /** size label, e.g. "33cl" */
  sizeLabel: string;
}
