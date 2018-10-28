const mongoose = require ('mongoose');
const bcrypt = require ('bcryptjs');
const config = require ('../config/database');

//Patient Schema
const PatientSchema = mongoose.Schema({
    firstname:{
        type: String,
        required:true
    },
    lastname:{
        type: String,
        required:true
    },
    username:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    age:{
        type: String,
        required:true
    },
    contact:{
        type: String,
        required:true
    },
    bloodgroup:{
        type: String,
        required:true
    },

});

const Patient = module.exports = mongoose.model('Patient',PatientSchema);

module.exports.getUserById = function(username,callback){
    const query = {username:username}
    User.findOne(query,callback);
}

module.exports.addPatient = function(newPatient,callback){
    bcrypt.genSalt(10,(err, salt)=>{
        bcrypt.hash(newPatient.password,salt,(err,hash) =>{
            if(err) throw err;
            newPatient.password= hash;
            newPatient.save(callback);
        });
    });
}

module.exports.comparePassword = function ( candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword,hash,(err,isMatch)=>{
        if(err) throw err;
        callback (null, isMatch);
    });
}