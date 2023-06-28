const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const bodyParser = require('body-parser')

// create application/json parser
const jsonParser = bodyParser.json()

const mongo_URL = 'mongodb://127.0.0.1:27017/busTicketing'

async function main() {
    await mongoose.connect(mongo_URL);
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const app = express()

const port = 3000;

app.listen(port, () => {
    console.log("listening on port", port)
})

main().then(() => {
    app.use(jsonParser)
    app.get('/test', (req, res) => {
        console.log("hello world")
        res.send("hello world")
    })
    app.use('/', routes)
})

module.exports = app

