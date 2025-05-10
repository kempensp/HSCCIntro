var express = require('express');
var router = express.Router();
var jwt=require('jsonwebtoken');
const auth=require("../middleware/verifyToken");


const Encrypter=require("../middleware/PasswordEncrypt");
const MongoClient=require("../middleware/MongoClient");
/* GET register page. */
router.get('/', function(req, res, next) {
  res.render('logintest', { title: 'Test Login Page' ,message:'' });
});

// POST register form
router.post('/', function(req, res, next) {
  let name=req.body.username;
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
        console.log(result)
        if (result===null){
          res.render('logintest',{title:'Login failed',message:'Login and password not found'})
        }
        else {
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
          if (keyString==key){
            global.user_id=result._id
            global.role=result.role
            var token=jwt.sign(
              {
                id:global.user_id,role:global.role,name:name
              }, process.env.BEARER_TOKEN, {expiresIn: 86400000}
            )
            if (process.env.CONSOLE_DEBUG){
              console.log(token)
            }
            global.userToken=token
            res.render('logintest',{title:"Successful login",message:"Welcome "+name})
          }
          else{
            res.render('logintest',{title:'Login failed',message:'Login and password not found'})
          }
        }
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
  }
  run().catch(console.dir);
  console.log("Test password");
  
  

});

module.exports = router;