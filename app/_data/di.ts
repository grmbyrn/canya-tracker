import { InMemoryBarRepository } from "./repositories/inMemoryBarRepository";
import { BarService } from "./services/barService";
import { BarsStore } from "./store/barsStore";

const defaultRepo = new InMemoryBarRepository([
  {
    id: "1",
    name: "Bar A",
    latestPrice: 2.5,
    location: { lat: 41.3870194, lng: 2.1699187 }, // central Barcelona
  },
  {
    id: "2",
    name: "Bar B",
    latestPrice: 3.0,
    location: { lat: 41.3809, lng: 2.1659 },
  },
]);

const defaultService = new BarService(defaultRepo);
export const defaultBarsStore = new BarsStore(defaultService);
