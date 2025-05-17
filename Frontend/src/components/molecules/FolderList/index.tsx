import React from "react";
import Folder from "../Folder";
import * as SC from "./styles";
import { FolderListProps } from "./types";

const FolderList = ({
  folders,
  onAddCard,
  onEditCard,
  onDeleteCard,
}: FolderListProps) => (
  <SC.FolderList>
    {folders.map((folder, index) => (
      <Folder
        key={index}
        name={folder.name}
        cards={folder.cards}
        onAddCard={onAddCard}
        onEditCard={onEditCard}
        onDeleteCard={onDeleteCard}
      />
    ))}
  </SC.FolderList>
);
export default FolderList;
