export class Point {
    x: number;
    y: number;
    z: number;

    constructor(
        x: string | number,
        y: string | number,
        z: string | number = 0
    ) {
        this.x = (typeof (x) === 'string') ? parseInt(x) : x;
        this.y = (typeof (y) === 'string') ? parseInt(y) : y;
        this.z = (typeof (z) === 'string') ? parseInt(z) : z;
    }

    sub(other: Point) {
        return new Point(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    add(other: Point) {
        return new Point(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    equals(other: Point) {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }

    copy() {
        return new Point(this.x, this.y, this.z);
    }

    area() {
        return this.x * this.y * this.z;
    }
}
