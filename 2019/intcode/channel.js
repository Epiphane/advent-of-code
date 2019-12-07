module.exports = class Channel {
   constructor() {
      this.stream = [];
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
}
