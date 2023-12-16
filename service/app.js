const express = require('express');
const app = express();

app.use(express.json());

//Controllers
const users = require('./controllers/users');
const db = require("./db/models")

// Rotas API
app.use('/', users)


app.listen(8080, () => {
    console.log("Servidor iniciado na porta 8080: http://localhost:8080")
})