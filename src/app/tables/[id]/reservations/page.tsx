"use client";
import { useContext } from "react";
import { useParams } from "next/navigation";
import Tables from "@/components/table";
import { IdentityContext } from "@/contexts/identity";

const Page = () => {
  const { userData } = useContext(IdentityContext);
  const params = useParams();
  return userData ? (
    <Tables userData={userData} tableId={params.id as string} />
  ) : (
    <></>
  );
};

export default Page;
