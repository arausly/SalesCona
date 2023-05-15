export const generateShopAlias = (spaceSeparatedWords: string) =>
    spaceSeparatedWords.trim().toLowerCase().split(" ").join("-");

export const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
        navigator.clipboard
            .writeText(text)
            .then(() => {})
            .catch((error) =>
                console.error("Failed to copy to clipboard", error)
            );
    } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
        } catch (error) {
            console.error("Failed to copy to clipboard", error);
        }
        document.body.removeChild(textarea);
    }
};
