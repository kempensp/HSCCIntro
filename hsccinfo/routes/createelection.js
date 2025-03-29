var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (process.env.CONSOLE_DEBUG=="true"){
    console.log("Debugging enabled!");
  }
  res.render('createelection', { title: 'Create an Election' });
});

router.post('/', function(req, res, next) {
    if (process.env.CONSOLE_DEBUG=="true"){
      console.log(req.body);
    }
    res.render('createelection', { title: 'Create an Election' });
  });
//Gratuitous comment
module.exports = router;