var express = require('express');
var router = express.Router();
const APIRequests=require("../middleware/APIRequests");

// GET Electionsmeta page.
router.get('/', function(req, res, next) {

    const url = 'https://elections-cpl.api.hscc.bdpa.org/v1/elections'
    const token = process.env.BEARER_TOKEN;
   
    // Pass url and token into RestAPIGet and pull information from response
    APIRequests.getWithBearerToken(url, token)
    .then(data => {
        if (process.env.CONSOLE_DEBUG=="true"){
            console.log("REST CALL ", data);
        }
        
        if (data.success){
            // SUBJECT TO CHANGE
            var Elections=data.elections;
            res.render('viewelection', {
                title: 'Elections list data',
                ElectionsArray: Elections,
            })
        } // closes if statement

        else{
            res.render('error', {title: 'Elections call failed',
            message: data.error,
            });
        }
    }) // data then component
    .catch(error => console.error(error));
});

module.exports = router;