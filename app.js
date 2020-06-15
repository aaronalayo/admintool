const express = require("express"); //instantiate;
const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server);
module.exports.getIO = function(){
  return io;
}
const helmet = require('helmet');
app.use(helmet());

// parse application/json
app.use(express.urlencoded({ extended: false })); //to get response from

// parse application/x-www-form-urlencoded
app.use(express.json()); //to sumit form

const session = require("express-session");

app.use(
  session({
    cookieName: "session",
    secret: require("./config/psqlCredentials.js").sessionSecret,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    secure: true,
    ephemeral: true,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: 600000,
    },
  })
);



// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
app.set('trust proxy', true);

const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // limit each IP to 25 requests per windowMs
});

app.use( express.static( "public" ) );


//  apply to all requests
app.use("/login", limiter);
app.use("/forgot", limiter);


// Setup Objection + Knex
const { Model } = require("objection");

const Knex = require("knex");
const knexFile = require("./knexfile.js");

const knex = Knex(knexFile.development);

Model.knex(knex);

// Middleware
const checkAdmin = require("./middleware/checkAdmin.js");
const checkSession = require("./middleware/checkSession.js");
const isAdmin = require("./middleware/loggedIn.js");
const loggeIn = require("./middleware/isAdmin.js")

app.use(checkSession);
app.use(isAdmin);
app.use(loggeIn);

// View engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => {  
  if(req.session.user) {
    res.render('homepage/home', {username: req.session.user[0].username});
}else {
  return res.render('homepage/home', {  username: null});
}        
});

app.get("/users/add", checkAdmin,(req, res) => {
  if(req.session.user) {
  res.render("adduserpage/add", {  username: req.session.user[0].username});
} else{
  return res.redirect("/login");
}
});



app.get("/login", (req, res) => {
  if(req.session.user) {
    res.render('loginpage/login', {username: req.session.user[0].username});
}else {
  return res.render('loginpage/login', {  username: null});
}        
});

app.get("/forgot", (req, res) => {
  res.render("forgotpage/forgot");
});

/** Add routes */
//Rest api for models
const authRoute = require("./routes/auth.js");
const usersRoute = require("./routes/users.js");
const graphsRoute = require("./routes/graphs.js");
const deviceRoute = require("./routes/device.js");


//auth routes
app.use(authRoute);
app.use(usersRoute);
app.use(graphsRoute);
app.use(deviceRoute);


//endpoint
const port = process.env.PORT ? process.env.PORT : 2000;

server.listen(port, (error) => {
  if (error) {
    console.log("error running the server");
  }
  console.log("App listening on port: ", server.address().port);
});
