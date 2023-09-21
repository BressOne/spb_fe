import React from "react";
import axios from "axios";

const API_URL = process.env.API_URL || "http://localhost:3001";

export type Timeframe = {
  start: string;
  end: string;
};

export const week: Array<keyof WorkingHours> = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export type WorkingHours = {
  sunday: Timeframe;
  monday: Timeframe;
  tuesday: Timeframe;
  wednesday: Timeframe;
  thursday: Timeframe;
  friday: Timeframe;
  saturday: Timeframe;
};

export type Restaurant = {
  id: string;
  name: string;
  workingHours: WorkingHours;
  timezoneOffsetMinutes: number;
};

export type Table = {
  id: string;
  name: string;
};

export type ReservationMetadata = {
  personsToServe: number;
  startTime: Date;
  endTime: Date;
  notes?: string;
};

export type Reservation = {
  id: string;
  tableId: string;
  guestName: string;
  meta: ReservationMetadata;
};

export const ApiContext = React.createContext<{
  getRestaurant: (id: string) => Promise<Restaurant | null>;
  editRestaurant: (
    id: string,
    data: Omit<Restaurant, "id">
  ) => Promise<Restaurant | null>;
  login: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => Promise<{ token: string }>;
  introspect: () => Promise<{ allowed: boolean }>;
  getTables: (id: string) => Promise<Table[]>;
  getTable: (tableId: string, restaurantId: string) => Promise<Table | null>;
  removeTable: (tableId: string, restaurantId: string) => Promise<Table | null>;
  addTable: (restaurantId: string) => Promise<Table | null>;
  getRestaurantsReservations: (id: string) => Promise<Reservation[]>;
  getTableReservations: (
    tableId: string,
    restaurantId: string
  ) => Promise<Reservation[]>;
  removeReservation: (data: {
    reservationId: string;
    tableId: string;
    restaurantId: string;
  }) => Promise<Reservation | null>;

  addReservation: (
    tableId: string,
    restaurantId: string,
    body: Pick<Reservation, "guestName" | "meta">
  ) => Promise<Reservation | null>;
}>({
  getRestaurant: () => new Promise((resolve) => resolve(null)),
  editRestaurant: () => new Promise((resolve) => resolve(null)),
  getTables: () => new Promise((resolve) => resolve([])),
  getTable: () => new Promise((resolve) => resolve(null)),
  removeTable: () => new Promise((resolve) => resolve(null)),
  addTable: () => new Promise((resolve) => resolve(null)),
  login: () => new Promise((resolve) => resolve({ token: "string" })),
  introspect: () => new Promise((resolve) => resolve({ allowed: false })),
  getRestaurantsReservations: () => new Promise((resolve) => resolve([])),
  getTableReservations: () => new Promise((resolve) => resolve([])),
  removeReservation: () => new Promise((resolve) => resolve(null)),
  addReservation: () => new Promise((resolve) => resolve(null)),
});

export const ApiProvider = ({ children }: { children?: React.ReactNode }) => {
  const instance = axios.create({
    validateStatus: (status) => Math.trunc(status / 100) === 2,
  });

  const getOptionsHeaders = (supressAuth?: boolean) => {
    const ctx = window.localStorage.getItem("context");
    const headers: Record<string, string> = {};
    if (ctx && !supressAuth) {
      headers.authorization = ctx;
    }
    return headers;
  };

  const handleError = (promise = Promise.resolve()): Promise<any> =>
    promise.catch((error) => {
      const err = error.toJSON();
      throw new Error(err.message);
    });

  const get = async (path: string) => {
    const { data } = await handleError(
      instance.get(`${API_URL}${path}`, { headers: getOptionsHeaders() })
    );
    return data;
  };
  const post = async (
    path: string,
    body: any,
    supressAuth: boolean = false
  ) => {
    const { data } = await handleError(
      instance.post(`${API_URL}${path}`, body, {
        headers: getOptionsHeaders(supressAuth),
      })
    );
    return data;
  };
  const patch = async (path: string, body: any) => {
    const { data } = await handleError(
      instance.patch(`${API_URL}${path}`, body, {
        headers: getOptionsHeaders(),
      })
    );
    return data;
  };
  const remove = async (path: string) => {
    const { data } = await handleError(
      instance.delete(`${API_URL}${path}`, { headers: getOptionsHeaders() })
    );
    return data;
  };

  const login = ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => post("/login", { username, password }, true);
  const introspect = (): Promise<{ allowed: boolean }> =>
    post("/introspect", {});
  const getRestaurant = (restaurantId: string) =>
    get(`/restaurant/${restaurantId}`);
  const getTables = (restaurantId: string) =>
    get(`/restaurant/${restaurantId}/tables`);
  const getTable = (tableId: string, restaurantId: string) =>
    get(`/restaurant/${restaurantId}/table/${tableId}`);
  const addTable = (restaurantId: string) =>
    post(`/restaurant/${restaurantId}/table`, {});
  const removeTable = (tableId: string, restaurantId: string) =>
    remove(`/restaurant/${restaurantId}/table/${tableId}`);
  const editRestaurant = (id: string, data: Omit<Restaurant, "id">) =>
    patch(`/restaurant/${id}`, data);
  const getRestaurantsReservations = (restaurantId: string) =>
    get(`/restaurant/${restaurantId}/reservations`);
  const getTableReservations = (tableId: string, restaurantId: string) =>
    get(`/restaurant/${restaurantId}/table/${tableId}/reservations`);
  const removeReservation = ({
    reservationId,
    tableId,
    restaurantId,
  }: {
    reservationId: string;
    tableId: string;
    restaurantId: string;
  }) =>
    remove(
      `/restaurant/${restaurantId}/table/${tableId}/reservation/${reservationId}`
    );
  const addReservation = (tableId: string, restaurantId: string, body: any) =>
    post(`/restaurant/${restaurantId}/table/${tableId}/reservation`, body);

  return (
    <ApiContext.Provider
      value={{
        login,
        introspect,

        getRestaurant,
        editRestaurant,

        getTables,
        getTable,
        removeTable,
        addTable,

        getRestaurantsReservations,
        getTableReservations,
        removeReservation,
        addReservation,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
