import React from "react";
import { useSearchParams } from "next/navigation";
import CardManager from "../../organisms/CardManager";
import * as SC from "./styles";

const CardManagerTemplate = () => {
  const searchParams = useSearchParams();
  const folderId = searchParams.get('folderId');

  return (
    <SC.Container>
      <CardManager initialFolderId={folderId} />
    </SC.Container>
  );
};

export default CardManagerTemplate;
