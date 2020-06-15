const route = require("express").Router();

const User = require("../model/User.js");
const Role = require("../model/Role.js");

const bcrypt = require("bcrypt");
const saltRounds = 12;

const sendEmail = require("../mailer");

//Login route
route.post("/login", async (req,res) => {
  
  const { username, password } = req.body;
  const adminRole = await Role.query().select().where({role: 'ADMIN'});
  const users = await User.query().select();

  if(username && password){
          try{
              const user = await User.query().select().where({'username': username}).limit(1);
                  if(user.length>0){
                      bcrypt.compare(password, user[0].password).then(function(isMatch) {
                          if(isMatch){
                              req.session.user = user;
                              if(adminRole[0].id == user[0].roleId){
                                  req.session.isAdmin = true;
                                  req.session.users = users;  
                              }
                              res.redirect("/");
                          }
                          else{
                              res.render('loginpage/login', {message: "Invalid username or password"});
                          }
                      });
                  }else {
                      res.render('loginpage/login', {message: "Invalid username or password"});
                  }
              
          }catch(error){
              return res.status(500).send({response: "Something went wrong with the database"});
          }

  }else {
      res.render('loginpage/login', {message: "Missing fields: username or password"});
  
  }
      
});

//Resets the password
route.post("/forgot", async (req, res) => {
  const { email, newPassword, newPasswordRepeat } = req.body;
  const isPasswordTheSame = newPassword === newPasswordRepeat;
  if (newPassword && isPasswordTheSame) {
    if (newPassword.length < 8) {
      return res.render('forgotpage/forgot', {message: "Password does not fulfill the requirements" });
    } else {
       try {
        const user = await User.query().select().where({ email: email });

        if (user[0].email != email) {
            return res.render('forgotpage/forgot', {message: "Invalid email." });
        } else {
          const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
          // 3.insert in db
          const updateUser = await User.query()
            .where({ email: email })
            .update({ password: hashedPassword });
          const mailTo = user[0].email;

          sendEmail(
            mailTo,
            "User account updated",
            "Hello " + user[0].username + " your new password is " + newPassword + ". Dont forget it!"
          );
          return res.render('forgotpage/forgot', {message: " Your password has been reset. You can log in again."});
          
        }
      } catch (error) {
        return res.render('forgotpage/forgot', {message: "Something went wrong with database" });
      }
    }
  } else if (newPassword && newPasswordRepeat && !isPasswordTheSame) {
     return res.render('forgotpage/forgot', {message:"New password does not match: new password and confirm new password"});
  } else {
    return res.render('forgotpage/forgot', {message: "Missing fields, either email, new password or confirm new password" });
  }
});

//Log out and destroy the session
route.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect("/");
  });
});

module.exports = route;
