export const generateShopUrl = (spaceSeparatedWords: string) =>
    spaceSeparatedWords.toLowerCase().split(" ").join("-");
