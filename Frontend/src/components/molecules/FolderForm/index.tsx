import React, { useState } from "react";
import * as SC from "./styles";
import { FolderFormProps } from "./types";

const FolderForm: React.FC<FolderFormProps> = ({
  initialName = "",
  onSave,
  onDelete,
  onCancel,
  isEdit = false,
}) => {
  const [name, setName] = useState(initialName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSave(name.trim());
  };

  return (
    <SC.Form onSubmit={handleSubmit}>
      <SC.Input
        type="text"
        placeholder="Folder Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        autoFocus
      />
      <SC.ButtonRow>
        <SC.SaveButton type="submit">{isEdit ? "Save" : "Add"}</SC.SaveButton>
        {isEdit && onDelete && (
          <SC.DeleteButton type="button" onClick={onDelete}>
            Delete
          </SC.DeleteButton>
        )}
        <SC.CancelButton type="button" onClick={onCancel}>
          Cancel
        </SC.CancelButton>
      </SC.ButtonRow>
    </SC.Form>
  );
};

export default FolderForm;