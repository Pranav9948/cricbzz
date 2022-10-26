var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const nocache = require("nocache");

var db = require('./config/connection')

var fileUpload = require('express-fileupload')

var hbs = require('express-handlebars');
var bodyParser = require('body-parser');

var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');

var app = express();

var session = require('express-session')


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');




 app.engine('hbs', hbs.engine({
   extname: 'hbs',
  defaultLayout: 'layout',
   layoutDir: __dirname + '/views/layouts',
  partialsDir:__dirname + '/views/partials/'
 }));






app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(fileUpload())

app.use(nocache());


app.use(session({
  secret: "key",
  cookie: {maxAge:6000000}
}))


db.Connect((err) => {
  if (err)
    console.log("error");

  else
    console.log("Database Connected");

})






app.use('/admin', adminRouter);
app.use('/users', usersRouter);

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
