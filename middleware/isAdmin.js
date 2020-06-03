module.exports = function (req, res, next){
        if (req.session.isAdmin) {
          res.locals.isAdmin = req.session.isAdmin;
        } else {
          res.locals.isAdmin = null;
        }
        next()
      };