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
