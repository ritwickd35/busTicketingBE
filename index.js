const express = require('express');
const mongoose = require('mongoose')

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
    console.log('here')
    app.get('/', (req, res) => {
        console.log("hello world")
        res.send("hello world")
    })
})

module.exports = app

