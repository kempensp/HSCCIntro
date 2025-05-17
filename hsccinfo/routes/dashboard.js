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

// Add route to handle profile edit
router.post('/edit', auth, function(req, res, next) {
  const client = MongoClient.CreateMongoClient();
  async function run() {
    try {
      await client.db("admin").command({ ping: 1 });
      const db = client.db('Elections24');
      const collection = db.collection('Users');
      // Update user info based on username
      await collection.updateOne(
        { username: res.locals.name },
        { $set: {
            email: req.body.email,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip
          }
        }
      );
      res.redirect('/dashboard');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating profile');
    } finally {
      await client.close();
    }
  }
  run();
});

//Gratuitous comment
module.exports = router;