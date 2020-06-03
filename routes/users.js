const route = require('express').Router();
const User = require('../model/User.js')
const checkAdmin = require("../middleware/checkAdmin");

const Device = require("../model/Device.js");

route.get('/admin/users', checkAdmin, async (req, res) => {
  if(req.session.user) {
    try {  
    const users = await User.query().select().withGraphJoined('role');
    res.render("userspage/users", { userData: users, username: req.session.user[0].username});
   
  } catch (e) {
    res.render("userspage/users", { message: "Error in Fetching users" });
  }
} else{
  return res.redirect("/login");
}
});



module.exports = route;