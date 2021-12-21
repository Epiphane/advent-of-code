export class Point {
    constructor(
        public x: number,
        public y: number,
        public z: number = 0
    ) { }

    sub(other: Point) {
        return new Point(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    add(other: Point) {
        return new Point(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    equals(other: Point) {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }
}
