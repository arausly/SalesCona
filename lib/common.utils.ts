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

export const onlyIfWindowIsDefined = <T>(cb: () => void): T | undefined => {
    if (process.browser) {
        return cb() as T;
    }
};

export function extractCurrencyInBracket(input: string): string | null {
    const regex = /\((.*?)\)/; // Regular expression to match text inside parentheses
    const match = regex.exec(input);

    if (match && match.length > 1) {
        return match[1]; // Return the content inside the first set of parentheses
    } else {
        return null; // Return null if no match is found
    }
}

type AnyObject = Record<string, any>;

export function excludeKeysFromObj<T extends AnyObject, K extends keyof T>(
    obj: T,
    keysToRemove: K[]
): Omit<T, K> {
    const newObj = { ...obj };

    keysToRemove.forEach((key) => {
        delete newObj[key];
    });

    return newObj;
}

// Example usage
const originalObject = { a: 1, b: 2, c: 3, d: 4 };
const keysToRemove = ["b", "d"];
