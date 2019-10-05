const app = require('../src/app');
const knex = require('knex');
const { makeFoldersArray } = require('./fixtures/folders-fixtures');
const { makeNotesArrayForEndpoints } = require('./fixtures/notes-fixtures');

describe(`\n\nFOLDER ENDPOINTS`, ()=>{

    let db;
    const testFolders = makeFoldersArray();
    const testNotes = makeNotesArrayForEndpoints();
    const FOLDER_TABLE = 'folders';
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

    describe(`/folders ENDPOINT`, ()=>{

        context(`Given no data in folders table`, ()=>{
            it(`GET /folders - resolves and returns empty array`, ()=>{
                return request(app)
                    .get('/folders')
                    .expect(200)
                    .then((res)=>{
                        expect(res.body).to.eql([]);
                    })
            })
            it(`POST /folders - resolves and adds a folders with an id`, ()=>{
                const newFolder = {
                    name: 'Test Folder'
                }
                return request(app)
                    .post('/folders')
                    .send(newFolder)
                    .expect(201)
                    .then((res) => {
                        expect(res.body).to.eql({
                            id: 1,
                            name: newFolder.name
                        });
                    })
            })
        });

        context(`Given there is data in folders and no data in notes table`, ()=>{
            beforeEach(`Insert data into folders table`, ()=>{
                return db(FOLDER_TABLE)
                    .insert(testFolders);
            });
            it(`GET /folders - resolves and returns the array of folders`, ()=>{
                return request(app)
                    .get('/folders')
                    .expect(200)
                    .then((res)=>{
                        expect(res.body).to.deep.eql(testFolders);
                    })
            });
        });
    });

    describe(`/folders/:id ENDPOINT`, ()=>{

        context(`Given there is data in folders and no data in notes table`, ()=>{
            beforeEach(`Insert data into folders table`, ()=>{
                return db(FOLDER_TABLE)
                    .insert(testFolders);
            });

            it(`GET /folders/:id - resolves and returns empty notes array`, () => {
                const id = 2;
                return request(app)
                    .get(`/folders/${id}`)
                    .expect(200)
                    .then((res) => {
                        expect(res.body).to.eql([]);
                    })
            });
        });

        context(`Given there is data in folders and notes table`, ()=>{
            beforeEach(`Insert data into folders table`, ()=>{
                return db(FOLDER_TABLE)
                    .insert(testFolders);
            });
            beforeEach(`Insert data into notes table`, ()=>{
                return db(NOTES_TABLE)
                    .insert(testNotes);
            });

            it(`GET /folders/:id - resolves and return all notes in folder`, ()=>{
                const id = 1;
                const expectedNotes = testNotes.filter(note => note.folder_id === id);
                return request(app)
                    .get(`/folders/${id}`)
                    .expect(200)
                    .then((res) => {
                        expect(res.body).to.deep.eql(expectedNotes);
                    })
            });
        }); 
    })

})