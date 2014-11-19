var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var stormpath = require('express-stormpath');
var flash = require('connect-flash');

var app = express();

// Use jade for templating.
app.set('view engine', 'jade');

// Initialize middleware.
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(stormpath.init(app, {
  apiKeyId:     process.env.STORMPATH_API_KEY_ID,
  apiKeySecret: process.env.STORMPATH_API_KEY_SECRET,
  secretKey:    process.env.STORMPATH_SECRET_KEY,
  application:  process.env.STORMPATH_URL,
  redirectUrl:  '/dashboard',

  // Make customData available on every request, automatically.
  expandCustomData: true,
}));

// Activate our routes.
//app.use('/', require('./routes/index'));

// Save a token.
app.post('/savetoken', stormpath.loginRequired, function(req, res) { 
  req.user.customData.token = req.body.token;
  req.user.customData.save(function(err) {
    if (!err) {
      res.send('Spark token: ' + req.user.customData.token + ' saved to SP custom data.');
    } else {
      res.send('Error saving token.');
    }
  });
});

// Display a user's data.
app.get('/gettoken', stormpath.loginRequired, function(req, res) {
  res.json(req.user);
});

// Home page.
app.get('/', stormpath.loginRequired, function(req, res) {
  res.render('index.jade');
});

app.get('/test', stormpath.loginRequired, function(req, res) {
  console.log(req.user);
  req.user.customData.token = 'bae';
  res.user.customData.save(function(err) {
    if (!err) {
      res.send('worked!');
    } else {
      res.send('failed ><');
    }
  });
});

//// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
//});
//
//// development error handler
//// will print stacktrace
//if (app.get('env') === 'development') {
//  app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//      message: err.message,
//      error: err
//    });
//  });
//}
//
//// production error handler
//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error', {
//    message: err.message,
//    error: {}
//  });
//});

app.listen(process.env.PORT || 3000);
