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
      console.log(req.body.openingtime);
    }

    //Create Date objects for opening and closing time of elections
    //and convert to unix epoch milliseconds to post to API
    openingdate=new Date(req.body.openingtime);
    openingmilliseconds=openingdate.getTime();
    closingdate=new Date(req.body.closingtime);
    closingmilliseconds=closingdate.getTime();

    if (process.env.CONSOLE_DEBUG=="true"){
      console.log(openingmilliseconds);
      console.log(closingmilliseconds);
    }
    res.render('createelection', { title: 'Create an Election' });
  });
//Gratuitous comment
module.exports = router;