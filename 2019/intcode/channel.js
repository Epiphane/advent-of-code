class Channel {
   constructor() {
      this.stream = [];
      this.ascii = false;
   }

   setASCIIMode(mode) {
      this.ascii = true;
   }

   submit(elem) {
      this.stream.push(elem);
   }

   empty() {
      return this.stream.length === 0;
   }

   read() {
      return this.stream.shift();
   }

   writeline(line) {
      for (let i = 0; i < line.length; i++) {
         this.submit(line.charCodeAt(i));
      }
      this.submit(10);
   }

   readline() {
      let result = '';
      while (1) {
         let n = this.read();
         if (n > 256) {
            return n;
         }
         let val = String.fromCharCode(n);
         if (val === '\n') {
            break;
         }

         result += val;
      }

      return result;
   }
}

module.exports = {
   Channel,
};
