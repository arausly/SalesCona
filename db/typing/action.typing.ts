import { ActionKeys } from "@lib/permissions/typing";
import { StoreTable } from "./store.typing";

export interface Action {
    id: number;
    title: string;
    description: string;
    key: ActionKeys;
    store: string;
}

export interface PopulatedAction extends Omit<Action, "store"> {
    store: StoreTable;
}
