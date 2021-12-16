import * as fs from "fs";
import { addAll, multiplyAll } from "../../utils";

let file = process.argv[2] || "input";
let raw = fs
  .readFileSync(file + ".txt")
  .toString()
  .trim();

class Packet {
  subpackets: Packet[] = [];
  value?: number;

  constructor(public version: number, public type: number) {}

  versionSum() {
    return (
      this.version +
      this.subpackets.reduce((prev, packet) => prev + packet.versionSum(), 0)
    );
  }

  getValue() {
    const values = this.subpackets.map((packet) => {
      return packet.getValue();
    });
    switch (this.type) {
      case 0:
        return values.reduce(addAll, 0);
      case 1:
        return values.reduce(multiplyAll, 1);
      case 2:
        return Math.min(...values);
      case 3:
        return Math.max(...values);
      case 4:
        return this.value!;
      case 5:
        return values[0] > values[1] ? 1 : 0;
      case 6:
        return values[0] < values[1] ? 1 : 0;
      case 7:
        return values[0] === values[1] ? 1 : 0;
    }
  }
}

class PacketReader {
  binary: string;
  cursor = 0;

  versionTotal = 0;
  packet: Packet;

  constructor(transmissionHex: string) {
    this.binary = transmissionHex
      .split("")
      .map((w) => {
        return parseInt(w, 16).toString(2).padStart(4, "0");
      })
      .join("");

    this.packet = this.parse();
  }

  read(len: number, verbose = false) {
    if (verbose) {
      console.log(this.binary.substr(this.cursor, len));
    }
    const value = parseInt(this.binary.substr(this.cursor, len), 2);
    this.cursor += len;
    return value;
  }

  parseLiteral() {
    let value = 0;
    let continueParsing: number;
    do {
      continueParsing = this.read(1);
      value *= 16;
      value += this.read(4);
    } while (continueParsing);

    return value;
  }

  parseSubpackets() {
    const type = this.read(1);
    const packets: Packet[] = [];
    if (type === 0) {
      const numBits = this.read(15);
      const dest = this.cursor + numBits;
      while (this.cursor < dest) {
        packets.push(this.parse());
      }
    } else {
      const numPackets = this.read(11);
      for (let n = 0; n < numPackets; n++) {
        packets.push(this.parse());
      }
    }

    return packets;
  }

  parse() {
    if (this.cursor + 4 >= this.binary.length) {
      this.cursor = this.binary.length;
      return;
    }

    const version = this.read(3);
    const type = this.read(3);

    this.versionTotal += version;

    const packet = new Packet(version, type);
    if (type === 4) {
      packet.value = this.parseLiteral();
    } else {
      packet.subpackets = this.parseSubpackets().filter((p) => !!p);
    }

    return packet;
  }
}

const reader = new PacketReader(raw);
console.log(`Part 1`, reader.versionTotal);
console.log(`Part 2`, reader.packet.getValue());
