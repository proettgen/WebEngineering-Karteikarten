import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cardAndFolderService } from "@/services/cardAndFolderService";
import Folder from "../../molecules/Folder";
import Modal from "../../molecules/Modal";
import Notification from "../../molecules/Notification";
import * as SC from "./styles";
import Aside from "@/components/molecules/Aside";
import FolderForm from "@/components/molecules/FolderForm";
import { 
  Folder as FolderType, 
  FolderListResponse 
} from "@/database/folderTypes";
import { 
  Card as CardType, 
  CardListResponse 
} from "@/database/cardTypes";
import { FolderProps } from "../../molecules/Folder/types";
import { SortOption } from "@/components/atoms/SortButton/types";
import { BreadcrumbItem } from "@/components/molecules/Aside/types";

// CardManager component with URL-based navigation
interface CardManagerProps {
  initialFolderId?: string | null;
}

const CardManager = React.memo(({
  initialFolderId: _initialFolderId,
}: CardManagerProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current folderId from URL (simplified - no more parentId)
  const urlFolderId = searchParams.get("folderId");
  const [currentFolders, setCurrentFolders] = useState<FolderType[]>([]);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([]);
  const [cardsByFolder, setCardsByFolder] = useState<Record<string, CardType[]>>({});
  const [allFolders, setAllFolders] = useState<FolderType[]>([]); // Store all folders for reference
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("name");
  const [isModalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [editingFolder, setEditingFolder] = useState<{
    name: string;
    id: string | null;
    parentId: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // URL-based navigation helper (simplified)
  const navigateToFolder = useCallback(
    (folderId: string | null) => {
      const url = folderId ? `/cards?folderId=${folderId}` : "/cards";
      router.push(url);
    },
    [router],
  );

  // Get selected folder from URL
  const selectedFolderId = urlFolderId;
  const selectedFolder =
    selectedFolderId && allFolders.length > 0
      ? allFolders.find((f) => f.id === selectedFolderId) || null
      : null;

  // Load root folders on mount - only once
  useEffect(() => {
    // This will be handled by the URL effect when urlFolderId is null
  }, []);

  // Load cards when folder is selected via URL
  useEffect(() => {
    if (selectedFolderId) {
      const loadCards = async () => {
        try {
          const cardsRes: CardListResponse =
            await cardAndFolderService.getCardsByFolder(selectedFolderId);
          setCardsByFolder((prev) => ({
            ...prev,
            [selectedFolderId]: cardsRes.data?.cards || [],
          }));
        } catch {
          // No cards found for folder - that's ok
          setCardsByFolder((prev) => ({
            ...prev,
            [selectedFolderId]: [],
          }));
        }
      };
      loadCards();
    }
  }, [selectedFolderId]); // Only depend on selectedFolderId

  // Handle URL changes - when folderId changes, load folder content
  useEffect(() => {
    const loadFolderContent = async () => {
      if (urlFolderId) {
        // Load subfolders for the selected folder
        setLoading(true);
        try {
          // Always load fresh from API to avoid stale state issues
          const res: FolderListResponse = await cardAndFolderService.getFolders();
          const allFoldersData: FolderType[] = res.data.folders;
          setAllFolders(allFoldersData);

          const childFolders = allFoldersData.filter(
            (folder: FolderType) => folder.parentId === urlFolderId,
          );

          setCurrentFolders(childFolders);
          setCurrentParentId(urlFolderId);

          // Build complete breadcrumb path from root to current folder
          const breadcrumbPath: BreadcrumbItem[] = [];
          let currentId: string | null = urlFolderId;

          while (currentId) {
            const folder = allFoldersData.find((f: FolderType) => f.id === currentId);
            if (folder) {
              breadcrumbPath.unshift({ id: folder.id, name: folder.name });
              currentId = folder.parentId;
            } else {
              break;
            }
          }

          setBreadcrumb(breadcrumbPath);
        } catch {
          setNotification({ message: "Error loading folders!", type: "error" });
        } finally {
          setLoading(false);
        }
      } else {
        // If no folder selected, show root folders
        setLoading(true);
        try {
          const res: FolderListResponse = await cardAndFolderService.getFolders();
          const allFoldersData: FolderType[] = res.data.folders;
          setAllFolders(allFoldersData);

          const rootFolders = allFoldersData.filter(
            (folder: FolderType) => folder.parentId === null,
          );
          setCurrentFolders(rootFolders);
          setCurrentParentId(null);
          setBreadcrumb([]);
        } catch {
          setNotification({ message: "Error loading folders!", type: "error" });
        } finally {
          setLoading(false);
        }
      }
    };

    loadFolderContent();
  }, [urlFolderId]); // Only depend on urlFolderId

  // Handler functions for Aside component
  const handleFolderSelect = useCallback(
    (folderId: string | null) => {
      // Only update the URL - the useEffect will handle loading data
      navigateToFolder(folderId);
    },
    [navigateToFolder],
  );

  // Handler for breadcrumb navigation
  const handleBreadcrumbNavigate = useCallback(
    (folderId: string | null) => {
      // Breadcrumb navigation also selects the folder and shows its content
      handleFolderSelect(folderId);
    },
    [handleFolderSelect],
  );

  const handleSearch = useCallback(
    async (searchValue: string) => {
      setSearchTerm(searchValue);

      if (searchValue.trim() === "") {
        // If search is cleared, reload the current folder context
        const loadFolderContent = async () => {
          setLoading(true);
          try {
            const res: FolderListResponse = await cardAndFolderService.getFolders();
            const allFoldersData: FolderType[] = res.data.folders;
            setAllFolders(allFoldersData);

            if (urlFolderId) {
              const childFolders = allFoldersData.filter(
                (folder: FolderType) => folder.parentId === urlFolderId,
              );
              setCurrentFolders(childFolders);
            } else {
              const rootFolders = allFoldersData.filter(
                (folder: FolderType) => folder.parentId === null,
              );
              setCurrentFolders(rootFolders);
            }
          } catch {
            setNotification({
              message: "Error loading folders!",
              type: "error",
            });
          } finally {
            setLoading(false);
          }
        };
        loadFolderContent();
      } else {
        // Perform global search across all folders
        setLoading(true);
        try {
          const searchRes = await cardAndFolderService.searchFolders(
            searchValue.trim(),
          );
          const searchResults = (searchRes as any).data?.folders || [];
          setCurrentFolders(searchResults);
          // Clear breadcrumb during search
          setBreadcrumb([]);
          setCurrentParentId(null);
        } catch {
          setNotification({
            message: "Error searching folders!",
            type: "error",
          });
          setCurrentFolders([]);
        } finally {
          setLoading(false);
        }
      }
    },
    [urlFolderId],
  );

  const handleSort = useCallback((newSortOption: SortOption) => {
    setSortOption(newSortOption);
    // Sort is handled client-side in Aside component
  }, []);

  // Create or update a folder
  const handleSaveFolder = useCallback(async (folderName: string) => {
    setLoading(true);
    try {
      let allFoldersData: FolderType[];

      if (editingFolder && editingFolder.id) {
        // Update existing folder
        await cardAndFolderService.updateFolder(editingFolder.id, {
          name: folderName,
        });
        setNotification({ message: "Folder updated!", type: "success" });

        // Reload all folders to get updated data
        const res: FolderListResponse = await cardAndFolderService.getFolders();
        allFoldersData = res.data.folders;
        setAllFolders(allFoldersData);

        // The selected folder name should update automatically via selectedFolder calculation
        // No need to change URL since we're updating the same folder
      } else {
        // Create new folder at current level (parentId is currentParentId)
        await cardAndFolderService.createFolder({
          name: folderName,
          parentId: currentParentId,
        });
        setNotification({ message: "Folder created!", type: "success" });

        // Reload all folders first to ensure we have fresh data
        const res: FolderListResponse = await cardAndFolderService.getFolders();
        allFoldersData = res.data.folders;
        setAllFolders(allFoldersData);
      }

      // Reload the current level folders for both create and update
      if (currentParentId === null) {
        const rootFolders = allFoldersData.filter(
          (folder: FolderType) => folder.parentId === null,
        );
        setCurrentFolders(rootFolders);
      } else {
        const childFolders = allFoldersData.filter(
          (folder: FolderType) => folder.parentId === currentParentId,
        );
        setCurrentFolders(childFolders);
      }
    } catch {
      setNotification({ message: "Error saving folder!", type: "error" });
    } finally {
      setLoading(false);
      setEditingFolder(null);
      setModalOpen(false);
    }
  }, [editingFolder, currentParentId]);

  // Delete a folder
  const handleDeleteFolder = useCallback(async () => {
    if (editingFolder && editingFolder.id) {
      setLoading(true);
      try {
        const folderToDelete = editingFolder;
        const folderId = folderToDelete.id!; // We know it's not null because of the if condition

        // If we're currently viewing the folder being deleted, navigate to parent
        const isViewingDeletedFolder = selectedFolderId === folderId;

        await cardAndFolderService.deleteFolder(folderId);
        setNotification({ message: "Folder deleted!", type: "success" });

        // Reload all folders first to ensure we have fresh data
        const res: FolderListResponse = await cardAndFolderService.getFolders();
        const allFoldersData: FolderType[] = res.data.folders;
        setAllFolders(allFoldersData);

        // If we were viewing the deleted folder, navigate to its parent
        if (isViewingDeletedFolder) {
          navigateToFolder(folderToDelete.parentId);
        }

        // Reload the current level folders
        if (currentParentId === null) {
          const rootFolders = allFoldersData.filter(
            (folder: FolderType) => folder.parentId === null,
          );
          setCurrentFolders(rootFolders);
        } else {
          const childFolders = allFoldersData.filter(
            (folder: FolderType) => folder.parentId === currentParentId,
          );
          setCurrentFolders(childFolders);
        }
      } catch {
        setNotification({ message: "Error deleting folder!", type: "error" });
      } finally {
        setLoading(false);
        setEditingFolder(null);
        setModalOpen(false);
      }
    }
  }, [editingFolder, selectedFolderId, navigateToFolder, currentParentId]);

  // Load cards for a specific folder (used in CRUD operations)
  const loadCardsForFolder = useCallback(async (folderId: string) => {
    try {
      const cardsRes = await cardAndFolderService.getCardsByFolder(folderId);
      setCardsByFolder((prev) => ({
        ...prev,
        [folderId]: (cardsRes as any).data?.cards || [],
      }));
    } catch {
      // No cards found for folder - that's ok
      setCardsByFolder((prev) => ({
        ...prev,
        [folderId]: [],
      }));
    }
  }, []);

  // Card operations
  const handleAddCard: FolderProps["onAddCard"] = useCallback(async (
    folderName,
    title,
    question,
    answer,
    tags,
  ) => {
    setLoading(true);
    try {
      // For selected folder, use selectedFolderId directly
      if (selectedFolderId) {
        await cardAndFolderService.createCardInFolder(selectedFolderId, {
          title,
          question,
          answer,
          tags,
          currentLearningLevel: 0,
          folderId: selectedFolderId,
        });
        setNotification({ message: "Card created!", type: "success" });
        await loadCardsForFolder(selectedFolderId); // Reload cards for this folder
      } else {
        setNotification({ message: "No folder selected!", type: "error" });
      }
    } catch {
      setNotification({ message: "Error creating card!", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [selectedFolderId, loadCardsForFolder]);

  const handleEditCard: FolderProps["onEditCard"] = useCallback(async (
    folderName,
    cardIndex,
    newTitle,
    newQuestion,
    newAnswer,
    newTags,
  ) => {
    setLoading(true);
    try {
      // For selected folder, use selectedFolderId directly
      if (selectedFolderId) {
        const card = cardsByFolder[selectedFolderId]?.[cardIndex];
        if (!card) throw new Error("Card not found");
        await cardAndFolderService.updateCardInFolder(
          selectedFolderId,
          card.id,
          {
            title: newTitle,
            question: newQuestion,
            answer: newAnswer,
            tags: newTags,
          },
        );
        setNotification({ message: "Card updated!", type: "success" });
        await loadCardsForFolder(selectedFolderId); // Reload cards for this folder
      } else {
        setNotification({ message: "No folder selected!", type: "error" });
      }
    } catch {
      setNotification({ message: "Error updating card!", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [selectedFolderId, cardsByFolder, loadCardsForFolder]);

  const handleDeleteCard: FolderProps["onDeleteCard"] = useCallback(async (
    folderName,
    cardIndex,
  ) => {
    setLoading(true);
    try {
      // For selected folder, use selectedFolderId directly
      if (selectedFolderId) {
        const card = cardsByFolder[selectedFolderId]?.[cardIndex];
        if (!card) throw new Error("Card not found");
        await cardAndFolderService.deleteCardInFolder(
          selectedFolderId,
          card.id,
        );
        setNotification({ message: "Card deleted!", type: "success" });
        await loadCardsForFolder(selectedFolderId); // Reload cards for this folder
      } else {
        setNotification({ message: "No folder selected!", type: "error" });
      }
    } catch {
      setNotification({ message: "Error deleting card!", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [selectedFolderId, cardsByFolder, loadCardsForFolder]);

  const handleEditFolder = useCallback((folder: FolderType) => {
    setEditingFolder({
      name: folder.name,
      id: folder.id,
      parentId: folder.parentId,
    });
    setModalOpen(true);
  }, []);

  const handleAddFolder = useCallback(() => {
    // Create a new folder at the current level
    setEditingFolder({
      name: "",
      id: null,
      parentId: currentParentId,
    });
    setModalOpen(true);
  }, [currentParentId]);

  // Get the selected folder cards for display (memoized)
  const selectedFolderCards = useMemo(() => 
    selectedFolderId ? cardsByFolder[selectedFolderId] || [] : []
  , [selectedFolderId, cardsByFolder]);

  return (
    <SC.ContentWrapper>
      <Aside
        currentFolders={currentFolders}
        currentParentId={currentParentId}
        selectedFolderId={selectedFolderId}
        breadcrumb={breadcrumb}
        searchTerm={searchTerm}
        sortOption={sortOption}
        onFolderSelect={handleFolderSelect}
        onBreadcrumbNavigate={handleBreadcrumbNavigate}
        onSearch={handleSearch}
        onSort={handleSort}
        onAddFolder={handleAddFolder}
        loading={loading}
      />
      <SC.CardsWrapper>
        {selectedFolder ? (
          <>
            {notification && (
              <Notification
                message={notification.message}
                type={notification.type}
                onDismiss={() => setNotification(null)}
                duration={3000} // 3 seconds
              />
            )}
            {loading ? (
              <div>Loading...</div>
            ) : (
              <Folder
                key={selectedFolder.id}
                name={selectedFolder.name}
                cards={selectedFolderCards}
                onAddCard={handleAddCard}
                onEditCard={handleEditCard}
                onDeleteCard={handleDeleteCard}
                onEditFolder={() => handleEditFolder(selectedFolder)}
              />
            )}
          </>
        ) : (
          <>
            {notification && (
              <Notification
                message={notification.message}
                type={notification.type}
                onDismiss={() => setNotification(null)}
                duration={3000} // 3 seconds
              />
            )}
            <SC.EmptyStateWrapper>
              <SC.EmptyStateTitle>Select a Folder</SC.EmptyStateTitle>
              <SC.EmptyStateText>
                Please select a folder from the sidebar to view its cards.
              </SC.EmptyStateText>
            </SC.EmptyStateWrapper>
          </>
        )}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingFolder(null);
          }}
        >
          <FolderForm
            initialName={editingFolder?.name}
            onSave={handleSaveFolder}
            onDelete={editingFolder ? handleDeleteFolder : undefined}
            onCancel={() => {
              setModalOpen(false);
              setEditingFolder(null);
            }}
            isEdit={!!editingFolder}
          />
        </Modal>
      </SC.CardsWrapper>
    </SC.ContentWrapper>
  );
});

CardManager.displayName = 'CardManager';

export default CardManager;
