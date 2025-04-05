var express = require('express');
var router = express.Router();
const APIRequests=require("../middleware/APIRequests");

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
    // Create empty options array to compile the list of options.
    var optionsarray=[];
    var keys=Object.keys(req.body)
    for (let key in keys){
      let keyname=keys[key];
      if (keyname.indexOf("option")>-1){
        let option=req.body[keyname];
        if (option.constructor===Array){
          optionsarray=optionsarray.concat(option)
        }
        else{
          optionsarray.push(option)
        }
        
      }
    }
    //Now that we have our options, we can start to set up the post request.
    if (process.env.CONSOLE_DEBUG=="true"){
      //console.log(keys);
      console.log(optionsarray);
    }

    var body=
    {
      title:req.body.title,
      type:req.body.type,
      description: req.body.description,
      options:optionsarray,
      opensAt:openingmilliseconds,
      closesAt:closingmilliseconds
    }
    const url = 'https://elections-cpl.api.hscc.bdpa.org/v1/elections'
    const token = process.env.BEARER_TOKEN;

    //Submit post request
    APIRequests.postWithBearerToken(url, token,body)
        .then(data => {
            if (process.env.CONSOLE_DEBUG=="true"){
                console.log("REST CALL ", data);
            }
            
            if (data.success){
                
              res.render('createelection', { title: 'Created an Election Successfully' });
            } // closes if statement
    
            else{
                res.render('error', {title: 'Election post failed',
                message: data.error,
                });
            }
        }) // data then component
        .catch(error => console.error(error));



    
  });
//Gratuitous comment
module.exports = router;