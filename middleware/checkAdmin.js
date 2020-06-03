module.exports = function (req, res, next) {
  const user = req.user;
  
  if (!user) {
    return res.redirect("/login");
  } else if (user[0].username == "admin") {
    next();
  } else {
    return res.redirect("/login");
  }
  
};
