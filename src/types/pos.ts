// Define the type for your POS data
export interface UserData {
  _id: string;
  name: string;
  position: string;
  kitchen_post_id: null | string;
  image: null | string;
  phone: string;
  sex: string;
  email: string;
  admin_password: null | string;
  rfid: null | string;
  admin_rfid: null | string;
}

export interface ShiftData {
  _id: string;
  closing_time: null | string;
  starting_balance: number;
  status: string;
  cashdraw_number: null | number;
  day_id: string;
  user_id: UserData;
  closed_by: null | string;
  pos_id: string;
  shift_number: number;
  opening_time: string;
  createdAt: string;
  updatedAt: string;
}

export interface PosData {
  _id: string;
  name: string;
  printer_ip: string;
  order_types: string[];
  createdAt: string;
  updatedAt: string;
  shift: ShiftData | null;
}

export interface DayData {
  _id: string;
  name: string;
  opening_time: string;
  closing_time: null | string;
  status: string;
  revenue_system: number;
  revenue_declared: number;
  difference: number;
  cancel_total_amount: number;
  is_archived: boolean;
  opening_employee_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PosState {
  data: {
    pos: PosData[]; // pos is directly an array of PosData
    day: DayData;
  };
  loading: boolean;
  error: string | null;
}
