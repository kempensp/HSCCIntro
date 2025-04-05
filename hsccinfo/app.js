// Including required node packages
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// Including .env file
require('dotenv').config();

// Creating routers which are linked to files in routes folder
// MUST ADD ROUTER CONNECTIONS AS WE ADD ROUTE FILES HERE
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bdpahistoryRouter = require('./routes/bdpahistory');
var formentryRouter = require('./routes/formentry');
var registerTestRouter = require('./routes/registertest');
var loginTestRouter = require('./routes/logintest');
var electionMetaRouter = require('./routes/electionmeta');
var createElectionRouter = require('./routes/createelection');
var viewElectionRouter = require('./routes/viewelection');
// Setting up Express app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Directory setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Connect links to router objects
// MUST ADD AS WE ADD NEW ROUTERS AND FILES
app.use('/', indexRouter);  //Note that index router connects with /.  
// If we want to have an /index link, we will need to add app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/bdpahistory', bdpahistoryRouter);
app.use('/formentry', formentryRouter);
app.use('/electionmeta', electionMetaRouter);
app.use('/registertest', registerTestRouter);
app.use('/logintest', loginTestRouter);
app.use('/createElection', createElectionRouter);
app.use('/viewElection', viewElectionRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
