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

if (!process.env['AOC_COOKIE']) {
   print('Please provide an AOC_COOKIE environment variable for authentication.');
   return;
}

(function request() {
   https.get(`https://adventofcode.com/${year}/day/${day}/input`, {
      headers: {
         cookie: process.env['AOC_COOKIE'],
         "user-agent": "home computer, local script by eyphnos@gmail.com"
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
