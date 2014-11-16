var express = require('express');
var router = express.Router();


// Render the home page.
router.get('/', function(req, res) {
  res.render('index', {title: 'Home', user: req.user});
});


// Render the dashboard page.
router.get('/dashboard', function (req, res) {
  if (!req.user || req.user.status !== 'ENABLED') {
    return res.redirect('/login');
  }

  res.render('dashboard', {title: 'Dashboard', user: req.user});
});

// Render the settings page.
router.get('/settings', function (req, res) {
  if (!req.user || req.user.status !== 'ENABLED') {
    return res.redirect('/login');
  }

  res.render('settings', {title: 'settings', user: req.user});
});


////TESTS////


// Token save page?
router.get('/savetoken', function (req, res) {
  if (!req.user || req.user.status !== 'ENABLED') {
    return res.redirect('/login');
  }

  res.render('savetoken', {title: 'savetoken', user: req.user});
});

// Token get page?
router.get('/settings/gettoken', function (req, res) {
  if (!req.user || req.user.status !== 'ENABLED') {
    return res.redirect('/login');
  }

  res.render('settings/gettoken', {title: 'settings/gettoken', user: req.user});
});

////TESTS////


module.exports = router;