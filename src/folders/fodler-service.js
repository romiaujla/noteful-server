const FOLDERS_TABLE = 'fodlers';
const NOTES_TABLE = 'notes';
const FolderServices = {
    getAllFolders(db){
        return db(FOLDERS_TABLE);
    },
    getNotesByFolderId(db, folder_id){
        
    },
}

module.exports = FolderServices;