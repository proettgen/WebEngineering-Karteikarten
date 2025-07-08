import React, { useCallback } from "react";
import Folder from "../Folder";
import * as SC from "./styles";
import { FolderListProps } from "./types";

const FolderList = React.memo(({
  folders,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onFolderClick,
  showOnlyNames = false, // NEU
}: FolderListProps & { onFolderClick?: (_folder: any) => void; showOnlyNames?: boolean }) => {
  const handleFolderClick = useCallback((folder: any) => {
    if (onFolderClick) {
      onFolderClick(folder);
    }
  }, [onFolderClick]);

  return (
    <SC.FolderList>
      {folders.map((folder, index) =>
        showOnlyNames ? (
          <SC.FolderListItem key={index}>
            <button
              style={{ width: "100%", padding: "12px", fontSize: "1.1em" }}
              onClick={() => handleFolderClick(folder)}
            >
              {folder.name}
            </button>
          </SC.FolderListItem>
        ) : (
          <div key={index} onClick={() => handleFolderClick(folder)}>
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
});

FolderList.displayName = 'FolderList';

export default FolderList;
