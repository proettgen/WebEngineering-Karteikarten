//Test Data was changed to UUIDs, this script converts the folder IDs in the mockFolders.json file to UUIDs.
//This is useful for testing purposes, as the application expects UUIDs for folder IDs.
//Otherwise this file can be ignored
//Most of the scripts can be ignored, as they were used to initially set up the database and the mock data.
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

interface Folder {
    id: string;
    name: string;
    parentId: string | null;
    createdAt: string;
    lastOpenedAt: string;
}

interface FolderData {
    folders: Folder[];
}

function isFolderData(obj: unknown): obj is FolderData {
    return typeof obj === 'object' &&
        obj !== null &&
        Array.isArray((obj as FolderData).folders);
}

async function main() {
    // Convert folders
    const folderFilePath = path.join(__dirname, '../src/data/mockFolders.json');
    const folderRaw = await fs.readFile(folderFilePath, 'utf-8');

    const folderParsed = JSON.parse(folderRaw) as unknown;
    if (!isFolderData(folderParsed)) {
        throw new Error('JSON does not match FolderData structure');
    }
    const folderData: FolderData = folderParsed;

    const idMap: Record<string, string> = {};
    for (const folder of folderData.folders) {
        idMap[folder.id] = uuidv4();
    }

    // Update folder IDs and parent references
    for (const folder of folderData.folders) {
        folder.id = idMap[folder.id];
        if (folder.parentId) {
            folder.parentId = idMap[folder.parentId];
        }
    }

    // Write updated folders
    await fs.writeFile(folderFilePath, JSON.stringify(folderData, null, 2));
    console.log('Folder-IDs zu UUIDs konvertiert:', folderFilePath);

interface CardStack {
    folderId: string;
    lastedLearned: string;
    cards: Array<{
        id: string;
        title: string;
        question: string;
        answer: string;
        currentLearingLevel: number;
        createdAt: string;
        tags: string[] | null;
    }>;
    learnProgress: Record<string, number>;
}

// ...existing code...

    // Update card stack with new folder ID
    const cardFilePath = path.join(__dirname, '../src/data/mockCardStack.json');
    const cardRaw = await fs.readFile(cardFilePath, 'utf-8');
    const cardData = JSON.parse(cardRaw) as CardStack;
    
    // Use the first folder ID (Mathematics) for our cards
    const firstFolderId = folderData.folders[0].id;
    cardData.folderId = firstFolderId;
    
    await fs.writeFile(cardFilePath, JSON.stringify(cardData, null, 2));
    console.log('Card folderId aktualisiert:', cardFilePath);
    console.log('Verwendete folderId für Cards:', firstFolderId);
}

void main();