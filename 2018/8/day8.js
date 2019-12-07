const fs = require('fs');

layout = fs.readFileSync('input8.txt').toString().trim().split(' ').map(n => parseInt(n));

let ndx = 0;
let total = 0;
const parseNode = () => {
   let node = { children: 0, metadata: 0, value: 0 };
   node.children = layout[ndx++];
   node.metadata = layout[ndx++];
   node.value = 0;

   if (node.children === 0) {
      for (let i = 0; i < node.metadata; i ++) {
         node.value += layout[ndx++];
      }
   }
   else {
      let values = [];
      for (let i = 0; i < node.children; i ++) {
         values.push(parseNode());
      }
      for (let i = 0; i < node.metadata; i ++) {
         let idx = layout[ndx++];
         if (idx > 0 && idx <= values.length) {
            node.value += values[idx - 1];
         }
      }
   }
   return node.value;
}

console.log(parseNode());
console.log(layout.length);

console.log(total);
