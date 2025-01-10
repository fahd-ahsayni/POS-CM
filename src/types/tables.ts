// Interface for Floor object
export interface Floor {
    _id: string;
    name: string;
    table_ids: Table[];
}

// Interface for Table object
export interface Table {
    _id: string;
    name: string;
    seats: number;
    position_h: number;
    position_v: number;
    status: "occupied" | "available" | "empty";
    width: number;
    height: number;
    createdAt: string | null;
    updatedAt: string | null;
    floor: FloorSummary;
}

// Interface for Floor Summary (used within Table)
export interface FloorSummary {
    _id: string;
    name: string;
}