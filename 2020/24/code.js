import fs from 'fs';
import md5 from '../../md5.js';
import { Map } from '../../map.js';
import { MakeGrid, MakeRow } from '../../makegrid.js';
import { permute, gcd, lcm } from '../../utils.js';
import { question } from 'readline-sync';

const log = console.log;
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let lines = raw.split('\n').map(line => line.trim())

let groups = raw.split(/\r?\n\r?\n/).map((line) =>
    line.trim().split('\n').map(line =>
        line.trim()));

let map = new Map(' ');

let tiles = {};
lines.forEach(line => {
    let x = 0;
    let y = 0;

    let i = 0;
    while (i < line.length) {
        let ch = line[i++];
        if (ch === 'e') {
            x += 2;
        }
        else if (ch === 'w') {
            x -= 2;
        }
        else {
            if (ch === 'n') {
                y++;
            }
            else {
                y--;
            }

            ch = line[i++];
            if (ch === 'e') {
                x++;
            }
            else {
                x--;
            }
        }
    }

    let score = x * 1000 + y;

    tiles[score] = !tiles[score];
    map.set(x, y, tiles[score] ? '#' : ' ');
})

print(Object.keys(tiles).filter(i => !!tiles[i]).length)

function step() {
    let newMap = new Map(' ');
    for (let y = map.min.y - 1; y <= map.max.y; y++) {
        for (let x = map.min.x - 1; x <= map.max.x; x++) {
            if ((x + y) % 2 === 1) {
                continue;
            }

            let me = map.get(x, y);
            let neighbors = [
                map.get(x - 2, y),
                map.get(x + 2, y),
                map.get(x - 1, y + 1),
                map.get(x + 1, y + 1),
                map.get(x - 1, y - 1),
                map.get(x + 1, y - 1),
            ];

            let nn = neighbors.filter(n => n === '#').length;
            if (me === '#') {
                if (nn !== 1) {
                    me = ' '
                }
            }
            if (me === ' ') {
                if (nn === 2) {
                    me = '#'
                }
            }

            // if (x === 0 && y === 0)
            //     print(x, y, nn);
            // if (nn === 2) {
            //     print(x, y, me);
            // }
            newMap.set(x, y, me);
        }
    }
    map = newMap;
}

// map.set(0, 0, '*');
// print(map.print());
// step();
print(map.print());
for (let i = 0; i < 100; i++) {
    step();
}

print()
print();
print(map.print());

print(map.reduce((prev, i) => prev + (i === '#' ? 1 : 0), 0))


                  # #     #     # #     #     #
                   # #   #   #   #   # #   # # #
                        # #     # # #       # #
               #     # #   # # # # #   #   # #   # #
                      #         #     # #   #     #
             # # #       #       # #         # # # # #
          # #                   # #         #     # # #
         # # #       # #     # #     # #     # # # # # #
        # #   #         # # #   # #             #   # # #
       # #   #   #       #               #     # #   #   #
      #   #       #   #   #       #   # # #       # # #
           #   #                 # # #     #   #     #
        #   # # #   #     #             # # # #   # # # #
   # #   #   #   # # #   #       # # # # # # # #   # # # # # #
    # #     # #     # # #   #   #   #     # # # # # # #   # # #
     #   #     #   #     # #   # # #     #   # #       # # # # #
#   # # #     #     #     # # #       #   # # #     #     #   #
 #   # # # #     # #   # # # # #   # #   #   #     # #
  #         #           # # # # #     # #   # # # #     # # #
     #     #     # #   # #     #     #   #   #   #     #     #
    #         # #       #   # #   # # # #   #         #     #
       #           #         # #     #   # #   # # # #     #
      # #             # # # #         # # #         #     #
                   #   #   #   #     #   #   # # # #     #
          # #     # #     #         # #     #   # #     #
           #   # # # #           # # #           #
            #         # #   # #   # #       # # # #   #
             # #   # # # # #   #   #         # #   #
              # # #       # # #   # #           #   #
             #     #     #   # # #           #
                      #   #   # #       # # # # # #
               # #   #   # # # # # #         # #
                            #   #         # #
