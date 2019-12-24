const fs = require('fs');
const https = require('https');

if (process.argv.length < 4) {
   console.log('Usage: wait_patiently.js <year> <day>');
   return;
}

const year = process.argv[2];
const day = process.argv[3];
const cookie = process.env['COOKIE'];

const URL = `https://adventofcode.com/${year}/day/${day}/input`;
console.log(`Requesting ${URL}...`);

(function request() {
   https.get(URL, {
      headers: {
         cookie,
      }
   }, (resp) => {
      if (resp.statusCode === 404) {
         const timeout = 1000;
         console.log(`Request failed, trying again in ${Math.floor(timeout / 1000)} seconds...`);
         setTimeout(request, timeout);
      }
      else {
         let data = '';
         resp.on('data', d => {
            data += d;
         });

         resp.on('end', () => {
            fs.writeFileSync('input.txt', data);
            console.log(data);
         });
      }
   })
})();
