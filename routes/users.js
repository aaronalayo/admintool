const route = require('express').Router();
const User = require('../model/User.js');
const Device = require('../model/Device.js');
const Organization = require('../model/Organization.js');
const Role = require("../model/Role.js");
const checkAdmin = require("../middleware/checkAdmin.js");

const check = require('../middleware/check.js');

const bcrypt = require("bcrypt");
const saltRounds = 12;

const sendEmail = require("../mailer");
const { user } = require('../config/psqlCredentials.js');


route.get('/admin/users', checkAdmin, async (req, res) => {
  if(req.session.user) {
    try {  
    const users = await User.query().select().withGraphJoined('role').withGraphJoined('organization');
    res.render("userspage/users", { userData: users, username: req.session.user[0].username, link: "/user/edit/", linkDelete:'/user/delete/'});
  } catch (e) {
    res.render("userspage/users", { message: "Error in Fetching users" , username: req.session.user[0].username});
  }
} else{
  return res.redirect("/login");
}
});

route.get('/dashboard', check, async (req, res) => {
  if(req.session.user) {
    const username = req.session.user[0].username;
    try {
      const users = await User.query().select().where({'username':username}).withGraphJoined('role').withGraphJoined('organization');
      const devices = await Device.query().select().where({'organizationUuid': users[0].organizationUuid});

      res.render("dashboardpage/dashboard",{userData: users, devices: devices, username: req.session.user[0].username,  link: "/dashboard/device/"});
    } catch (e) {
      res.render("dashboardpage/dashboard", { message: "Error in Fetching data" , username: req.session.user[0].username});
    }
  } else{
    return res.redirect("/login");
  }
} );

route.post('/adduser',checkAdmin, async (req, res) => {
  if(req.session.user) {
   //username, password, repeat password, email
  const { username, password, passwordRepeat, email, organization } = req.body;
  
   
  const isPasswordTheSame = password === passwordRepeat;

  if (username && password && isPasswordTheSame) {
    if (password.length < 8) {
      return res.render('adduserpage/adduser', {message: "Password does not fulfill the requirements.", username: req.session.user[0].username});
    
    } else {
      const expression = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if(expression.test(String(email).toLowerCase()) == false) {
        
        return res.render('adduserpage/adduser', {message: "Email is not valid.", username: req.session.user[0].username});
      }else {

      try {
        const org = await Organization.query().select('organization_uuid').where({name: organization}).limit(1);
        const organization_uuid = [];
            for (var i = 0; i <org.length; i++) {
              var obj = org[i];
              for (var key in obj) {
                organization_uuid.push(obj["organizationUuid"]);
                
              }
            }
        
 
        // 1.check if username exist
        const userFound = await User.query().select().where({'username': username, 'organization_uuid': organization_uuid[0]}).limit(1);
        // const organization = await Organization
        if (userFound.length > 0) {
          // 2.do if else check if it exist and give response
          return res.render('adduserpage/adduser',{ message: "User already exist" , username: req.session.user[0].username});
       
          
          }else {
          const defaultUserRole = await Role.query().select().where({ role: "USER" });
         
          
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          // 3.insert in db
          const createdUser = await User.query().insert({
            username: username,
            password: hashedPassword,
            email: email,
            roleId: defaultUserRole[0].id,
            organization_uuid: organization_uuid[0],
          });

          const mailTo = createdUser.email;
          const newUser = createdUser.username;

          sendEmail(
            mailTo,
            "User account created",
            "Hello " + newUser + " your account has been created."
          );
          res.redirect("/admin/users");
          
        }
      
      
      } catch (e) {
        console.log(e);
        return res.render('adduserpage/adduser',{ message: 'Something went wrong with database', username: req.session.user[0].username});
        
      }
    }
  
  }
  } 
  } else {
    return res.redirect('/login');
  }
});

route.get('/user/edit/:id', checkAdmin, async(req, res) => {
  if(req.session.user) {
    const userId = req.params.id;
    try {
      const userToEdit = await User.query().select().where({'id': userId}).limit(1);

      return res.render('editpage/edit', {userData: userToEdit, username: req.session.user[0].username});
      
    } catch (e) {
      console.log(e);
      return res.render('editpage/edit',{ message: 'Something went wrong with database', username: req.session.user[0].username});
    }
  } else {
    return res.redirect('/login');
  }

});

route.post('/user/update/:id', checkAdmin, async (req, res) => {
  if(req.session.user) {
    const userId =  req.params.id;
    const { username, email, organization } = req.body;
  
    const expression = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(expression.test(String(email).toLowerCase()) == false) {
      
      return res.render('editpage/edit',{message: "Email is not valid.",userData: [], username: req.session.user[0].username});
    }else {
   
   try {
    const organizationUuid = await Organization.query().select('organizationUuid').where({'name': organization});
    await User.query().where({'id': userId}).update({'username':username, 'email': email, 'organization_uuid':organizationUuid[0].organizationUuid});
    return res.redirect('/admin/users');

   } catch (error) {
    return res.render('editpage/edit',{ message: 'Something went wrong with database', userData:[],username: req.session.user[0].username});
     
   }
  }

  } else {
    return res.redirect('/login');
  }
});

route.get('/user/delete/:id', checkAdmin, async (req, res) => {
  if(req.session.user) {
    const userId = req.params.id;
    try {
      const userToDelete = await User.query().where({'id':userId}).del();
      return res.redirect('/admin/users');
    } catch (error) {
      return res.render('/admin/users',{ message: 'Something went wrong with database', userData:user,username: req.session.user[0].username});
    }
  } else {
    return res.redirect('/login')
  }

});
module.exports = route;