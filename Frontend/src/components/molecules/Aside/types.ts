import { Folder } from "@/database/folderTypes";
import { SortOption } from "@/components/atoms/SortButton/types";

export interface AsideProps {
    folders: Folder[];
    selectedFolderId: string | null;
    searchTerm: string;
    sortOption: SortOption;
    onFolderSelect: (_folderId: string | null) => void;
    onSearch: (_searchValue: string) => void;
    onSort: (_sortOption: SortOption) => void;
    onAddFolder: () => void;
    loading?: boolean;
}
