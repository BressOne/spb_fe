"use client";
import { useContext } from "react";
import { useParams } from "next/navigation";
import Reservations from "@/components/reservations";
import { IdentityContext } from "@/contexts/identity";
import FullScreenSpinner from "@/components/layout/Spinner";

const Page = () => {
  const { userData } = useContext(IdentityContext);
  const params = useParams();
  return userData ? (
    <Reservations userData={userData} tableId={params.id as string} />
  ) : (
    <FullScreenSpinner />
  );
};

export default Page;
