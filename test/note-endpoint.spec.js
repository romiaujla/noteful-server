const app = require('../src/app');
const { makeFoldersArray } = require('./fixtures/folders-fixtures');
const { makeNotesArrayForEndpoints } = require('./fixtures/notes-fixtures');
const knex = require('knex');

describe(`\n\nNOTES ENDPOINTS`, ()=>{

    let db;
    const testFolders = makeFoldersArray();
    const testNotes = makeNotesArrayForEndpoints();
    const FOLDERS_TABLE = 'folders';
    const NOTES_TABLE = 'notes';

    before(`Create knex instance`, ()=>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db);
    });

    after(`Destroy the db`, ()=>{
        return db.destroy();
    });

    beforeEach(`Clean up Folders and Notes table`, ()=>{
        return db.raw(`TRUNCATE TABLE notes, folders RESTART IDENTITY`);
    });

    afterEach(`Clean up Folders and Notes table`, ()=>{
        return db.raw(`TRUNCATE TABLE notes, folders RESTART IDENTITY`);
    });

    describe(`/notes ENDPOINT`, ()=>{

        context(`Given notes has no data`, ()=>{

            beforeEach(`Insert data into folders`, ()=>{
                return db(FOLDERS_TABLE)
                    .insert(testFolders);
            });

            it(`GET /notes - resolves and returns empty array`, ()=>{
                return request(app)
                    .get('/notes')
                    .expect(200)
                    .then((res) => {
                        expect(res.body).to.eql([]);
                    });
            });

            it(`POST /notes - adds a new note with an id`, ()=>{
                const newNote = {
                    name: 'Test Note',
                    content: 'Test Content',
                    folder_id: 2
                }
                return request(app)
                    .post('/notes')
                    .send(newNote)
                    .expect(201)
                    .then((res) => {
                        expect(res.body.id).to.eql(1);
                        expect(res.body.name).to.eql(newNote.name);
                        expect(res.body.content).to.eql(newNote.content);
                        expect(res.body.folder_id).to.eql(newNote.folder_id);
                        const actualDate = new Date(res.body.modified).toLocaleString();
                        const expectedDate = new Date().toLocaleString();
                        expect(actualDate).to.eql(expectedDate);
                    });
            });

        });

        context(`Given notes has data`, ()=>{
            
            beforeEach(`Insert data into folders`, ()=>{
                return db(FOLDERS_TABLE)
                    .insert(testFolders);
            });

            beforeEach(`Insert data into notes`, ()=>{
                return db(NOTES_TABLE)
                    .insert(testNotes);
            });

            it(`GET /notes - returns all the notes`, ()=>{
                return request(app)
                    .get('/notes')
                    .expect(200)
                    .then((res) => {
                        expect(res.body).to.deep.eql(testNotes);
                    });
            })
        });

    });

    describe(`/notes/:id ENDPOINT`, ()=>{

        context(`Given notes has no data`, ()=>{

            beforeEach(`Insert data into folders`, ()=>{
                return db(FOLDERS_TABLE)
                    .insert(testFolders);
            });

            it(`GET /notes/:id - should return 404 and not found message`, ()=>{
                const id = 1234;
                return request(app)
                    .get(`/notes/${id}`)
                    .expect(404, {
                        error: {
                            message: `Requested Note could not be found`
                        }
                    })
            })
            
        });

        context(`Given notes has data`, ()=>{

            beforeEach(`Insert data into folders`, ()=>{
                return db(FOLDERS_TABLE)
                    .insert(testFolders);
            });

            beforeEach(`Insert data into notes`, ()=>{
                return db(NOTES_TABLE)
                    .insert(testNotes);
            });

        });

    });

});