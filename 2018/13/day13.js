const fs = require('fs');

const input = fs.readFileSync('input13.txt').toString();
let lines = input.split('\n');

const LinkedList = require('../linkedlist');
const { MakeRow, MakeGrid } = require('../makegrid');

console.time();

const makeCart = (x, y, dx, dy) => {
   return {x, y, dx, dy, choice: 0};
}

let carts = [];

const width = lines[0].length;
const height = lines.length;

var grid = MakeGrid(lines[0].length, lines.length, (x, y) => {
   switch (lines[y][x]) {
   case 'v':
      carts.push(makeCart(x, y, 0, 1));
      if (['-', '+', '\\', '/'].indexOf(lines[y][x - 1]) >= 0) { console.log(1, x, y); }
      if (['-', '+', '\\', '/'].indexOf(lines[y][x + 1]) >= 0) { console.log(1, x, y); }
      return '|';
   case '>':
      carts.push(makeCart(x, y, 1, 0));
      if (!!lines[y - 1] && ['|', '+', '\\', '/'].indexOf(lines[y - 1][x]) >= 0) { console.log(2, x, y); }
      if (!!lines[y + 1] && ['|', '+', '\\', '/'].indexOf(lines[y + 1][x]) >= 0) { console.log(2, x, y); }
      return '-';
   case '<':
      carts.push(makeCart(x, y, -1, 0));
      if (!!lines[y - 1] && ['|', '+', '\\', '/'].indexOf(lines[y - 1][x]) >= 0) { console.log(3, x, y); }
      if (!!lines[y + 1] && ['|', '+', '\\', '/'].indexOf(lines[y + 1][x]) >= 0) { console.log(3, x, y); }
      return '-';
   case '^':
      carts.push(makeCart(x, y, 0, -1));
      if (['-', '+', '\\', '/'].indexOf(lines[y][x - 1]) >= 0) { console.log(4, x, y); }
      if (['-', '+', '\\', '/'].indexOf(lines[y][x + 1]) >= 0) { console.log(4, x, y); }
      return '|';
   default:
      return lines[y][x];
   }
});

// It turns left the first time, goes straight the second time,
// turns right the third time, and then repeats those directions
// starting again with left the fourth time, straight the fifth time, and so on.

function iterateCart(grid, cart) {
   let newCart = {
      x: cart.x + cart.dx,
      y: cart.y + cart.dy,
      dx: cart.dx,
      dy: cart.dy,
      choice: cart.choice,
   };

   const spot = grid[newCart.y][newCart.x];
   switch (spot) {
      case '/':
         if (newCart.dx === 1) {
            newCart.dx = 0;
            newCart.dy = -1;
         }
         else if (newCart.dy === 1) {
            newCart.dx = -1;
            newCart.dy = 0;
         }
         else if (newCart.dy === -1) {
            newCart.dx = 1;
            newCart.dy = 0;
         }
         else if (newCart.dx === -1) {
            newCart.dx = 0;
            newCart.dy = 1;
         }
         else { console.log('wat1'); }
         break;
      case '\\':
         if (newCart.dx === 1) {
            newCart.dx = 0;
            newCart.dy = 1;
         }
         else if (newCart.dy === 1) {
            newCart.dx = 1;
            newCart.dy = 0;
         }
         else if (newCart.dy === -1) {
            newCart.dx = -1;
            newCart.dy = 0;
         }
         else if (newCart.dx === -1) {
            newCart.dx = 0;
            newCart.dy = -1;
         }
         else { console.log('wat2'); }
         break;
      case '+':
         switch (newCart.choice) {
            case 0: // left
               if (newCart.dx === 1) {
                  newCart.dx = 0;
                  newCart.dy = -1;
               }
               else if (newCart.dy === 1) {
                  newCart.dx = 1;
                  newCart.dy = 0;
               }
               else if (newCart.dy === -1) {
                  newCart.dx = -1;
                  newCart.dy = 0;
               }
               else if (newCart.dx === -1) {
                  newCart.dx = 0;
                  newCart.dy = 1;
               }
               break;
            case 2: // right
               if (newCart.dx === 1) {
                  newCart.dx = 0;
                  newCart.dy = 1;
               }
               else if (newCart.dy === 1) {
                  newCart.dx = -1;
                  newCart.dy = 0;
               }
               else if (newCart.dy === -1) {
                  newCart.dx = 1;
                  newCart.dy = 0;
               }
               else if (newCart.dx === -1) {
                  newCart.dx = 0;
                  newCart.dy = -1;
               }
               break;
         }
         newCart.choice = (newCart.choice + 1) % 3;
   }

   return newCart;
}

