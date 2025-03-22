const https = require('https');

// Starting module... It should have at least five functions when we are done
// We have one so far...

module.exports = {

//Get Call function  
    getWithBearerToken: function (url, token) {

    const options = {
        headers: {
            Authorization: `Bearer ${token}`  //These are forward ticks, not quotes!
        }
    }; //End Setting our headers...
  
    return new Promise((resolve, reject) => {
      const req = https.get(url, options, res => {
        let data = '';
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(JSON.parse(data));
        });
      });
  
      req.on('error', error => {
        reject(error);
      });
  
      req.end();
    }); //end the Promise
  } //End the getWithBearerToken function
}; //End module.exports