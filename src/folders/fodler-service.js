const FOLDERS_TABLE = 'folders';
const NOTES_TABLE = 'notes';
const FolderServices = {
    getAllFolders(db){
        return db(FOLDERS_TABLE);
    },
    getNotesByFolderId(db, folder_id){
        return db(NOTES_TABLE)
            .where('folder_id', folder_id);
    },
    addNewFolder(db, newFolder){
        return db(FOLDERS_TABLE)
            .insert(newFolder)
            .returning('*')
            .then((rows) => rows[0]);
    }
}

module.exports = FolderServices;