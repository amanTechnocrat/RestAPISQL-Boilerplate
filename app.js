const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const router = require('./routes');
require('dotenv').config()
const app = express(); //App Initailization to Express 

function startserver() {
    //All Important Library Initailization to App
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(express.json())
    var enableCORS = function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('strict-origin-when-cross-origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
        res.header('Access-Control-Allow-Headers', '*');
        res.header("Access-Control-Allow-Credentials", "*");
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        if ('OPTIONS' === req.method) {
            res.sendStatus(200);
        } else {
            next();
        }
    };
    //For Tackling the CORS Policy
    app.use(enableCORS);
 
    //ALl APIRoutes Initialization to the app
    app.use('/api', router)

    //If you wanted to Render any Static HTML file on Node JS Server then use this 
    app.get('*', (req, res) => {
        const filePath = path.join(__dirname, '/build/index.html');
        if (filePath && fs.existsSync(filePath)) {
            return res.sendFile(filePath);
        }
        return res.send('Website is under maintaince!');
    });

    //App listening to Port
    app.listen(config.NODE_PORT, (err) => {
        if (err) { console.log(err) }
        else { console.log(`server listening on port ${config.NODE_PORT}`) }
    })
}

startserver()