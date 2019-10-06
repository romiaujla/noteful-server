require('dotenv').config();
const {NODE_ENV} = require('./config');
const express = require('express');
const morgan = require('morgan');
const cors = require ('cors');
const helmet = require('helmet');
const folderRouter = require('./folders/folder-router');
const noteRouter = require('./notes/note-router');

const app = express();
app.use(cors());	
app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test'
  }));
app.use(helmet());


app.use('/folders', folderRouter);
app.use('/notes', noteRouter);

app.get(`/`, (_,res)=>{
    res.send(`Hello World`);
})

module.exports = app;