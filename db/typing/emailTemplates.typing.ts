export interface EmailTemplate {
    id: string;
    created_at: string;
    category: "promotional" | "transactional";
    title: string;
}
