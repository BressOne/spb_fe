"use client";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import { ApiContext } from "./api";

export type Identity = {
  id: string;
  username: string;
  restaurantOrigin: string;
};

export const IdentityContext = React.createContext<{
  userData: Identity | undefined;
  destroyUser: () => void;
  applyLogin: (token: string) => void;
}>({
  userData: undefined,
  destroyUser: () => {},
  applyLogin: () => {},
});

export const IdentityProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [data, setData] = useState<Identity | undefined>(undefined);
  const { introspect } = useContext(ApiContext);
  const { push } = useRouter();

  const setUserData = (data: Identity, token: string) => {
    setData(data);
    window.localStorage.setItem("context", token);
  };
  const destroyUser = () => {
    setData(undefined);
    window.localStorage.removeItem("context");
    push("/");
  };

  const applyLogin = async (token: string) => {
    const decoded = jwt.decode(token) as Identity & jwt.JwtPayload;
    setUserData(decoded, token);
  };

  useEffect(() => {
    const ctx = window.localStorage.getItem("context");
    if (ctx) {
      introspect().then((response) => {
        response.allowed && applyLogin(ctx);
      });
    } else {
      destroyUser();
    }
  }, []);

  return (
    <IdentityContext.Provider
      value={{
        userData: data,
        destroyUser,
        applyLogin,
      }}
    >
      {children}
    </IdentityContext.Provider>
  );
};
