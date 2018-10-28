const express = require ("express");
const path = require ('path');
const bodyPaser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require ('./config/database');


// Connection to database
mongoose.connect(config.database);

mongoose.connection.on('connected',()=>{
    console.log('Connected to database '+config.database);
});

mongoose.connection.on('error', (err)=>{
    console.log('Database error: '+err);
})


const app = express();

const users = require('./routes/users');


//Server Port Number
const port = 3000;
app.use(cors());

//Set Static folder
app.use(express.static(path.join(__dirname,'public')));


//Body Paser Middleware
app.use(bodyPaser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users',users);

//Index routR
app.get('/',(req,res)=>{
    res.send('Invalid Enpoint');
})

//Start Server
app.listen(port,()=>{
    console.log('Server started on port: '+port);
})