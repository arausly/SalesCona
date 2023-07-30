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

export function debounce<T extends (...args: any[]) => void>(
    func: T,
    delay: number
) {
    let timerId: NodeJS.Timeout | null;

    return function (this: any, ...args: Parameters<T>) {
        if (timerId) {
            clearTimeout(timerId);
        }

        timerId = setTimeout(() => {
            func.apply(this, args);
            timerId = null;
        }, delay);
    };
}

export function extractCurrencyInBracket(input: string): string | null {
    const regex = /\((.*?)\)/; // Regular expression to match text inside parentheses
    const match = regex.exec(input);

    if (match && match.length > 1) {
        return match[1]; // Return the content inside the first set of parentheses
    } else {
        return null; // Return null if no match is found
    }
}
