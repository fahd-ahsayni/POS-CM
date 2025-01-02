const smallWords = new Set([
  "qu'une",
  "qu'un",
  "aussi",
  "ainsi",
  "your",
  "pour",
  "mais",
  "but",
  "end",
  "and",
  "the",
  "une",
  "que",
  "you",
  "les",
  "des",
  "or",
  "an",
  "of",
  "to",
  "un",
  "l'",
  "la",
  "le",
  "de",
  "d'",
  "ou",
  "et",
  "se",
  "a",
  "à",
  "y",
]);

export const capitalize = (str: string): string => {
  return str.length > 0
    ? `${str[0].toUpperCase()}${str.substring(1).toLowerCase()}`
    : "";
};

export const toTitleCase = (text: string): string => {
  return text
    .split("\n")
    .map((line) => {
      return line
        .replace(/\s+/g, " ")
        .split(" ")
        .map((word, index) => {
          if (index === 0 || !smallWords.has(word.toLowerCase())) {
            return capitalize(word);
          }
          return word.toLowerCase();
        })
        .join(" ");
    })
    .join("\n");
};
