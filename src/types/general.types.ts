import { Category, Product } from "./product.types";

export interface GeneralData {
  floors: object[];
  configs: object[];
  categories: Category[];
  defineNote: object[];
  orderTypes: object[];
  discount: object[];
  paymentMethods: object[];
  waiters: object[];
  livreurs: object[];
  products: Product[];
}

export interface GeneralDataState {
  data: GeneralData;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface FilterCriteria {
  employee: string;
  orderType: string;
  status: string;
  orderId: string;
  tableNumber: number | string;
}
