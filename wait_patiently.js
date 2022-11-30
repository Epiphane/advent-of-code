const fs = require('fs');
const https = require('https');
const print = console.log;

if (process.argv.length < 4) {
   print('Usage: newday.js <year> <day>');
   return;
}

const year = process.argv[2];
const day = process.argv[3];
print(`Requesting /${year}/day/${day}/input`);

(function request() {
   https.get(`https://adventofcode.com/${year}/day/${day}/input`, {
      headers: {
         cookie: 'session=53616c7465645f5f68843df8647198ff7229eac9418fcb33aa811865f55e1c32e2c5d4f3d59f7bf3207aa6b65e722f55dbf6a68ad2ebb4082406837291520f55'
      }
   }, (resp) => {
      if (resp.statusCode === 404) {
         const timeout = 1000;
         print(`Trying again in ${Math.floor(timeout / 1000)} second(s)...`);

         setTimeout(request, timeout);
         return;
      }

      let data = '';
      resp.on('data', d => {
         data += d;
      });

      resp.on('end', () => {
         print(data);
         fs.writeFileSync('input.txt', data);
      });
   });
})();
