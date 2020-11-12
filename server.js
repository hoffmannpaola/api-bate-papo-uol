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
    
    console.log(participants);
    
    
})


server.get("/messages", (req, res) => {
    res.send(messages);
    console.log(messages);
})


// server.post("/messages", (req, res) => {
//     const { from, to, text, type } = req.body;
//     console.log(text);
//     if (  from == " " || to == " " || text == " ") {
//         return res.status(400).send("String Vazia");
//     }

//     const participantValidation = participants.some(p => p.name === from);
//     console.log(participantValidation);
//     if (participantValidation) {
//         if  (type === 'message' || type === 'private_message')  {

//             const { result } = stripHtml(from);
//             const { result } = stripHtml(to);
//             const { result } = stripHtml(text);
//             const { result } = stripHtml(type);
//             console.log(result)
//             messages.push(
//                 { from,
//                 to,
//                 text, 
//                 type, 
//                 time: dayjs().format('HH:mm:ss')}
//             ); 
//             return res.sendStatus(200);    
//         }
//     }
//     return res.status(400).send("Não atendeu a tudo");
// })


// Configura o servidor para rodar na porta 3000
server.listen(3000);