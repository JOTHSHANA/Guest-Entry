const express = require('express');
const app = express();
const path = require("path");
const cors = require('cors')
const bodyParser = require('body-parser');
const session = require("express-session");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const db = require('./config/db');
const resources = require('./routes/auth/res_route');
const passport = require("passport");
const passportConfig = require("./config/passport")
const resourceRoutes = require('./routes/resourceRoutes');
const auth = require('./routes/auth/auth')
const guestDetails = require('./routes/formDetailsRoutes')

app.use(
    session({
        secret: "this is my secrect code",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
    })
);


app.use(passport.initialize());
app.use(passport.session());

const cors_config = {
    origin: "*",
};
app.use(cors(cors_config));
app.use(express.json());
app.use(bodyParser.json());

app.use(`${process.env.API}/api`, resources);
app.use(`${process.env.API}/api/auth`, auth);
app.use(`${process.env.API}/api`, guestDetails);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;

