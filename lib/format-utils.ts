import currencies from "currency-list";

export function formatNumberWithSuffix(number: number) {
    const suffixes = ["", "k", "M", "B", "T"]; // Define suffixes for powers of 10
    const power = Math.floor(Math.log10(Math.abs(number)) / 3); // Calculate the power of 10
    const value = number / Math.pow(10, power * 3); // Calculate the value without suffix
    const formattedValue =
        value % 1 === 0 ? value.toFixed(0) : value.toFixed(1); // Format the value with or without decimal places

    return `${formattedValue}${suffixes[power]}`; // Combine the value and suffix
}

export function truncateString(str: any, maxLen: number) {
    if (typeof str !== "string") return str;
    if (str.length <= maxLen) {
        return str;
    } else {
        return str.slice(0, maxLen) + "...";
    }
}

export const generateAvatarInitials = (char: string) => {
    if (char.length < 2) return char;
    const charsSplitted = char.split(" ");
    return charsSplitted.reduce((avatarInitials, char) => {
        avatarInitials += char[0];
        return avatarInitials;
    }, "");
};

export const generateAvatarBg = () => {
    const bgColors = [
        "#DBDFEA",
        "#A4D0A4",
        "#C9A7EB",
        "#B0A4A4",
        "#B9EDDD",
        "#FFABAB",
        "#A2A378",
    ];
    const randomIndex = Math.floor(Math.random() * bgColors.length);
    return bgColors[randomIndex].toLowerCase();
};

const fileSizes = ["B", "KB", "MB", "GB"];
const KILOBYTE = 1024;

export const formatByteToSize = (bytes: number, level: number = 0): string => {
    if (bytes < KILOBYTE) {
        return `${bytes}${fileSizes[level]}`;
    }
    return formatByteToSize(Math.round(bytes / KILOBYTE), ++level);
};

export const convertPathToSpaceSeparatedStr = (path: string) => {
    const [lastPath] = path.split("/").slice(-1);
    const fmt = lastPath.split("-").join(" ");
    return { lastPath, fmt };
};

export const getCurrencies = () => {
    const rawCurrencies = currencies.getAll("en_US");
    return Object.values(rawCurrencies).map((curr) => ({
        id: curr.code,
        label: `${curr.name} (${curr.symbol})`,
    }));
};


export const formatTimeAgo = (timestamp: number): string => {
    const currentDate = Date.now();
    const timeDifference = currentDate - timestamp;
  
    const seconds = Math.floor(timeDifference / 1000);
    if (seconds < 60) {
      return `${seconds} ${seconds !== 1 ? 'secs' : 'sec'} ago`;
    }
  
    const minutes = Math.floor(timeDifference / (1000 * 60));
    if (minutes < 60) {
      return `${minutes} ${minutes !== 1 ? 'mins' : 'min'} ago`;
    }
  
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    if (hours < 24) {
      return `${hours} ${hours !== 1 ? 'hrs' : 'hr'} ago`;
    }
  
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    if (days < 365) {
      return `${days} ${days !== 1 ? 'days' : 'day'} ago`;
    }
  
    const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));
    return `${years} ${years !== 1 ? 'yrs' : 'yr'} ago`;
  }
  