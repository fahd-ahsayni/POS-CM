interface Currency {
  _id: string;
  symbol: "Dhs" | "MAD";
  name: string;
  currency: "MAD";
  toFixed: number | null;
}

interface loadingColors {
  primary: string;
  secondary: string;
}

export const currency: Currency = {
  _id: "1",
  symbol: "Dhs",
  name: "Moroccan Dirham",
  currency: "MAD",
  toFixed: 2,
};

export const loadingColors: loadingColors = {
  primary: "#FFF",
  secondary: "#FB0000",
};
