var express = require('express');
var router = express.Router();

/* GET formentry page. */
router.get('/', function(req, res, next) {
  res.render('formentry', { title: 'Sample Form Entry' });
});

// POST formentry form
router.post('/', function(req, res, next) {
  let firstname=req.body.firstname;
  let lastname=req.body.lastname;
  let email=req.body.email1;
  let num1=req.body.num1;
  let num2=req.body.num2;
  let usersum=Number(num1)+Number(num2);

  //Display checkbox results
  if (process.env.CONSOLE_DEBUG=="true") {
    console.log(req.body.numconvert1);
    console.log(req.body.numconvert2);
  }

  res.render('formresults', {
    title: 'Sample Form Results',
    fn:firstname,
    ln:lastname,
    em:email,
    total:usersum
  });
});

module.exports = router;