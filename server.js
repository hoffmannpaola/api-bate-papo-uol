const express = require('express'); // Importa a biblioteca
const server = express(); // Cria um servidor

const cors = require("cors"); //resolve ataque cors
const stripHtml = require("string-strip-html");
const dayjs = require('dayjs')

server.use(express.json());
server.use(cors());

// console.log(dayjs().format('HH:mm:ss') )
//push add ao final de um array, ou seja, embaixo.


setInterval(automaticRemoval, 15000);

let participants = [
    { name: 'Gina', lastStatus: 1605280426827 },
    { name: 'Draco', lastStatus: 1605280426827 },
];


const messages = [ { 
    from: 'Paola',
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
    const clearName = clearHTML(name);
    
    if (clearName == '') {
        return res.sendStatus(400);
    } else {
        participants.push({name: clearName, lastStatus: Date.now()}) 
        messages.push(
            { from: clearName, 
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
    const limit = req.query.limit || -100;
    const filteredMessages = messages.slice(0, limit)
    res.send(messages.slice(filteredMessages));
    
})


server.post("/messages", (req, res) => {
    const { from, to, text, type } = req.body;

    const clearFrom = clearHTML(from);
    const clearTo = clearHTML(to);
    const clearText = clearHTML(text);
    const clearType= clearHTML(type);

    if ( (clearFrom  == '') && (clearTo == '') && (clearText == '') ) {
        return res.sendStatus(400);
    }
    
    const participantValidation = participants.some(p => p.name === clearFrom);
    
    if (participantValidation) {
        if  (clearType === 'message' || clearType === 'private_message')  {
            messages.push(
                { from: clearFrom,
                to: clearTo,
                text: clearText,
                type: clearType, 
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
    const clearName = clearHTML(name);
    const participantValidation = participants.some(p => p.name === clearName);
    
    if (!participantValidation) {
        res.status(400).send("Participante nao consta na lista");
    } else {
        participants = participants.filter(p => p.name !== clearName);
        participants.push({name: clearName, lastStatus: Date.now()}) 
        res.sendStatus(200);
    }
    
 })
 

function clearHTML(param) {
    const { result } = stripHtml(param);
    return result;
}

 
function automaticRemoval() {

    if (participants.length > 0){
        participants.forEach(p => {
            const validation = Date.now() - p.lastStatus;
            
            if (validation > 10000) {
                //expulsar participante
                participants = participants.filter(item => item.name !== p.name);
                messages.push(
                    { from: p.name, 
                    to: 'Todos', 
                    text: 'sai na sala...', 
                    type: 'status', 
                    time: dayjs().format('HH:mm:ss')}
                ); 
               
            }
        })
        console.log(participants);
    } 
}

// Configura o servidor para rodar na porta 3000
server.listen(3000);