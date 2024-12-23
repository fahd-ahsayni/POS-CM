interface Currency {
  _id: string;
  symbol: "Dhs" | "MAD";
  name: string;
  currency: "MAD";
  toFixed: number | null;
}

export const currency: Currency = {
  _id: "1",
  symbol: "Dhs",
  name: "Moroccan Dirham",
  currency: "MAD",
  toFixed: 2,
};
