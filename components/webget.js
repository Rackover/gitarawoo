const https = require('https');

const urlCheckLink = `https://www.googleapis.com/youtube/v3/videos?id={ytid}&key=${process.env.GKEY}`;

module.exports = {
    doRequest: function(url){
        return new Promise ((resolve, reject) => {
                  
          console.log("Fetching "+url);
          
          let req = https.get(url, function(res){ resolve(res); });
      
          req.on('error', err => {
              console.log("Error! "+err);
              reject(err);
          });
        }); 
      },


      streamToString: function  (stream) {
        const chunks = [];
        return new Promise((resolve, reject) => {
          stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
          stream.on('error', (err) => reject(err));
          stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        })
      },

      doesYoutubeVideoExist: async function(ytID){
					const formattedURL = urlCheckLink.formatUnicorn({ytid:ytID});
					const data = await this.doRequest(formattedURL);
					const strJson = await this.streamToString(data);
					const json = JSON.parse(strJson);

					return json.items && json.items.length > 0;
      }
      
}
