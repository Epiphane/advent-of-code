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
         cookie: 'session=53616c7465645f5fcb14334168213347d3fff3fb9d48f53a6102cc33bd733dd122178c1a4f34d4ac301a9c10f910fc62'
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
