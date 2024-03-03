import { actions } from "@lib/permissions/typing";

export interface Permission {
    id: number;
    title: string;
    description: string;
    action: actions;
}
