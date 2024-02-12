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

export const createStaffHash = (staffId: string, timestamp: number) => {
    if (!staffId.length || !timestamp) return "";
    const reversed = staffId.split("").reverse().join("");
    const timestampString = timestamp.toString();
    const middle = Math.floor(timestampString.length / 2); // odd e.g 2.5 for 5, 2 for 4
    const start = timestampString.substring(0, middle);
    const end = timestampString.substring(middle);
    return `${start}${reversed}${end}${middle}${timestampString.length}`;
};

export const extractStaffId = (queryAuthStr: string) => {
    if (!queryAuthStr.length) return;
    const stampMiddlePoint = Number(queryAuthStr.slice(-3, -2)); //hash will always be greater than 2 digits from now and into the future
    const stampLength = Number(queryAuthStr.slice(-2));
    const timestampStart = queryAuthStr.slice(0, stampMiddlePoint);
    const queryAuthStrWithoutInfo = queryAuthStr.slice(
        0,
        queryAuthStr.length - 3
    );
    const timestampEnd = queryAuthStrWithoutInfo.slice(
        -(stampLength - stampMiddlePoint)
    );
    const extractedTimestamp = Number(`${timestampStart}${timestampEnd}`);

    const extractedStaffId = queryAuthStrWithoutInfo.slice(
        stampMiddlePoint,
        queryAuthStrWithoutInfo.length - timestampEnd.length
    );

    return {
        id: extractedStaffId.split("").reverse().join(""),
        timestamp: extractedTimestamp
    };
};
