import React from "react";
import Folder from "../Folder";
import * as SC from "./styles";
import { FolderListProps } from "./types";

const FolderList = ({
  folders,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onFolderClick,
  showOnlyNames = false, // NEU
}: FolderListProps & { onFolderClick?: (_folder: any) => void; showOnlyNames?: boolean }) => (
  <SC.FolderList>
    {folders.map((folder, index) =>
      showOnlyNames ? (
        <SC.FolderListItem key={index}>
          <button
            style={{ width: "100%", padding: "12px", fontSize: "1.1em" }}
            onClick={() => onFolderClick?.(folder)}
          >
            {folder.name}
          </button>
        </SC.FolderListItem>
      ) : (
        <div key={index} onClick={() => onFolderClick?.(folder)}>
          <Folder
            name={folder.name}
            cards={folder.cards}
            onAddCard={onAddCard}
            onEditCard={onEditCard}
            onDeleteCard={onDeleteCard}
          />
        </div>
      )
    )}
  </SC.FolderList>
);

export default FolderList;
