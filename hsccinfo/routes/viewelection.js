var express = require('express');
var router = express.Router();
const APIRequests=require("../middleware/APIRequests");
const auth=require("../middleware/verifyToken");


// GET viewelection general page.
router.get('/', auth,function(req, res, next) {
    const after = req.query.after;
    let url = 'https://elections-cpl.api.hscc.bdpa.org/v1/elections';
    // If the after parameter is provided, append it to the URL
    if (after) {
        url += `?after=${after}`;
    }
    const token = process.env.BEARER_TOKEN;
    // Pass url and token into RestAPIGet and pull information from response
    APIRequests.getWithBearerToken(url, token)
    .then(data => {
        if (process.env.CONSOLE_DEBUG=="true"){
            console.log("REST CALL ", data);
        }
        
        if (data.success){
            var Elections=data.elections;
            res.render('viewelection', {
                title: 'Elections list data',
                ElectionsArray: Elections,
                username: res.locals.name,
                role: res.locals.role,
                after: after // Pass after param to EJS
            })
        } // closes if statement

        else{
            res.render('error', {title: 'Elections call failed',
            message: data.error,username: res.locals.name, role: res.locals.role
            });
        }
    }) // data then component
    .catch(error => console.error(error));
});

// GET viewelection route for a specific election given its id
router.get('/:election_id',auth, function(req, res, next) {

    const url = 'https://elections-cpl.api.hscc.bdpa.org/v1/elections/' + req.params.election_id
    const token = process.env.BEARER_TOKEN;
   
    // Pass url and token into RestAPIGet and pull information from response
    APIRequests.getWithBearerToken(url, token)
    .then(data => {
        if (process.env.CONSOLE_DEBUG=="true"){
            console.log("REST CALL ", data);
        }
        
        if (data.success){
            // SUBJECT TO CHANGE
            var Election=data.election;
            res.render('viewelectionsingle', {
                title: 'Election information',
                Electiondata: Election,username: res.locals.name, role: res.locals.role
            })
        } // closes if statement

        else{
            res.render('error', {title: 'Elections call failed',
            message: data.error,username: res.locals.name, role: res.locals.role
            });
        }
    }) // data then component
    .catch(error => console.error(error));
});


module.exports = router;