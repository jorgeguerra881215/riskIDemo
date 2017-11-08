var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('../models/user');

//Register
router.get('/register',function(req, res){
    res.render('register');
});

//Login
router.get('/login',function(req, res){
    res.render('login');
});
//Manual
router.get('/manual',function(req, res){
    res.render('user_manual', {layout: 'manual.handlebars'});
});
//Manual_letter
router.get('/letter',function(req, res){
    res.render('user_manual_letter', {layout: 'manual.handlebars'});
});

router.get('/list',function(req,res){
    //var user = mongoose.model('User',User);
    //user.find();
    //var users = db.collection('user').find()
    var users = User.getUsers();
    console.log('users:');
    //console.log(users);
    //res.render('users',{'users':users});
    mongoose.model('User').find(function(err,users){
        //res.send(users);
        var sessionId = req.sessionID;
        res.render('users',{'users':users,'sessionId':sessionId});
    });

});

//Register Users
router.post('/register',function(req, res){
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    var token = Math.random().toString(36).substr(2);

    //Validations
    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Email is not valid').isEmail();
    req.checkBody('username','Username is required').notEmpty();
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('password2','Passwords not match').equals(req.body.password);

    var errors = req.validationErrors();
    if(errors){
        //console.log('There is one error');
        res.render('register',{
           errors:errors
        });
    }
    else{
        //console.log('Everything ok, there is not errors');
        var newUser =  new User({
           name:name,
            email:email,
            username:username,
            password:password,
            token:token
        });

        User.createUser(newUser, function(err, user){
           if(err) throw err;
           console.log(user);
        });

        req.flash('success_msg', 'You are registered and can now login')

        res.redirect('/users/login');
    }
});

//Using passport
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'Unknow User'});
            }
            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                }
                else{
                    return done(null, false, {message:'Invalid Password'});
                }
            })
        });
    }
));
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});


//User Login
router.post('/login',
    passport.authenticate('local',{successRedirect:'/',failureRedirect:'/users/login',failureFlash: true}),
    function(req, res) {
        res.redirect('/');
    });

//Logout
router.get('/logout',function(req, res){
    req.logout();

    //req.flash('success_msg', 'You are logged out');
    //res.redirect('/users/login');
    res.render('logout', {layout: 'manual.handlebars'});
});

module.exports = router;