function LinkedNode(data, prev = null, next = null) {
   this.next = next || this;
   this.prev = prev || this;
   this.data = data;
}

LinkedNode.prototype.insertAfter = (data) => {
   let next = new LinkedNode(data, this, this.next);
   this.next.prev = next;
   this.next = next;
   return next;
}

LinkedNode.prototype.insertBefore = (data) => {
   return this.prev.insertAfter(data);
}

LinkedNode.prototype.remove = () => {
   this.prev.next = this.next;
   this.next.prev = this.prev;
}

module.exports = LinkedNode;