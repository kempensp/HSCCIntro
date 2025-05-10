var express = require('express');
var router = express.Router();
const auth=require("../middleware/verifyToken");


const Converter=require("../middleware/NumberConvert");

/* GET formentry page. */
router.get('/', function(req, res, next) {
  res.render('formentry', { title: 'Sample Form Entry',username: res.locals.name, role: res.locals.role });
});

// POST formentry form
router.post('/', function(req, res, next) {
  let firstname=req.body.firstname;
  let lastname=req.body.lastname;
  let email=req.body.email1;
  let num1=req.body.num1;
  let num2=req.body.num2;
  let usersum=Number(num1)+Number(num2);

  var binresult1=Converter.ConvertDecToBin(num1)
  var binresult2=Converter.ConvertDecToBin(num2)
  var hexresult1=Converter.ConvertDecToHex(num1)
  var hexresult2=Converter.ConvertDecToHex(num2)
  //Display checkbox results
  if (process.env.CONSOLE_DEBUG=="true") {
    console.log("Convert 1 checkbox",req.body.numconvert1);
    console.log(req.body.numconvert2);
    console.log(num1);  // display num1
    console.log(binresult1) //display binary conversion
    console.log(hexresult1)
  } // End debugging code
  console.log("Convert 1 checkbox after debug",req.body.numconvert1);

  res.render('formresults', {
    title: 'Sample Form Results',
    fn:firstname,
    ln:lastname,
    em:email,
    total:usersum,
    displaybin:req.body.numconvert1,
    binnum1:binresult1,
    binnum2:binresult2,
    displayhex:req.body.numconvert2,
    hexnum1:hexresult1,
    hexnum2:hexresult2,
    username: res.locals.name, role: res.locals.role
  });
});

module.exports = router;