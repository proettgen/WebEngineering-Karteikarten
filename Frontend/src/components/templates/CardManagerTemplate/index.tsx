import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CardManager from "../../organisms/CardManager";
import * as SC from "./styles";
import { useAuth } from "@/context/AuthContext";

const CardManagerTemplate = () => {
  const searchParams = useSearchParams();
  const folderId = searchParams.get('folderId');
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn === false) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn === null) return null; // or a loading spinner

  return (
    <SC.Container>
      <CardManager initialFolderId={folderId} />
    </SC.Container>
  );
};

export default CardManagerTemplate;
