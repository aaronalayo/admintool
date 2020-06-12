const route = require("express").Router();

const User = require("../model/User.js");
const Role = require("../model/Role.js");

const bcrypt = require("bcrypt");
const saltRounds = 12;

const sendEmail = require("../mailer");


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
// route.post("/signup", async (req, res) => {
//   //username, password, repeat password, email
//   const { username, password, passwordRepeat, email } = req.body;

//   const isPasswordTheSame = password === passwordRepeat;

//   if (username && password && isPasswordTheSame) {
//     if (password.length < 8) {
//       return res.render('signuppage/signup', {message: "Password does not fulfill the requirements."});
//     } else {
//       try {
//         // 1.check if username exist
//         const userFound = await User.query()
//           .select()
//           .where({ username: username })
//           .limit(1);
//         if (userFound.length > 0) {
//           // 2.do if else check if it exist and give response
//           return res.render('signuppage/signup' ,{ message: "User already exist" });
//         } else {
//           const defaultUserRole = await Role.query()
//             .select()
//             .where({ role: "USER" });

//           const hashedPassword = await bcrypt.hash(password, saltRounds);
//           // 3.insert in db
//           const createdUser = await User.query().insert({
//             username: username,
//             password: hashedPassword,
//             email: email,

//             roleId: defaultUserRole[0].id,
//           });

//           const mailTo = createdUser.email;
//           const newUser = createdUser.username;

//           sendEmail(
//             mailTo,
//             "User account created",
//             "Hello " + newUser + " your account has been created."
//           );
//           return res.render('signuppage/signup',{ message:  `${createdUser.username} has been created`});

          
//         }
//       } catch (error) {
//         return res.render('signuppage/signup',{ message: 'Something went wrong with database'});

//       }
//     }
//   } else if (password && passwordRepeat && !isPasswordTheSame) {
//     return res.render('signuppage/signup',{ message: "Password does not match: password and confirm password"});
//   } else {
//     return res.render('signuppage/signup',{ message: "Missing fields, either username, password or confirm password",});
//   }
// });

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

route.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect("/");
  });
});

module.exports = route;
