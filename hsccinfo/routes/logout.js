var express = require('express');
var router = express.Router();

const auth = require("../middleware/verifyToken");
// We probably don't need the auth here, but we include it for generalization purposes
router.get('/', auth, function(req, res, next) {
    global.userToken=null;
    req.session=null;  //This may risk removing session data we want to keep, be careful
    res.redirect('/');  //Redirect to the index route and view
  });

  module.exports = router;