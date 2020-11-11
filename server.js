const express = require('express'); // Importa a biblioteca
const server = express(); // Cria um servidor
const path = require('path'); //pega o caminho do arquivo pra vc
const cors = require("cors"); //resolve ataque cors

server.use(express.json());
server.use(cors());

let participants = [];
let cameIntoRoom = [];

server.post("/participants", (req, res) => {
    console.log(req.body);
    const { name } = req.body;

    if (name === " ") {
        res.sendStatus(400);
    } else {
        participants.push({name: name, lastStatus: Date.now()})
        cameIntoRoom.push(
            { from: name, 
            to: 'Todos', 
            text: 'entra na sala...', 
            type: 'status', 
            time: 'HH:MM:SS'}
        );
        
        
        
    }
    res.send(`<h1>Olá Paola!</h1>`)
    console.log(participants);
    console.log(cameIntoRoom);
})

// Configura o servidor para rodar na porta 3000
server.listen(5000);