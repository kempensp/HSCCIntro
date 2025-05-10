var express = require('express');
var router = express.Router();
const APIRequests=require("../middleware/APIRequests");
const CreateClient=require("../middleware/MongoClient");
const auth=require("../middleware/verifyToken");


// GET Electionsmeta page.
router.get('/', function(req, res, next) {

    const url = 'https://elections-cpl.api.hscc.bdpa.org/v1/info'
    const token = process.env.BEARER_TOKEN;
   
    // Pass url and token into RestAPIGet and pull information from response
    APIRequests.getWithBearerToken(url, token)
    .then(data => {
        if (process.env.CONSOLE_DEBUG=="true"){
            console.log("REST CALL ", data);
        }
        
        if (data.success){
            // SUBJECT TO CHANGE
            var electionInfo=data.info;
            var upcomingElections=data.info.upcomingElections;
            var openElections=data.info.openElections;
            var closedElections=data.info.closedElections;
            // Set up connection to MongoDB
            const client =CreateClient.CreateMongoClient();
            async function run() {
                try {
                    // Connect the client to the server	(optional starting in v4.7)
                    await client.connect();
                    // Send a ping to confirm a successful connection
                    await client.db("admin").command({ ping: 1 });
                    console.log("Pinged your deployment. You successfully connected to MongoDB!");
                    const db = client.db('Elections24');
                    const collection = db.collection('ElectionMeta');
                    const update= await collection.updateOne( { title: "ElectionStats" }, { $set: 
                        { upcomingElections: upcomingElections,
                            openElections:openElections,
                            closedElections:closedElections } } ) 
                } finally {
                    // Ensures that the client will close when you finish/error
                    await client.close();
                }
            }
            run().catch(console.dir);


            res.render('electionmeta', {
                title: 'Elections global data',
                upcomingElections: upcomingElections,
                openElections: openElections,
                closedElections: closedElections,
                username: res.locals.name, role: res.locals.role
            })
        } // closes if statement

        else{
            res.render('error', {title: 'Stats call failed',
            message: data.error,username: res.locals.name, role: res.locals.role
            });
        }
    }) // data then component
    .catch(error => console.error(error));
});
module.exports = router;