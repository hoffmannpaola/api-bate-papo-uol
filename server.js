const express = require('express'); 
const cors = require('cors'); 
const stripHtml = require('string-strip-html');
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');

const server = express(); // Cria um servidor
server.use(express.json());
server.use(cors());

setInterval(automaticRemoval, 15000);

const pathParticipants = path.resolve("./data/participants.json");
const fileContentParticipants = fs.readFileSync(pathParticipants)
let participants = JSON.parse(fileContentParticipants);

const pathMessages = path.resolve("./data/messages.json");
const fileContentMessages = fs.readFileSync(pathMessages)
let messages = JSON.parse(fileContentMessages);

server.post("/participants", (req, res) => {
    
    const { name } = req.body;
    const clearName = clearHTML(name);
    
    if (clearName == '') {
        return res.sendStatus(400);
    } else {
        participants.push({name: clearName, lastStatus: Date.now()}) 
        const newFileContentP = JSON.stringify(participants);  
        fs.writeFileSync(pathParticipants, newFileContentP);  

        messages.push(
            { from: clearName, 
            to: 'Todos', 
            text: 'entra na sala...', 
            type: 'status', 
            time: dayjs().format('HH:mm:ss')}
        ); 

        const newFileContentM = JSON.stringify(messages);  
        fs.writeFileSync(pathMessages, newFileContentM);  

        res.sendStatus(200);
    };
    
});


server.get("/messages", (req, res) => {

    const name = req.headers["user-name"];

    const filteredMessages = [];

    messages.forEach(msg => {
        if(msg.type === "private_message") {
            if(msg.from === name || msg.to === name || msg.to === "Todos") {
                filteredMessages.push(msg);
            }
        } else {
            filteredMessages.push(msg);
        }
    });

    const limit = req.query.limit || -100;
    const limitedMessages = filteredMessages.slice(0, limit);
    res.send(filteredMessages.slice(limitedMessages));
});


server.post("/messages", (req, res) => {
    const { from, to, text, type } = req.body;

    const clearFrom = clearHTML(from);
    const clearTo = clearHTML(to);
    const clearText = clearHTML(text);
    const clearType = clearHTML(type);

    if ( (clearFrom  == '') && (clearTo == '') && (clearText == '') ) {
        return res.sendStatus(400);
    };
    
    const participantValidation = participants.some(p => p.name === clearFrom);
    
    if (participantValidation) {

        if  (clearType === 'message' || clearType === 'private_message')  {

            messages.push(
                { from: clearFrom,
                to: clearTo,
                text: clearText,
                type: clearType, 
                time: dayjs().format('HH:mm:ss')}); 

            const newFileContentM = JSON.stringify(messages);  
            fs.writeFileSync(pathMessages, newFileContentM);  

            return res.sendStatus(200);    
        };
    };
});


server.get("/participants", (req, res) => {
   res.status(200).send(participants);
});


server.post("/status", (req, res) => {
    const { name } = req.body;
    const clearName = clearHTML(name);
    const participantValidation = participants.some(p => p.name === clearName);
    
    if (!participantValidation) {
        res.status(400).send("Participante nao consta na lista");
    } else {
        participants = participants.filter(p => p.name !== clearName);
        participants.push({name: clearName, lastStatus: Date.now()});
        const newFileContentP = JSON.stringify(participants);  
        fs.writeFileSync(pathParticipants, newFileContentP);  

        res.sendStatus(200);
    };
});
 

function clearHTML(param) {
    const { result } = stripHtml(param);
    return result;
};

 
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
                    time: dayjs().format('HH:mm:ss')});

                const newFileContentM = JSON.stringify(messages);  
                fs.writeFileSync(pathMessages, newFileContentM);  
               
            };
        });
        console.log(participants);
    }; 
};

// Configura o servidor para rodar na porta 3000
server.listen(3000);