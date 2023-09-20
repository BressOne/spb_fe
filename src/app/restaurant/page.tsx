"use client";
import Restaurant from "@/components/restaurant/";
import { IdentityContext } from "@/contexts/identity";
import { useContext } from "react";

const Page = () => {
  const { userData } = useContext(IdentityContext);
  return userData ? <Restaurant userData={userData} /> : <></>;
};

export default Page;
