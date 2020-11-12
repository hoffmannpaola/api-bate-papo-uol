const express = require('express'); // Importa a biblioteca
const server = express(); // Cria um servidor

const cors = require("cors"); //resolve ataque cors
const stripHtml = require("string-strip-html");
const dayjs = require('dayjs')


// console.log(dayjs().format('HH:mm:ss') )
//push add ao final de um array

server.use(express.json());
server.use(cors());

let participants = [];

const arrayMessages = [ { 
    from: 'Maravilha',
    to: 'Todos',
    text: 'entra na sala...',
    type: 'status',
    time: '21:49:20' },
    { from: 'Motorola',
    to: 'Todos',
    text: 'entra na sala...',
    type: 'status',
    time: '21:46:33' }
];
// console.log(arrayMessages);

server.post("/participants", (req, res) => {
    
    const { name } = req.body;
    
    if (name === " ") {
        return res.sendStatus(400);
    } else {
        const { result } = stripHtml(name);
        participants.push({name: result, lastStatus: Date.now()}) 
        arrayMessages.push(
            { from: result, 
            to: 'Todos', 
            text: 'entra na sala...', 
            type: 'status', 
            time: dayjs().format('HH:mm:ss')}
        ); 
    }
    res.status(200);
    // console.log(participants);
    
    
})


server.get("/teste", (req, res) => {
    res.send([ { 
        from: 'Maravilha',
        to: 'Todos',
        text: 'entra na sala...',
        type: 'status',
        time: '21:49:20' },
        { from: 'Motorola',
        to: 'Todos',
        text: 'entra na sala...',
        type: 'status',
        time: '21:46:33' }
    ]);
    // console.log(arrayMessages);
})

// Configura o servidor para rodar na porta 3000
server.listen(3000);