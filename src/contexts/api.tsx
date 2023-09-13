import React from "react";
import axios from "axios";

const API_URL = "http://localhost:3001";

const dummy = () => new Promise((resolve) => resolve(true));

export type Timeframe = {
  start: string;
  end: string;
};

export type WorkingHours = {
  monday: Timeframe;
  tuesday: Timeframe;
  wednesday: Timeframe;
  thursday: Timeframe;
  friday: Timeframe;
  saturday: Timeframe;
  sunday: Timeframe;
};

export type Restaurant = {
  id: string;
  name: string;
  workingHours: WorkingHours;
  timezoneOffsetMinutes: number;
};

export const ApiContext = React.createContext<{
  getRestaurant: (id: string) => Promise<Restaurant | null>;
  editRestaurant: (
    id: string,
    data: Omit<Restaurant, "id">
  ) => Promise<Restaurant | null>;
  login: () => Promise<any>;
}>({
  getRestaurant: () => new Promise((resolve) => resolve(null)),
  editRestaurant: () => new Promise((resolve) => resolve(null)),
  login: dummy,
});

export const ApiProvider = ({ children }: { children?: React.ReactNode }) => {
  const instance = axios.create({
    validateStatus: (status) => Math.trunc(status / 100) === 2,
  });

  const handleError = (promise = Promise.resolve()): Promise<any> =>
    promise.catch((error) => {
      const err = error.toJSON();
      throw new Error(err.message);
    });

  const get = async (path: string) => {
    const { data } = await handleError(instance.get(`${API_URL}${path}`));
    return data;
  };
  const post = async (path: string, args: any) => {
    const { data } = await handleError(
      instance.post(`${API_URL}${path}`, args)
    );
    return data;
  };
  const patch = async (path: string, args: any) => {
    const { data } = await handleError(
      instance.patch(`${API_URL}${path}`, args)
    );
    return data;
  };
  const remove = async (path: string) => {
    const { data } = await handleError(instance.delete(`${API_URL}${path}`));
    return data;
  };

  const login = () => get("/login");
  const getRestaurant = (id: string) => get(`/restaurant/${id}`);
  const editRestaurant = (id: string, data: Omit<Restaurant, "id">) =>
    patch(`/restaurant/${id}`, data);

  return (
    <ApiContext.Provider
      value={{
        getRestaurant,
        editRestaurant,
        login,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
