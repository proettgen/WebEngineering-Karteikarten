import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiService } from "@/services/apiService";
import Folder from "../../molecules/Folder";
import Modal from "../../molecules/Modal";
import Notification from "../../molecules/Notification";
import * as SC from "./styles";
import Aside from "@/components/molecules/Aside";
import FolderForm from "@/components/molecules/FolderForm";
import { Folder as FolderType } from "@/database/folderTypes";
import { FolderProps } from "../../molecules/Folder/types";
import { SortOption } from "@/components/atoms/SortButton/types";
import { BreadcrumbItem } from "@/components/molecules/Aside/types";

// API response types
type GetFoldersResponse = { status: string; data: { folders: FolderType[] } };

// CardManager component with URL-based navigation
interface CardManagerProps {
  initialFolderId?: string | null;
}

const CardManager = ({ initialFolderId: _initialFolderId }: CardManagerProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current folderId from URL (simplified - no more parentId)
  const urlFolderId = searchParams.get('folderId');
  const [currentFolders, setCurrentFolders] = useState<FolderType[]>([]);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([]);
  const [cardsByFolder, setCardsByFolder] = useState<Record<string, any[]>>({});
  const [allFolders, setAllFolders] = useState<FolderType[]>([]); // Store all folders for reference
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("name");
  const [isModalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [editingFolder, setEditingFolder] = useState<{ name: string; id: string | null; parentId: string | null } | null>(null);
  const [loading, setLoading] = useState(false);

  // URL-based navigation helper (simplified)
  const navigateToFolder = useCallback((folderId: string | null) => {
    const url = folderId ? `/cards?folderId=${folderId}` : '/cards';
    router.push(url);
  }, [router]);

  // Get selected folder from URL
  const selectedFolderId = urlFolderId;
  const selectedFolder = selectedFolderId && allFolders.length > 0 
    ? allFolders.find(f => f.id === selectedFolderId) || null 
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
          const cardsRes = await apiService.getCardsByFolder(selectedFolderId);
          setCardsByFolder(prev => ({
            ...prev,
            [selectedFolderId]: (cardsRes as any).data?.cards || []
          }));
        } catch {
          // No cards found for folder - that's ok
          setCardsByFolder(prev => ({
            ...prev,
            [selectedFolderId]: []
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
          const res = await apiService.getFolders();
          const allFoldersData = (res as GetFoldersResponse).data.folders;
          setAllFolders(allFoldersData);
          
          const childFolders = allFoldersData.filter(folder => folder.parentId === urlFolderId);
          
          setCurrentFolders(childFolders);
          setCurrentParentId(urlFolderId);

          // Build complete breadcrumb path from root to current folder
          const breadcrumbPath: BreadcrumbItem[] = [];
          let currentId: string | null = urlFolderId;
          
          while (currentId) {
            const folder = allFoldersData.find(f => f.id === currentId);
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
          const res = await apiService.getFolders();
          const allFoldersData = (res as GetFoldersResponse).data.folders;
          setAllFolders(allFoldersData);
          
          const rootFolders = allFoldersData.filter(folder => folder.parentId === null);
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
  const handleFolderSelect = useCallback((folderId: string | null) => {
    // Only update the URL - the useEffect will handle loading data
    navigateToFolder(folderId);
  }, [navigateToFolder]);

  // Handler for breadcrumb navigation
  const handleBreadcrumbNavigate = useCallback((folderId: string | null) => {
    // Breadcrumb navigation also selects the folder and shows its content
    handleFolderSelect(folderId);
  }, [handleFolderSelect]);

  const handleSearch = useCallback((searchValue: string) => {
    setSearchTerm(searchValue);
    // For now, search only filters the current level of folders
    // A more advanced implementation would search across all folders
  }, []);

  const handleSort = useCallback((newSortOption: SortOption) => {
    setSortOption(newSortOption);
    // Sort is handled client-side in Aside component
  }, []);

  // Create or update a folder
  const handleSaveFolder = async (folderName: string) => {
    setLoading(true);
    try {
      let allFoldersData: FolderType[];
      
      if (editingFolder && editingFolder.id) {
        // Update existing folder
        await apiService.updateFolder(editingFolder.id, { name: folderName });
        setNotification({ message: "Folder updated!", type: "success" });
        
        // Reload all folders to get updated data
        const res = await apiService.getFolders();
        allFoldersData = (res as GetFoldersResponse).data.folders;
        setAllFolders(allFoldersData);
        
        // The selected folder name should update automatically via selectedFolder calculation
        // No need to change URL since we're updating the same folder
        
      } else {
        // Create new folder at current level (parentId is currentParentId)
        const now = new Date().toISOString();
        await apiService.createFolder({ 
          name: folderName, 
          parentId: currentParentId,
          createdAt: now,
          lastOpenedAt: now
        });
        setNotification({ message: "Folder created!", type: "success" });
        
        // Reload all folders first to ensure we have fresh data
        const res = await apiService.getFolders();
        allFoldersData = (res as GetFoldersResponse).data.folders;
        setAllFolders(allFoldersData);
      }
      
      // Reload the current level folders for both create and update
      if (currentParentId === null) {
        const rootFolders = allFoldersData.filter(folder => folder.parentId === null);
        setCurrentFolders(rootFolders);
      } else {
        const childFolders = allFoldersData.filter(folder => folder.parentId === currentParentId);
        setCurrentFolders(childFolders);
      }
    } catch {
      setNotification({ message: "Error saving folder!", type: "error" });
    } finally {
      setLoading(false);
      setEditingFolder(null);
      setModalOpen(false);
    }
  };

  // Delete a folder
  const handleDeleteFolder = async () => {
    if (editingFolder && editingFolder.id) {
      setLoading(true);
      try {
        const folderToDelete = editingFolder;
        const folderId = folderToDelete.id!; // We know it's not null because of the if condition
        
        // If we're currently viewing the folder being deleted, navigate to parent
        const isViewingDeletedFolder = selectedFolderId === folderId;
        
        await apiService.deleteFolder(folderId);
        setNotification({ message: "Folder deleted!", type: "success" });
        
        // Reload all folders first to ensure we have fresh data
        const res = await apiService.getFolders();
        const allFoldersData = (res as GetFoldersResponse).data.folders;
        setAllFolders(allFoldersData);
        
        // If we were viewing the deleted folder, navigate to its parent
        if (isViewingDeletedFolder) {
          navigateToFolder(folderToDelete.parentId);
        }
        
        // Reload the current level folders
        if (currentParentId === null) {
          const rootFolders = allFoldersData.filter(folder => folder.parentId === null);
          setCurrentFolders(rootFolders);
        } else {
          const childFolders = allFoldersData.filter(folder => folder.parentId === currentParentId);
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
  };

  // Load cards for a specific folder (used in CRUD operations)
  const loadCardsForFolder = useCallback(async (folderId: string) => {
    try {
      const cardsRes = await apiService.getCardsByFolder(folderId);
      setCardsByFolder(prev => ({
        ...prev,
        [folderId]: (cardsRes as any).data?.cards || []
      }));
    } catch {
      // No cards found for folder - that's ok
      setCardsByFolder(prev => ({
        ...prev,
        [folderId]: []
      }));
    }
  }, []);

  // Card operations
  const handleAddCard: FolderProps["onAddCard"] = async (folderName, title, question, answer, tags) => {
    setLoading(true);
    try {
      // For selected folder, use selectedFolderId directly
      if (selectedFolderId) {
        await apiService.createCardInFolder(selectedFolderId, {
          title,
          question,
          answer,
          tags,
          currentLearningLevel: 0,
          createdAt: new Date().toISOString()
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
  };

  const handleEditCard: FolderProps["onEditCard"] = async (folderName, cardIndex, newTitle, newQuestion, newAnswer, newTags) => {
    setLoading(true);
    try {
      // For selected folder, use selectedFolderId directly
      if (selectedFolderId) {
        const card = cardsByFolder[selectedFolderId]?.[cardIndex];
        if (!card) throw new Error("Card not found");
        await apiService.updateCardInFolder(selectedFolderId, card.id, {
          title: newTitle,
          question: newQuestion,
          answer: newAnswer,
          tags: newTags
        });
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
  };

  const handleDeleteCard: FolderProps["onDeleteCard"] = async (folderName, cardIndex) => {
    setLoading(true);
    try {
      // For selected folder, use selectedFolderId directly
      if (selectedFolderId) {
        const card = cardsByFolder[selectedFolderId]?.[cardIndex];
        if (!card) throw new Error("Card not found");
        await apiService.deleteCardInFolder(selectedFolderId, card.id);
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
  };

  const handleEditFolder = (folder: FolderType) => {
    setEditingFolder({
      name: folder.name,
      id: folder.id,
      parentId: folder.parentId
    });
    setModalOpen(true);
  };

  const handleAddFolder = useCallback(() => {
    // Create a new folder at the current level
    setEditingFolder({
      name: '',
      id: null,
      parentId: currentParentId
    });
    setModalOpen(true);
  }, [currentParentId]);

  // Get the selected folder cards for display
  const selectedFolderCards = selectedFolderId ? (cardsByFolder[selectedFolderId] || []) : [];

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
              <SC.EmptyStateText>Please select a folder from the sidebar to view its cards.</SC.EmptyStateText>
            </SC.EmptyStateWrapper>
          </>
        )}
        <Modal isOpen={isModalOpen} onClose={() => { setModalOpen(false); setEditingFolder(null); }}>
          <FolderForm
            initialName={editingFolder?.name}
            onSave={handleSaveFolder}
            onDelete={editingFolder ? handleDeleteFolder : undefined}
            onCancel={() => { setModalOpen(false); setEditingFolder(null); }}
            isEdit={!!editingFolder}
          />
        </Modal>
      </SC.CardsWrapper>
    </SC.ContentWrapper>
  );
};

export default CardManager;