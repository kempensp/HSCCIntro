var express = require('express');
var router = express.Router();
const auth=require("../middleware/verifyToken");


/* GET BDPA History page. */
router.get('/', function(req, res, next) {
  res.render('bdpahistory', { title: 'BDPA History' });
});

module.exports = router;
