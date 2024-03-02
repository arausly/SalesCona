import { StoreTable } from "./store.typing";

export interface DeliveryLocationChargeTable {
    id: string;
    created_at: string;
    location: string;
    store: string;
    charge: number;
}

export interface DeliveryLocationCharge
    extends Omit<DeliveryLocationChargeTable, "store"> {
    store: StoreTable;
}
