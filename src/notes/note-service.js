const NOTES_TABLE = 'notes';
const NotesServices = {
    getAllNotes(db){
        return db(NOTES_TABLE);
    },
    getNotesById(db, id){
        return db(NOTES_TABLE)
            .where('id', id)
            .first();
    },
    addNewNote(db, newNote){
        return db(NOTES_TABLE)
            .insert(newNote)
            .returning('*')
            .then((rows) => rows[0]);
    },
    deleteNote(db, id){
        return db(NOTES_TABLE)
            .where({ id })
            .delete();
    },
    updateNote(db, id, newFields){
        return db(NOTES_TABLE)
            .where({ id })
            .update(newFields)
            .first();
    }
}

module.exports = NotesServices;