const User = require("../model/User");
module.exports = async (req, res, next) => {
        if (req.session && req.session.user) {
          const username = req.session.user[0].username;
          try {
            await User.query()
              .select()
              .where({ username: username })
              .then(function (user) {
                if (user) {
                  req.user = user;
                  delete req.user.password; // delete the password from the session
                  req.session.user = user; //refresh the session value
                  res.locals.user = user;
                }
                // finishing processing the middleware and run the route
                next();
              });
          } catch (error) {
            console.log(error);
            res.render('homepage/home',{ message: "There is no user for this session." });
            
          }
        } else {
          next();
        }
    };
  