function iterate(grid, carts) {
   let collision = false;
   const newCarts = carts.map((cart, ndx) => {
      if (collision) { return cart; }
      let newCart = {
         x: cart.x + cart.dx,
         y: cart.y + cart.dy,
         dx: cart.dx,
         dy: cart.dy,
         choice: cart.choice,
      };

      const spot = grid[newCart.y][newCart.x];
      switch (spot) {
         case '/':
            if (newCart.dx === 1) {
               newCart.dx = 0;
               newCart.dy = -1;
            }
            else if (newCart.dy === 1) {
               newCart.dx = -1;
               newCart.dy = 0;
            }
            else if (newCart.dy === -1) {
               newCart.dx = 1;
               newCart.dy = 0;
            }
            else if (newCart.dx === -1) {
               newCart.dx = 0;
               newCart.dy = 1;
            }
            else { console.log('wat1'); }
            break;
         case '\\':
            if (newCart.dx === 1) {
               newCart.dx = 0;
               newCart.dy = 1;
            }
            else if (newCart.dy === 1) {
               newCart.dx = 1;
               newCart.dy = 0;
            }
            else if (newCart.dy === -1) {
               newCart.dx = -1;
               newCart.dy = 0;
            }
            else if (newCart.dx === -1) {
               newCart.dx = 0;
               newCart.dy = -1;
            }
            else { console.log('wat2'); }
            break;
         case '+':
            switch (newCart.choice) {
               case 0: // left
                  if (newCart.dx === 1) {
                     newCart.dx = 0;
                     newCart.dy = -1;
                  }
                  else if (newCart.dy === 1) {
                     newCart.dx = 1;
                     newCart.dy = 0;
                  }
                  else if (newCart.dy === -1) {
                     newCart.dx = -1;
                     newCart.dy = 0;
                  }
                  else if (newCart.dx === -1) {
                     newCart.dx = 0;
                     newCart.dy = 1;
                  }
                  break;
               case 2: // right
                  if (newCart.dx === 1) {
                     newCart.dx = 0;
                     newCart.dy = 1;
                  }
                  else if (newCart.dy === 1) {
                     newCart.dx = -1;
                     newCart.dy = 0;
                  }
                  else if (newCart.dy === -1) {
                     newCart.dx = 1;
                     newCart.dy = 0;
                  }
                  else if (newCart.dx === -1) {
                     newCart.dx = 0;
                     newCart.dy = -1;
                  }
                  break;
            }
            newCart.choice = (newCart.choice + 1) % 3;
      }

      carts.forEach((other, otherNdx) => {
         if (ndx === otherNdx) return;
         if (newCart.x === other.x && newCart.y === other.y) {
            collision = newCart;
         }
      })

      return newCart;
   });

   return [collision, newCarts];
}

function print(grid, carts) {
   let rows = grid.print().split('\n').map(row => row.split(''));
   carts.forEach(cart => {
      if (cart.dx === 1) {
         rows[cart.y][cart.x] = '>';
      }
      else if (cart.dx === -1) {
         rows[cart.y][cart.x] = '<';
      }
      else if (cart.dy === -1) {
         rows[cart.y][cart.x] = '^';
      }
      else if (cart.dy === 1) {
         rows[cart.y][cart.x] = 'v';
      }
      else {
         rows[cart.y][cart.x] = '?';
      }
   });
   return rows.map(r => r.join('')).join('\n');
}

let collided = null;
// print(grid, carts);
let i = 0;
let c = 0;
carts.sort((c1, c2) => {
   if (c1.y === c2.y) return c1.x - c2.x;
   return c1.y - c2.y;
})
while (true) {
   collided = false;
   carts[c] = iterateCart(grid, carts[c]);
   if (carts.length === 1) {
      break;
   }

   carts.forEach((other, ndx) => {
      if (c === ndx) return;
      if (carts[c].x === other.x && carts[c].y === other.y) {
         collided = true;
      }
   });

   if (collided) {
      let newcarts = [];
      let x = carts[c].x;
      let y = carts[c].y;
      let _c = c;
      console.log('Was on cart ' + c, ' with ', x, y);
      for (let i = 0; i < carts.length; i ++) {
         if (carts[i].x !== x || carts[i].y !== y) {
            newcarts.push(carts[i]);
         }
         else {
            console.log('removing ' + i);
            if (_c >= i) { c --; }
         }
      }
      console.log(carts);
      carts = newcarts;
      console.log(carts);
      console.log('Only ' + carts.length + ' left');
   }

   c = (c + 1) % carts.length;
   if (collided) {
      console.log('Now on cart ' + c);
   }
   // let next = iterate(grid, carts);
   // collided = next[0];
   // carts = next[1];
   // carts.forEach((cart, n) => {
   //    if (n === carts.length - 1) { return; }
   //    if (cart.x === carts[n + 1].x && cart.y === carts[n + 1].y) {
   //       console.log(cart, carts[n + 1]);
   //       collided = cart;
   //    }
   // })

   // console.log(carts.map(c => c.x + ',' + c.y).join(' '));
   if (c === 0) {
      fs.writeFileSync('day13out/g' + (i++) + '.txt', print(grid, carts));
      carts.sort((c1, c2) => {
         if (c1.y === c2.y) return c1.x - c2.x;
         return c1.y - c2.y;
      })
   }
   // console.log(print(grid, carts));
}
// console.log(collided);
console.log(carts);
console.log(i + ' generations');

// console.log(i);
// console.log(collided.x + "," + collided.y);

console.timeEnd();