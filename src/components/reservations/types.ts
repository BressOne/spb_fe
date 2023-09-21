import { ReservationMetadata } from "@/contexts/api";

export type Resource = {
  fieldName: string;
  title: string;
  instances: Instance[];
};

export type Instance = {
  text: string;
  id: string;
  color?: string;
};

export const all = "All" as const;

export type TableFilter = "All" | string;
export type TableChange = (value: TableFilter) => void;

export type TableReservation = {
  id: string;
  startDate: Date;
  endDate: Date;
  meta: ReservationMetadata;
  tableId: string;
  guestName: string;
  restaurantId: string;
  title: string;
};
