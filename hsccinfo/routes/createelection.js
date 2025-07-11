var express = require('express');
var router = express.Router();
const APIRequests=require("../middleware/APIRequests");
const auth=require("../middleware/verifyToken");

/* GET home page. */
router.get('/', auth, function(req, res, next) {
  if (res.locals.role && ((res.locals.role=="super") || (res.locals.role=="administrator")))
  {
    res.render('createelection', { title: 'Create an Election', username: res.locals.name, role: res.locals.role });
  }
  else{
     res.render('logintest', { title: 'Please log in',message:'You need to log in to access page',username: res.locals.name, role: res.locals.role });
  }
});

router.post('/', auth, function(req, res, next) {
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
        .then(async data => {
            if (process.env.CONSOLE_DEBUG=="true"){
                console.log("REST CALL ", data);
            }
            if (data.success){
              // Add election_id to ElectionVoters collection with empty votersassigned array
              try {
                const MongoClientLib = require("../middleware/MongoClient");
                const client = MongoClientLib.CreateMongoClient();
                await client.db("admin").command({ ping: 1 });
                const db = client.db('Elections24');
                const votersCollection = db.collection('ElectionVoters');
                // Use the election_id returned by the API
                if (data.election && data.election.election_id) {
                  await votersCollection.insertOne({ election_id: data.election.election_id, votersassigned: [] });
                }
                await client.close();
              } catch (err) {
                console.error("Error adding to ElectionVoters collection:", err);
              }
              res.render('createelection', { title: 'Created an Election Successfully',username: res.locals.name, role: res.locals.role });
            } // closes if statement
    
            else{
                res.render('error', {title: 'Election post failed',
                message: data.error,
                username: res.locals.name, role: res.locals.role
                });
            }
        }) // data then component
        .catch(error => console.error(error));



    
  });
//Gratuitous comment
module.exports = router;