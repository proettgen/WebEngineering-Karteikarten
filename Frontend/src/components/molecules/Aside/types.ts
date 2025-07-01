import { Folder } from "@/database/folderTypes";
import { SortOption } from "@/components/atoms/SortButton/types";

export interface BreadcrumbItem {
    id: string;
    name: string;
}

export interface AsideProps {
    currentFolders: Folder[];
    currentParentId: string | null;
    selectedFolderId: string | null;
    breadcrumb: BreadcrumbItem[];
    searchTerm: string;
    sortOption: SortOption;
    onFolderSelect: (_folderId: string | null) => void;
    onBreadcrumbNavigate: (_folderId: string | null) => void;
    onSearch: (_searchValue: string) => void;
    onSort: (_sortOption: SortOption) => void;
    onAddFolder: () => void;
    loading?: boolean;
}
