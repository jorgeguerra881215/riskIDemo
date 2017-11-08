var express = require('express');
var router = express.Router();

//Get Homepage
router.get('/',ensureAhutenticated,function(req, res){
    var sessionId = req.sessionID;
   res.render('index',{'sessionId':sessionId});
});

function ensureAhutenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        //req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}

module.exports = router;