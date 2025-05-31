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
router.get('/:election_id',auth, async function(req, res, next) {
    const url = 'https://elections-cpl.api.hscc.bdpa.org/v1/elections/' + req.params.election_id;
    const token = process.env.BEARER_TOKEN;
    try {
        const data = await APIRequests.getWithBearerToken(url, token);
        if (process.env.CONSOLE_DEBUG=="true"){
            console.log("REST CALL ", data);
        }
        if (data.success){
            var Election = data.election;
            // Fetch votersassigned from MongoDB if owned
            let votersassigned = [];
            if (Election.owned) {
                const client = MongoClient.CreateMongoClient();
                try {
                    await client.db("admin").command({ ping: 1 });
                    const db = client.db('Elections24');
                    const votersCollection = db.collection('ElectionVoters');
                    const found = await votersCollection.findOne({ election_id: Election.election_id });
                    if (found && Array.isArray(found.votersassigned)) {
                        votersassigned = found.votersassigned;
                    }
                } finally {
                    await client.close();
                }
            }
            res.render('viewelectionsingle', {
                title: 'Election information',
                Electiondata: Election,
                votersassigned: votersassigned,
                username: res.locals.name,
                role: res.locals.role
            });
        } else {
            res.render('error', {title: 'Elections call failed',
            message: data.error,username: res.locals.name, role: res.locals.role
            });
        }
    } catch (error) {
        console.error(error);
        res.render('error', {title: 'Elections call failed', message: error.message, username: res.locals.name, role: res.locals.role});
    }
});

// Assign voter to election
router.post('/:election_id/assignvoter', auth, async function(req, res, next) {
    if (!(res.locals.role === 'super' || res.locals.role === 'admin')) {
        return res.status(403).send('Forbidden');
    }
    const election_id = req.params.election_id;
    const voter = req.body.voter;
    if (!voter) {
        return res.redirect(`/viewelection/${election_id}`);
    }
    const client = MongoClient.CreateMongoClient();
    try {
        await client.db("admin").command({ ping: 1 });
        const db = client.db('Elections24');
        const usersCollection = db.collection('Users');
        // Check if user exists and is a voter
        const user = await usersCollection.findOne({ username: voter, role: 'voter' });
        if (!user) {
            // Optionally, you could pass an error message to the view
            return res.redirect(`/viewelection/${election_id}`);
        }
        const votersCollection = db.collection('ElectionVoters');
        await votersCollection.updateOne(
            { election_id: election_id },
            { $addToSet: { votersassigned: voter } }
        );
    } finally {
        await client.close();
    }
    res.redirect(`/viewelection/${election_id}`);
});

// Remove voter from election
router.post('/:election_id/removevoter', auth, async function(req, res, next) {
    if (!(res.locals.role === 'super' || res.locals.role === 'admin')) {
        return res.status(403).send('Forbidden');
    }
    const election_id = req.params.election_id;
    const voter = req.body.voter;
    if (!voter) {
        return res.redirect(`/viewelection/${election_id}`);
    }
    const client = MongoClient.CreateMongoClient();
    try {
        await client.db("admin").command({ ping: 1 });
        const db = client.db('Elections24');
        const votersCollection = db.collection('ElectionVoters');
        await votersCollection.updateOne(
            { election_id: election_id },
            { $pull: { votersassigned: voter } }
        );
    } finally {
        await client.close();
    }
    res.redirect(`/viewelection/${election_id}`);
});


module.exports = router;