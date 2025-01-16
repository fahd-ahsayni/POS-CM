export interface StaffUser {
  _id: string;
  name: string;
  position: string;
  kitchen_post_id: string | null;
  image: string | null;
  phone: string;
  sex: "Male" | "Female";
  has_pos: boolean;
  email: string;
  password: string;
  created_by: string | null;
  updated_by: string | null;
  deleted_at: Date | null;
  admin_password: string | null;
  is_root: boolean;
  rfid: string | null;
  admin_rfid: string | null;
  deleted_by: string | null;
  createdAt: Date;
  updatedAt: Date;
}
