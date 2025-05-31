var express = require('express');
var router = express.Router();
const auth=require("../middleware/verifyToken");


const Encrypter=require("../middleware/PasswordEncrypt");
const MongoClient=require("../middleware/MongoClient");


/* GET register page. */
router.get('/', auth,function(req, res, next) {
  // Generate captcha numbers for the form
  const captchaA = Math.floor(Math.random() * 10) + 1;
  const captchaB = Math.floor(Math.random() * 10) + 1;
  res.render('registertest', {
    title: 'Test Registration Page',
    message: '',
    username: res.locals.name,
    role: res.locals.role,
    captchaA: captchaA,
    captchaB: captchaB
  });
});

// POST register form
router.post('/', auth,function(req, res, next) {
  // Captcha validation
  const captchaA = parseInt(req.body.captchaA, 10);
  const captchaB = parseInt(req.body.captchaB, 10);
  const captchaAnswer = parseInt(req.body.captchaAnswer, 10);
  if (captchaA + captchaB !== captchaAnswer) {
    // If captcha is incorrect, re-render with a new captcha and error message
    const newA = Math.floor(Math.random() * 10) + 1;
    const newB = Math.floor(Math.random() * 10) + 1;
    return res.render('registertest', {
      title: 'Test Registration Page',
      message: 'Captcha incorrect. Please try again.',
      username: res.locals.name,
      role: res.locals.role,
      captchaA: newA,
      captchaB: newB
    });
  }
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
              lastIP:[],
              lastLoginTime:[],
              pwdupdated:true
             })
             res.render('registertest',{title:'Registration success',message:"User added successfully",username: res.locals.name, role: res.locals.role})
        }
          else{
            res.render('registertest',{title:'Registration failed',message:'Username already exists',username: res.locals.name, role: res.locals.role})
          }
      
      } finally {
          // Ensures that the client will close when you finish/error
          await client.close();
      }
    }
    run().catch(console.dir);


});

module.exports = router;