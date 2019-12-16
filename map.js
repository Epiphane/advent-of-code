class Map {
   constructor(defaultValue) {
      this.contents = [];
      this.min = false;
      this.max = false;

      this.defaultValue = defaultValue;
   }

   empty() {
      return this.min === false;
   }

   has(x, y) {
      return this.contents[y] && this.contents[y].hasOwnProperty(x);
   }

   get(x, y) {
      if (!this.has(x, y)) {
         return this.defaultValue;
      }

      return this.contents[y][x];
   }

   set(x, y, value) {
      if (this.empty()) {
         this.min = { x, y };
         this.max = { x, y };
      }

      this.contents[y] = this.contents[y] || [];
      this.contents[y][x] = value;

      if (x < this.min.x) {
         this.min.x = x;
      }
      if (y < this.min.y) {
         this.min.y = y;
      }
      if (x > this.max.x) {
         this.max.x = x;
      }
      if (y > this.max.y) {
         this.max.y = y;
      }
   }

   print(xJoiner, yJoiner) {
      xJoiner = xJoiner || '';
      yJoiner = yJoiner || '\n';

      let rows = [];
      for (let y = this.min.y; y <= this.max.y; ++y) {
         let row = [];
         for (let x = this.min.x; x <= this.max.x; ++x) {
            row.push(this.get(x, y));
         }
         rows.push(row.join(xJoiner));
      }
      return rows.join(yJoiner);
   }

   forEach(callback, includeUndefined) {
      for (let y = this.min.y; y <= this.max.y; ++y) {
         if (!this.contents[y] && !includeUndefined) {
            continue;
         }

         for (let x = this.min.x; x <= this.max.x; ++x) {
            if (!this.contents[y].hasOwnProperty(x) && !includeUndefined) {
               continue;
            }

            callback(this.get(x, y), x, y);
         }
      }
   }

   reduce(callback, initial, includeUndefined) {
      let result = initial;
      this.forEach((val, x, y) => {
         result = callback(result, val, x, y);
      }, includeUndefined);

      return result;
   }
}

module.exports = {
   Map
};
