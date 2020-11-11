const express = require('express'); // Importa a biblioteca
const server = express(); // Cria um servidor

const cors = require("cors"); //resolve ataque cors
const stripHtml = require("string-strip-html");
const dayjs = require('dayjs')


// console.log(dayjs().format('HH:mm:ss') )


server.use(express.json());
server.use(cors());

let participants = [];
let cameIntoRoom = [];

server.post("/participants", (req, res) => {
    
    const { name } = req.body;
    

    if (name === " ") {
        res.sendStatus(400);
    } else {
        const { result } = stripHtml(name);
    
        participants.push({name: result, lastStatus: Date.now()})

        cameIntoRoom.push(
            { from: result, 
            to: 'Todos', 
            text: 'entra na sala...', 
            type: 'status', 
            time: dayjs().format('HH:mm:ss')}
        );
        
    }
    res.status(200);
    console.log(participants);
    console.log(cameIntoRoom);
    
})

// Configura o servidor para rodar na porta 3000
server.listen(5000);