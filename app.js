var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var flash = require('connect-flash');

var stormpath = require('express-stormpath');

var index_routes = require('./routes/index');

var app = express();

// Stormpath via Heroku

var app = express();
app.use(stormpath.init(app, {
  apiKeyId:     process.env.STORMPATH_API_KEY_ID,
  apiKeySecret: process.env.STORMPATH_API_KEY_SECRET,
  secretKey:    process.env.STORMPATH_SECRET_KEY,
  application:  process.env.STORMPATH_URL,
  redirectUrl:  '/dashboard',

// Let's make custom data available from the start

  expandCustomData: true,
}));

app.listen(process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

app.use('/', index_routes);


////TESTS////


// Saving token to Stormpath

app.post('/savetoken', stormpath.loginRequired, function(req, res) { 
  var token = (req.body.token);
  req.user.customData.token = (token);
  req.user.customData.save(function(err) {
  if (!err) {
    console.log('Spark token: ' + (token) + ' saved to SP custom data.');
  }
});
});

/* This is just saving to local node memory...

  res.locals.user.token = (token);
res.locals.user.save(function(err) {
  if (!err) {
    console.log('User change saved successfully.');
  }
});
});

*/

// Retrieve Stormpath token

app.get('/gettoken', stormpath.loginRequired, function(req, res) {
  req.user.token(function(err, data) {
    res.json(data);
  });
});

// Dudes code

app.get('/', stormpath.loginRequired, function(req, res) {
  // this will render the index.jade template in your views directory,
  // and pass in the token as a variable called 'token'. this way, in your
  // template code, you can say something like:
  // #{token} to access your token value. then you can use that to write
  // it into your HTML or frontend javascript code
  res.render('index.jade', { token: req.user.customData.token });
});

////TESTS////


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
