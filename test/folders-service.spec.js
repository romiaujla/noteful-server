require('dotenv').config();
const FolderService = require('../src/folders/fodler-service');
const FOLDER_TABLE = 'folders';
const NOTES_TABLE = 'notes';
const knex = require('knex');
const app = require('../src/app');
const { makeFoldersArray } = require('./fixtures/folders-fixtures');
const { makeNotesArrayForServices } = require('./fixtures/notes-fixtures');

describe(`\n\nFOLDERS SERVICE TESTS`, ()=>{

    let db = '';
    let testFolders = makeFoldersArray();
    let testNotes = makeNotesArrayForServices();

    before(`Create knex instance`, ()=>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
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

    context(`Given the Folders table has data`, ()=>{

        beforeEach(`Add test data to Folders Table`, ()=>{
            return db(FOLDER_TABLE)
                .insert(testFolders);
        });

        beforeEach(`Add test data to Folders Table`, ()=>{
            return db(NOTES_TABLE)
                .insert(testNotes);
        });

        it(`getAllFolders() - Returns all folders in the ${FOLDER_TABLE} table`, ()=>{
            return FolderService.getAllFolders(db)
                .then((folders) => {
                    expect(folders).to.deep.eql(testFolders);
                })
        });

        it(`getNotesByFolderId() - return all the notes in the folder`, ()=>{
            const id = 2;
            const expectedNotes = testNotes.filter(note => note.folder_id === id);
            return FolderService.getNotesByFolderId(db, id)
                .then((actualNotes) => {
                    expect(actualNotes).to.deep.eql(expectedNotes);
                });
        });

    });

    context(`Given there is data in folders table and no data in notes table`, ()=>{

        beforeEach(`Add test data to Folders Table`, ()=>{
            return db(FOLDER_TABLE)
                .insert(testFolders);
        });

        it(`getNotesByFolderId() - returns an empty array`, ()=>{
            const id = 1;
            return FolderService.getNotesByFolderId(db, id)
                .then((notes) => {
                    expect(notes).to.eql([]);
                })
        });
    });

    context(`Given folders and notes have no data`, ()=>{

        it(`getAllFolders() - returns an empty array`, ()=>{
            return FolderService.getAllFolders(db)
                .then((folders) => {
                    expect(folders).to.eql([]);
                })
        });

        it(`addNewFolder() - adds a new folder with an id`, ()=> {
            const expectedFolder = {
                name: 'Test Folder'
            }
            return FolderService.addNewFolder(db, expectedFolder)
                .then((actualFolder) => {
                    expect(actualFolder).to.eql({
                        id: 1,
                        name: expectedFolder.name
                    })
                })
        });
    });
    

})