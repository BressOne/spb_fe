"use client";
import Tables from "@/components/tables";
import { IdentityContext } from "@/contexts/identity";
import { useContext } from "react";

const Page = () => {
  const { userData } = useContext(IdentityContext);
  return userData ? <Tables userData={userData} /> : <></>;
};

export default Page;
