var express = require('express');
var router = express.Router();

const Encrypter=require("../middleware/PasswordEncrypt");

/* GET register page. */
router.get('/', function(req, res, next) {
  res.render('registertest', { title: 'Test Registration Page' });
});

// POST register form
router.post('/', function(req, res, next) {
  let firstname=req.body.firstname;
  let lastname=req.body.lastname;
  let name=req.body.username;
  let pwd=req.body.pwd;
  var {keyString,saltString}=Encrypter.EncryptPassword(req.body)
  res.render('registertest', {
    title: 'Register Results',

  });
});

module.exports = router;