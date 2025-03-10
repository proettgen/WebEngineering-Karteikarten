import React from "react";
import Folder from "../Folder";
import * as SC from "./styles";
import { FolderListProps } from "./types";

export default function FolderList({ folders, onAddCard, onEditCard, onDeleteCard }: FolderListProps) {
  return (
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
}