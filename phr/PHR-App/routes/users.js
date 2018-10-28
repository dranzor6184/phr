const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require ('passport');
const jwt = require ('jsonwebtoken');



//Register
router.post('/register',(req,res,next)=>{
    let newPatient= new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        password: req.body.password,
        age: req.body.age,
        contact: req.body.contact,
        bloodgroup: req.body.bloodgroup

    });
    User.addPatient(newPatient, (err, user)=>{
        if(err){
            res.json({success: false, msg:'Failed to Register Patient'});
        }
        else{
            res.json({success: true, msg:'Patient Registered'});
        }
    });

});

//Authenticate
router.get('/authenticate',(req,res,next)=>{
    const username = req.body.username;
    const password = req.body.passport;

    User.getUserById(username, (err, user)=>{
        if(err) throw err;
        if(!user){
            return res.json({success:false, msg : 'user not found'});
        }
        User.comparePassword(password, user.passport,(err, isMatch)=>{
            if(err) throw err;
            if(isMatch){
                const token =jwt.sign(user,config.secret, {
                    expiresIn:604800 //1 week
                });
                res.json({
                    success:true,
                    token: 'JWT '+token,
                    user:{
                        id: user._id,
                        firstname:user.firstname,
                        lastname:user.lastname,
                        username:user.username
                        
                    }
                })
            } else{
                return res.json({success:false, msg : 'Wrong password'});
            }
        });
    });
});

//Register
router.get('/profile',(req,res,next)=>{
    res.send('PROFILE');

});

module.exports = router;