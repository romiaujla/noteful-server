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

module.exports = noteRouter;