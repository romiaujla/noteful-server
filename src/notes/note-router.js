const express = require('express');
const bodyParser = express.json();
const noteRouter = express.Router();
const NotesServices = require('./note-service');

noteRouter
    .route('/')
    .get((req, res, next) => {
        const db = req.app.get('db');
        NotesServices.getAllNotes(db)
            .then((notes) => {
                res.json(notes);
            })
            .catch(next);
    })
    .post(bodyParser, (req, res, next)=>{
        const db = req.app.get('db');
        const { name, content, folder_id } = req.body;
        const newNote = {
            name,
            content,
            folder_id
        }
        NotesServices.addNewNote(db, newNote)
            .then((addedNote) => {
                res
                    .status(201)
                    .send(addedNote);
            })
            .catch(next);

    })

noteRouter
    .route('/:id')
    .get((req, res, next) => {
        const db = req.app.get('db');
        const { id } = req.params;
        NotesServices.getNotesById(db, id)
            .then((note) => {
                if(!note){
                    res
                        .status(404)
                        .json({
                            error: {
                                message: `Requested Note could not be found`
                            }
                        })
                }
                res.json(note);
            })
            .catch(next);
    })
    .delete((req, res, next) => {
        const db = req.app.get('db');
        const { id } = req.params;
        NotesServices.deleteNote(db, id)
            .then((deletedNote) => {
                res
                    .status(204)
                    .end();
            })
            .catch(next);
    })

module.exports = noteRouter;