module.exports={
    // Create decimal to binary conversion function
    CreateMongoClient:function(){
        const { MongoClient, ServerApiVersion } = require('mongodb');
        const uri = "mongodb+srv://" + process.env.MONGO_LOGIN + 
            "@inbdpa23.dmklbqg.mongodb.net/?retryWrites=true&w=majority&appName=inBDPA23";
        const client = new MongoClient(uri, {
            serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
            }
        });
        return client
    } // End CreateMongoClient function
 
    

    
    
    
    
    } //End module.exports