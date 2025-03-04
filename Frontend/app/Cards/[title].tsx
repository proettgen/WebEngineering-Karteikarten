import React from "react";
import { useRouter } from "next/router";
import CardTemplate from "../../src/components/templates/CardTemplate/CardTemplate";

function CardDetail() {
  const router = useRouter();
  const { title } = router.query;

  // Beispielinhalt
  const content = "Hier werden die Details der Karteikarte angezeigt.";

  return (
    <CardTemplate title={title as string} content={content} />
  );
}

export default CardDetail;