var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (process.env.CONSOLE_DEBUG=="true"){
    console.log("Debugging enabled!");
  }
  else{
    console.log("Debugging disabled!");
  }
  res.render('index', { title: 'Express' });
});
//Gratuitous comment
module.exports = router;
