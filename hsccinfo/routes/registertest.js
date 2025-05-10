var express = require('express');
var router = express.Router();
const auth=require("../middleware/verifyToken");


const Encrypter=require("../middleware/PasswordEncrypt");
const MongoClient=require("../middleware/MongoClient");


/* GET register page. */
router.get('/', function(req, res, next) {
  res.render('registertest', { title: 'Test Registration Page',message:'' });
});

// POST register form
router.post('/', function(req, res, next) {
  let name=req.body.username;
  const client=MongoClient.CreateMongoClient();
  let pwd=req.body.pwd;
  async function run() {
      try {
          // Send a ping to confirm a successful connection
          await client.db("admin").command({ ping: 1 });
          console.log("Pinged your deployment. You successfully connected to MongoDB!");
          const db = client.db('Elections24');
          const collection = db.collection('Users');
          const result= await collection.findOne( { username: name } )
          if (result===null){
            var {keyString,saltString}=await Encrypter.EncryptPassword(req.body)
            const result=await collection.insertOne({
              username:name,
              role:'voter',
              email:req.body.email,
              city:req.body.city,
              state:req.body.state,
              zip:req.body.zip,
              address:req.body.address,
              deleted:false,
              key:keyString,
              salt:saltString,
              lastIP:"",
              lastLoginTime:"",
              pwdupdated:true
             })
             res.render('registertest',{title:'Registration success',message:"User added successfully"})
        }
          else{
            res.render('registertest',{title:'Registration failed',message:'Username already exists'})
          }
      
      } finally {
          // Ensures that the client will close when you finish/error
          await client.close();
      }
    }
    run().catch(console.dir);


});

module.exports = router;