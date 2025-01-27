// Base interfaces that are used across multiple files
export interface BaseEntity {
  id?: string;
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tax extends BaseEntity {
  name: string;
  value: number;
}

export interface UnitOfMeasure extends BaseEntity {
  name: string;
}
