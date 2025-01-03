export interface ClientFormData {
  name: string;
  phone: string;
  address: string;
  email?: string;
  ice?: string;
}

export interface Client extends ClientFormData {
  _id: string;
}
