import { Reservation, Table, week, WorkingHours } from "@/contexts/api";
import { Instance, TableReservation } from "./types";

export const stringToColour = (str: string) => {
  let hash = 0;
  str.split("").forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, "0");
  }
  return colour + "80";
};

export const getAllInstances = (tables: Table[]): Instance[] => [
  ...tables.map((t) => ({
    text: t.name,
    id: t.id,
    color: stringToColour(t.id),
  })),
];

const getTZAdjustedDate = (date: Date): Date => {
  const browsersTimezoneOffset = new Date().getTimezoneOffset() / 60;
  const dateClone = new Date(date);
  dateClone.setHours(dateClone.getHours() + browsersTimezoneOffset);
  return dateClone;
};

const mapReservations = (
  reservations: Reservation[],
  table: Table,
  restaurantId: string
) => {
  return reservations.map((r) => {
    //the date adjustment is cheap - it adjustes dates to UTC to be displayed as UTC in schedule
    const [startDate, endDate] = [
      getTZAdjustedDate(r.meta.startTime),
      getTZAdjustedDate(r.meta.endTime),
    ];

    return {
      id: r.id,
      startDate,
      endDate,
      meta: r.meta,
      tableId: r.tableId,
      guestName: r.guestName,
      restaurantId,
      title: `${r.guestName} ${table.name}`,
    };
  });
};

export const getAllReservations = (
  reservations: Reservation[],
  tables: Table[],
  restaurantOrigin: string
): TableReservation[] =>
  tables
    .map((table) =>
      mapReservations(
        reservations.filter((r) => r.tableId === table.id),
        table,
        restaurantOrigin
      )
    )
    .flat();

export const getRestaurantsWorkingHours = (
  day: Date,
  restaurantworkingHours: WorkingHours
) => {
  const dayIndex = day.getDay();
  const dayName = week[dayIndex];
  return restaurantworkingHours[dayName];
};
