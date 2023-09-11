import React from "react";
import axios from "axios";

const API_URL = "";

const dummy = () => new Promise((resolve) => resolve(true));

export const ApiContext = React.createContext({
  getMenuSections: dummy,
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
  const getMenuSections = () => get("/api/basic/MenuSections");

  return (
    <ApiContext.Provider
      value={{
        getMenuSections: getMenuSections,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
