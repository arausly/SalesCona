import { MerchantTable } from "./merchant.typing";

export interface MerchantEmailTemplateTable {
    id: string;
    created_at: string;
    email_template_used: string;
    sender: string;
    status: "pending" | "success" | "failure";
    merchant: string;
}

export interface MerchantEmailTemplate
    extends Omit<MerchantEmailTemplateTable, "merchant"> {
    merchant: MerchantTable;
}
