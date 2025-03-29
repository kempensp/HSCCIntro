var express = require('express');
var router = express.Router();

const Encrypter=require("../middleware/PasswordEncrypt");

/* GET register page. */
router.get('/', function(req, res, next) {
  res.render('logintest', { title: 'Test Login Page' });
});

// POST register form
router.post('/', function(req, res, next) {
  let name=req.body.username;
  let salt=req.body.salt;
  let pwd=req.body.pwd;
  var {keyString,saltString}=Encrypter.TestPassword(req.body,salt)
  res.render('logintest', {
    title: 'Login Results',

  });
});

module.exports = router;