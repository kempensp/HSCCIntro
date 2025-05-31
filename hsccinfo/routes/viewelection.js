var express = require('express');
var router = express.Router();
const APIRequests=require("../middleware/APIRequests");
const auth=require("../middleware/verifyToken");
const MongoClient = require("../middleware/MongoClient");


// GET viewelection general page.
router.get('/', auth, async function(req, res, next) {
    const after = req.query.after;
    let url = 'https://elections-cpl.api.hscc.bdpa.org/v1/elections';
    // If the after parameter is provided, append it to the URL
    if (after) {
        url += `?after=${after}`;
    }
    const token = process.env.BEARER_TOKEN;
    try {
        const data = await APIRequests.getWithBearerToken(url, token);
        if (process.env.CONSOLE_DEBUG=="true"){
            console.log("REST CALL ", data);
        }
        
        if (data.success){
            var Elections = data.elections;
            // --- Begin MongoDB logic for owned elections ---
            const client = MongoClient.CreateMongoClient();
            try {
                await client.db("admin").command({ ping: 1 });
                const db = client.db('Elections24');
                const votersCollection = db.collection('ElectionVoters');
                for (const election of Elections) {
                    if (election.owned === true) {
                        const found = await votersCollection.findOne({ election_id: election.election_id });
                        if (!found) {
                            await votersCollection.insertOne({ election_id: election.election_id, votersassigned: [] });
                        }
                    }
                }
            } finally {
                await client.close();
            }
            // --- End MongoDB logic ---
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
    } catch (error) {
        console.error(error);
        res.render('error', {title: 'Elections call failed', message: error.message, username: res.locals.name, role: res.locals.role});
    }
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