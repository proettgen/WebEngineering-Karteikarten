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
    const filePath = path.join(__dirname, '../data/mockFolders.json');
    const raw = await fs.readFile(filePath, 'utf-8');

    const parsed = JSON.parse(raw) as unknown;
    if (!isFolderData(parsed)) {
        throw new Error('JSON does not match FolderData structure');
    }
    const data: FolderData = parsed;

    const idMap: Record<string, string> = {};
    for (const folder of data.folders) {
        idMap[folder.id] = uuidv4();
    }

    for (const folder of data.folders) {
        folder.id = idMap[folder.id];
        if (folder.parentId) {
            folder.parentId = idMap[folder.parentId];
        }
    }

    await fs.writeFile(filePath.replace('.json', '.uuid.json'), JSON.stringify(data, null, 2));
    console.log('Neue UUID-Testdaten geschrieben:', filePath.replace('.json', '.uuid.json'));
}

void main();