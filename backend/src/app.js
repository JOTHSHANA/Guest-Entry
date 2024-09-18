const express = require('express');
const app = express();
const path = require("path");
const cors = require('cors')
const bodyParser = require('body-parser');
const session = require("express-session");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const db = require('./config/db');


const cors_config = {
    origin: "*",
};
app.use(
    session({
        secret: "this is my secrect code",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
    })
);
app.use(cors(cors_config));
app.use(express.json());
app.use(bodyParser.json());


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;

