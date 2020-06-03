module.exports = function (req, res, next) {
    if(req.session.user){
         res.locals.loggedIn = req.session.user;
        
    } else{
         res.locals.loggedIn = null;
    }
    next()
    };