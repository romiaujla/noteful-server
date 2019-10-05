require('dotenv').config();
const FolderService = require('../src/folders/fodler-service');
const FOLDER_TABLE = 'folders';
const NOTES_TABLE = 'notes';
const knex = require('knex');
const app = require('../src/app');
const { makeFoldersArray } = require('./fixtures/folders-fixtures');
const { makeNotesArray } = require('./fixtures/notes-fixtures');

describe(`FOLDERS SERVICE TESTS`, ()=>{

    let db = '';
    let testFolders = makeFoldersArray();
    let testNotes = makeNotesArray();

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

    before(`Clean the articles table`, ()=>{
        return db(NOTES_TABLE).truncate();
    });

    before(`Clean the Folders table`, ()=>{
        return db(FOLDER_TABLE).truncate();
    });

    afterEach(`Clean the Notes Table`, ()=>{
        return db(NOTES_TABLE).truncate();
    });

    afterEach(`Clean the Folders Table`, ()=>{
        return db(FOLDER_TABLE).truncate();
    });

    context(`Given the Folders table has data`, ()=>{

        beforeEach(`Add test data to Folders Table`, ()=>{
            return db(FOLDER_TABLE)
                .insert(testFolders);
        });

        it(`getAllFolders() - Returns all folders in the ${FOLDER_TABLE} table`, ()=>{
            return FolderService.getAllFolders(db)
                .then((folders) => {
                    expect(folders).to.be.an('array');
                })
        })

    })
    

})