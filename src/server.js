const app = require('./app');
const {PORT, NODE_ENV, DATABASE_URL} = require('./config');

// Creating the knex instance
const knex = require('knex');
const db = knex({
    client: 'pg',
    connection: DATABASE_URL
});

app.set('db', db);

app.use((error, req, res, next) => {
    console.log(error);
    let response = {};
    if(NODE_ENV === 'production'){
        response = {
            error: {
                message: `Server Error`
            }
        }
    }else{
        response = {error}
    }
    res.status(500).json(response);
})

app.listen(PORT, ()=> {
    console.log(`Sever listening at PORT:${PORT}`);
})