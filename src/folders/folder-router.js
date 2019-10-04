const express = require('express');
const FolderServices = require('./fodler-service');
const bodyParser = express.json();
const folderRouter = express.Router();

folderRouter
    .route('/')
    .get((req, res, next) => {
        const db = req.app.get('db');
        FolderServices.getAllFolders(db)
            .then((folders) => {
                res.json(folders);
            })
            .catch(next);
    })
    .post(bodyParser, (req, res, next) => {
        const db = req.app.get('db');
        const newFolder = {
            name: req.body.name
        }
        FolderServices.addNewFolder(db, newFolder)
            .then((addedFolder) => {
                res
                    .status(201)
                    .send(addedFolder);
            })
            .catch(next);
    });
    
folderRouter
    .route('/:id')
    .get((req, res, next) => {
        const db = req.app.get('db');
        const { id } = req.params;
        FolderServices.getNotesByFolderId(db, id)
            .then((notes) => {
                res.json(notes);
            })
            .catch(next);
    });

module.exports = folderRouter;