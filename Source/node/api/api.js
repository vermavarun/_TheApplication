const os = require('os')
const express = require('express');
var cors = require('cors')
require('dotenv').config()
const app = express();
app.use(cors())
const port = 3000;

// Create the getGreeting function
function add(req, res) {
    console.log(`${process.env.APP_SERVICE_URL}/add?num1=${req.query.num1}`)
    num1 = req.query.num1
    num2 = req.query.num2
    fetch(process.env.APP_SERVICE_URL+`/add?num1=${num1}&num2=${num2}`)
    .then(response => response.text())
    .then(text => {
        res.send(text);
    })
    .catch(error => {
        res.send(error)
        console.error(error)
    });
}

function sub(req, res) {
    num1 = req.query.num1
    num2 = req.query.num2
    fetch(process.env.APP_SERVICE_URL+`/sub?num1=${num1}&num2=${num2}`)
    .then(response => response.text())
    .then(text => {
        res.send(text);
    })
    .catch(error => {
        res.send(error)
        console.error(error)
    });
}

function mul(req, res) {
    num1 = req.query.num1
    num2 = req.query.num2
    fetch(process.env.APP_SERVICE_URL+`/mul?num1=${num1}&num2=${num2}`)
    .then(response => response.text())
    .then(text => {
        res.send(text);
    })
    .catch(error => {
        res.send(error)
        console.error(error)
    });
}

function div(req, res) {
    num1 = req.query.num1
    num2 = req.query.num2
    fetch(process.env.APP_SERVICE_URL+`/div?num1=${num1}&num2=${num2}`)
    .then(response => response.text())
    .then(text => {
        res.send(text);
    })
    .catch(error => {
        res.send(error)
        console.error(error)
    });
}

function getRootAppMessage(req,res) {
    fetch(process.env.APP_SERVICE_URL)
    .then(response => response.text())
    .then(text => {
        res.send(`Node running on ${os.hostname()} ${text}`);
    })
    .catch(error => {
        res.send(error)
        console.error(error)
    });
}

app.get('/',getRootAppMessage);
app.get('/add', add);
app.get('/sub', sub);
app.get('/mul', mul);
app.get('/div', div);

// Start the server

app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});
