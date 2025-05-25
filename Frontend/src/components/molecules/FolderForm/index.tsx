import React, { useState } from "react";
import * as SC from "./styles";
import { FolderFormProps } from "./types";
import Button from "@/components/atoms/Button";

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
            <Button $variant="accept" type="submit">
            {isEdit ? "Save" : "Add"}
            </Button>
            {isEdit && onDelete && (
            <Button $variant="deny" type="button" onClick={onDelete}>
                Delete
            </Button>
            )}
            <Button $variant="secondary" type="button" onClick={onCancel}>
            Cancel
            </Button>
        </SC.ButtonRow>
        </SC.Form>
    );
};

export default FolderForm;