var express = require('express');
var router = express.Router();

const Encrypter=require("../middleware/PasswordEncrypt");
const MongoClient=require("../middleware/MongoClient");
/* GET register page. */
router.get('/', function(req, res, next) {
  res.render('logintest', { title: 'Test Login Page' });
});

// POST register form
router.post('/', async(req, res, next) => {
  let name=req.body.username;
  let salt=req.body.salt;
  let pwd=req.body.pwd;
  const client=MongoClient.CreateMongoClient();
  async function run() {
    try {
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        const db = client.db('Elections24');
        const collection = db.collection('Users');
        const result= await collection.findOne( { username: name } )
        salt=result.salt
        key=result.key
        if (process.env.CONSOLE_DEBUG){
          console.log(result)
          //console.log(salt)
          //console.log(key)
        }
        var {keyString,saltString}=await Encrypter.TestPassword(req.body,salt)
        if (process.env.CONSOLE_DEBUG){
           console.log(keyString,saltString)
        }
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
  }
  run().catch(console.dir);
  console.log("Test password");
  
  
  res.render('logintest', {
    title: 'Login test results',

  });
});

module.exports = router;