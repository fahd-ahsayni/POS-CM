export interface Client {
  _id: string;
  name: string;
  phone: string;
  address?: string | "";
  email?: string | "";
  ice?: string | "";
}
