const express       = require('express');
const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash         = require('connect-flash');
const app           = express();

// Include Authentication Strategies
require('./config/passport/passport');



app.set('view engine', 'jade');
app.set('views', './app/views');
app.use(express.static('./app/public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'n0d3castz secret cat key', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Passing the current user to environment locals
app.use(function(req, res, next) {
  if (req.user) {
    var currUser = req.user;
    delete currUser.passwordHash;
    res.locals.user = currUser;
  }
  next();
});


// Include all Routes
require('./config/routes/routes')(app);

// Change port if you'd like here
const server = app.listen(process.env.PORT, function () {
  const port = server.address().port;
  console.log('Listening at http://localhost:%s', port);
});


module.exports.getApp = app;
