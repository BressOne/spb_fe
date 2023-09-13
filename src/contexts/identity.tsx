import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

export type Identity = {
  restaurantOrigin: string;
};

export const IdentityContext = React.createContext<{
  userData: Identity | undefined;
  setUserData: (data: Identity) => void;
  destroyUser: () => void;
}>({
  userData: undefined,
  setUserData: () => {},
  destroyUser: () => {},
});

export const IdentityProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [data, setData] = useState<Identity | undefined>(undefined);

  const setUserData = (data: Identity) => {
    setData(data);
    window.localStorage.setItem("context", data.restaurantOrigin);
  };
  const destroyUser = () => {
    setData(undefined);
    window.localStorage.removeItem("context");
    redirect("/");
  };

  useEffect(() => {
    const ctx = window.localStorage.getItem("context");
    if (ctx) {
      setData({ restaurantOrigin: ctx });
    }
  }, []);

  return (
    <IdentityContext.Provider
      value={{
        userData: data,
        setUserData,
        destroyUser,
      }}
    >
      {children}
    </IdentityContext.Provider>
  );
};
