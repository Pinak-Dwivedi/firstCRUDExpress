require('dotenv').config();
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const {errorMiddleware} = require("./middlewares/errorHandler");

// const cookieParser = require("cookie-parser");  //express-session can handle cookie parsing 
const session = require('express-session');
const cors = require('cors');

app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');

app.use(expressLayouts);
app.use(express.urlencoded({ extended : true}));
app.use(express.static(__dirname + '/public'));
app.use(express.json());

// app.use(cookieParser());
app.use(session({
    name: "session.id",
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
        secure: process.env.NODE_ENV === "Development" ? false : true,
        //by default session expires is set to session means tab or browser closes or server restarts
    }
}));

app.use(cors({
    origin: [process.env.frontendURL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));



//setting up index route
const indexRouter = require('./routes/index')
app.use('/', indexRouter);

//setting up users route
const usersRouter = require('./routes/users')
app.use('/users', usersRouter);

app.use(errorMiddleware);


app.listen(process.env.PORT || 3000, (err) => 
{
    console.log('Server is listening at localhost port '+ (process.env.PORT || 3000))
});