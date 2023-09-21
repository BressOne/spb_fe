"use client";
import { useContext } from "react";
import Tables from "@/components/tables";
import { IdentityContext } from "@/contexts/identity";
import FullScreenSpinner from "@/components/layout/Spinner";

const Page = () => {
  const { userData } = useContext(IdentityContext);
  return userData ? <Tables userData={userData} /> : <FullScreenSpinner />;
};

export default Page;
