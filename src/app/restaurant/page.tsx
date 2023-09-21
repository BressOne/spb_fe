"use client";
import { useContext } from "react";
import Restaurant from "@/components/restaurant/";
import { IdentityContext } from "@/contexts/identity";
import FullScreenSpinner from "@/components/layout/Spinner";

const Page = () => {
  const { userData } = useContext(IdentityContext);
  return userData ? <Restaurant userData={userData} /> : <FullScreenSpinner />;
};

export default Page;
