var express = require('express');
var router = express.Router();
const auth=require("../middleware/verifyToken");


/* GET home page. */
router.get('/', function(req, res, next) {
  if (process.env.CONSOLE_DEBUG=="true"){
    console.log("Debugging enabled!");
  }
  res.render('index', { title: 'Express' });
});
//Gratuitous comment
module.exports = router;
