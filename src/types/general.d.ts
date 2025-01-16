import { OrderType } from "./order.types";
import { Category, Product } from "./product.types";

export interface GeneralData {
  floors: object[];
  configs: object[];
  categories: Category[];
  defineNote: object[];
  orderTypes: OrderType[];
  discount: object[];
  paymentMethods: object[];
  waiters: StaffUser[];
  livreurs: StaffUser[];
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

export interface PaymentMethod {
  _id: string;
  name: string;
  amount: number;
  originalId?: string;
}
