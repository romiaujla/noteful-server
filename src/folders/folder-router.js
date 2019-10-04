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
    
module.exports = folderRouter;