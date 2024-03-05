import { ActionKeys } from "@lib/permissions/typing";

export interface Action {
    id: number;
    title: string;
    description: string;
    key: ActionKeys;
}
