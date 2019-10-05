require('dotenv').config();
const NotesService = require('../src/notes/note-service');
const knex = require('knex');
const app = require('../src/app');
const { makeFoldersArray } = require('./fixtures/folders-fixtures');
const { makeNotesArrayForServices } = require('./fixtures/notes-fixtures');


describe(`\n\nNOTES SERVICE TESTS`, ()=>{

    let db = '';
    let testFolders = makeFoldersArray();
    let testNotes = makeNotesArrayForServices();
    const FOLDER_TABLE = 'folders';
    const NOTES_TABLE = 'notes';

    before(`Create knex instance`, ()=>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db);
    });

    after(`Disconnect from db`, ()=>{
        return db.destroy();
    });

    beforeEach(`Clean the Notes and Folders table`, ()=>{
        return db.raw(`TRUNCATE TABLE notes, folders RESTART IDENTITY`);
    });

    afterEach(`Clean the Notes and Folders Table`, ()=>{
        return db.raw(`TRUNCATE TABLE notes, folders RESTART IDENTITY`);
    });

    context(`Given notes table has data`, ()=>{
        
        beforeEach(`Insert data into folders`, ()=>{
            return db(FOLDER_TABLE)
                .insert(testFolders);
        });

        beforeEach(`Insert data into folders`, ()=>{
            return db(NOTES_TABLE)
                .insert(testNotes);
        });

        it(`getAllNotes() - return an array of notes`, ()=>{
            return NotesService.getAllNotes(db)
                .then((notes) => {
                    expect(notes).to.deep.eql(testNotes);
                });
        });

        it(`deleteNote() - deletes the correct note`, ()=>{
            const id = 1;
            const expectedNotes = testNotes.filter(note => note.id !== id);
            return NotesService.deleteNote(db, id)
                .then((res) => {
                    return NotesService.getAllNotes(db)
                        .then((notes) => {
                            expect(notes).to.deep.eql(expectedNotes);
                        });
                })
        });

        it(`getById() - gets the correct note`, ()=>{
            const id = 4;
            const expectedNote = testNotes[id-1];
            return NotesService.getNotesById(db, id)
                .then((note) => {
                    expect(note).to.deep.eql(expectedNote);
                })
        })
    });

    context(`Given notes table has NO data`, ()=>{
        
        beforeEach(`Insert data into folders table`, ()=>{
            return db(FOLDER_TABLE)
                .insert(testFolders);
        });

        it(`getAllNotes() - returns an empty array`, ()=>{
            return NotesService.getAllNotes(db)
                .then((notes) => {
                    expect(notes).to.eql([]);
                });
        });

        it(`addNewNote() - adds a new note with an id`, ()=>{
            // this.retries(4); - keeps giving an error
            // if modified is not defined the actual date
            // and expected date keeps having a difference 
            // of about 5-3 milliseconds, and the test kept failing
            const newNote = {
                name: 'Test Note',
                content: 'Test Content',
                folder_id: 2,
                modified: new Date() //so just assigned modified a new date to match
            }

            return NotesService.addNewNote(db, newNote)
                .then((addedNote) => {
                    expect(addedNote).to.eql({
                        id: 1,
                        name: newNote.name,
                        content: newNote.content,
                        folder_id: newNote.folder_id,
                        modified: newNote.modified
                    });
                });
        });

        it(`getById() - returns undefined`, ()=>{
            const id = 4;
            return NotesService.getNotesById(db, id)
                .then((note) => {
                    expect(note).to.deep.eql(undefined);
                })
        });
    });
});