var express = require('express');
var router = express.Router();
const auth=require("../middleware/verifyToken");

const MongoClient=require("../middleware/MongoClient");


/* GET home page. */
router.get('/', auth, function(req, res, next) {
  if (process.env.CONSOLE_DEBUG=="true"){
    console.log("Dashboard");
  }
  if (!res.locals.role || res.locals.role=="guest"){
    res.redirect('/logintest')
  }
  else{
    const client=MongoClient.CreateMongoClient();
    async function run() {
        try {
            // Send a ping to confirm a successful connection
            await client.db("admin").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
            const db = client.db('Elections24');
            const collection = db.collection('Users');
            const result= await collection.findOne( { username: res.locals.name } )
            console.log(result)
            res.render('dashboard', { title: 'Dashboard',username: res.locals.name, role: res.locals.role,userinfo:result });
        } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
       }
    }
    run().catch(console.dir);
    }
});
//Gratuitous comment
module.exports = router;