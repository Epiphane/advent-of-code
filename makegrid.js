function PrintGrid(grid, joiner) {
   return grid.map((_, _2, i) => i).map(row => row.join(joiner || '')).join('\n');
}

function PrintRow(row) {
   return row.join(' ');
}

function MakeRow(length, generator) {
   let row = [];
   for (let i = 0; i < length; i++) {
      row.push(generator(i));
   }

   row.print = () => PrintRow(row)
   return row;
}

function MakeGrid(
   width = 1,
   height = 1,
   generator = (() => null),
   defaultElement = (() => null)
) {
   let grid = MakeRow(height, y => {
      return MakeRow(width, x => generator(x, y));
   })
   grid.minx = grid.miny = 0;
   grid.maxx = width - 1;
   grid.maxy = height - 1;

   grid.print = (joiner) => PrintGrid(grid, joiner);
   grid.get = (x, y, param) => {
      grid[y] = grid[y] || [];
      if (typeof (grid[y][x]) === 'undefined') {
         grid[y][x] = defaultElement(x, y, param);
      }
      if (x < grid.minx) grid.minx = x;
      if (y < grid.miny) grid.miny = y;
      if (x > grid.maxx) grid.maxx = x;
      if (y > grid.maxy) grid.maxy = y;

      return grid[y][x];
   }
   grid.set = (x, y, val) => {
      grid[y] = grid[y] || [];
      grid[y][x] = val;
   }
   grid.forEachRow = (callback) => {
      for (let y = grid.miny; y <= grid.maxy; y++) {
         callback(y, grid[y]);
      }
   }
   grid.forEach = (callback) => {
      print('------');
      return;
      for (let y = grid.miny; y <= grid.maxy; y++) {
         console.log(y);
         for (let x = grid.minx; x <= grid.maxx; x++) {
            console.log(x, y);
            callback(x, y, grid[y][x]);
         }
      }
   }
   grid.mapRow = (callback) => {
      let mapped = [];
      for (let y = grid.miny; y <= grid.maxy; y++) {
         mapped.push(callback(grid[y]));
      }
   };
   grid.map = (callback) => {
      let mapped = [];
      for (let y = grid.miny; y <= grid.maxy; y++) {
         let row = [];
         for (let x = grid.minx; x <= grid.maxx; x++) {
            row.push(callback(x, y, grid[y][x]));
         }
         mapped.push(row);
      }
      return mapped;
   }

   return grid;
}

module.exports = {
   PrintGrid,
   PrintRow,
   MakeRow,
   MakeGrid,
}
