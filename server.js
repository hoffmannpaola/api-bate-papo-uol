const express = require('express'); // Importa a biblioteca
const server = express(); // Cria um servidor

const cors = require("cors"); //resolve ataque cors
const stripHtml = require("string-strip-html");
const dayjs = require('dayjs')

// console.log(dayjs().format('HH:mm:ss') )
//push add ao final de um array, ou seja, embaixo.

server.use(express.json());
server.use(cors());

let participants = [];

const messages = [ { 
    from: 'Maravilha',
    to: 'Todos',
    text: 'entra na sala...',
    type: 'status',
    time: '21:49:20' },
    { from: 'Birigui',
    to: 'Todos',
    text: 'entra na sala...',
    type: 'status',
    time: '21:46:33' }
];
// console.log(messages);

server.post("/participants", (req, res) => {
    
    const { name } = req.body;
    
    if (name === " ") {
        return res.sendStatus(400);
    } else {
        const { result } = stripHtml(name);
        participants.push({name: result, lastStatus: Date.now()}) 
        messages.push(
            { from: result, 
            to: 'Todos', 
            text: 'entra na sala...', 
            type: 'status', 
            time: dayjs().format('HH:mm:ss')}
        ); 
        res.sendStatus(200);
    }
    
    // console.log(participants);
    
    
})


server.get("/messages", (req, res) => {
    const limit = req.query.limit || -100;
    const filteredMessages = messages.slice(0, limit)
    res.send(messages.slice(filteredMessages));
    
})


server.post("/messages", (req, res) => {
    const arrayMessage = [req.body];

    arrayMessage.forEach(item => {
        if (item.from !== " "){
            const { result } = stripHtml(item.from);
            item.from = result.trim();
        } else {
            return res.status(400).send("String Vazia");
        }

        if (item.to !== " ") {
            const { result } = stripHtml(item.to);
            item.to = result.trim();
        } else {
            return res.status(400).send("String Vazia");
        }

        if (item.text !== " ") {
            const { result } = stripHtml(item.text);
            item.text = result.trim();
        } else {
            return res.status(400).send("String Vazia");
        }

        if (item.type !== " ") {
            const { result } = stripHtml(item.type);
            item.type = result.trim();
        } else {
            return res.status(400).send("String Vazia");
        }
    });

    const objFromMessage = arrayMessage[0];
    

    const participantValidation = participants.some(p => p.name === objFromMessage.from);
    
    if (participantValidation) {
        if  (objFromMessage.type === 'message' || objFromMessage.type === 'private_message')  {
            messages.push(
                { from: objFromMessage.from,
                to: objFromMessage.to,
                text: objFromMessage.text,
                type: objFromMessage.type, 
                time: dayjs().format('HH:mm:ss')}
            ); 
            return res.sendStatus(200);    
        }
    }
    
})

server.get("/participants", (req, res) => {
   res.status(200).send(participants);

})


server.post("/status", (req, res) => {
    const { name } = req.body;

    const participantValidation = participants.some(p => p.name === name);
    
    if (!participantValidation) {
        res.status(400).send("Participante nao consta na lista");
    } else {
        participants = participants.filter(p => p.name !== name);
        participants.push({name, lastStatus: Date.now()}) 
        res.sendStatus(200);
    }
    
 })
 

// Configura o servidor para rodar na porta 3000
server.listen(3000);