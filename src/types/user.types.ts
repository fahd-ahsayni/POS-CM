import { BaseEntity } from './common.types';

export interface User extends BaseEntity {
  name: string;
  position: string;
  kitchen_post_id: string | null;
  image: string | null;
  phone: string;
  sex: string;
  email: string;
  has_pos?: boolean;
  admin_password: string | null;
  rfid: string | null;
  admin_rfid: string | null;
} 