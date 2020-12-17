import fs from "fs";
import md5 from "../../md5.js";
import { Map } from "../../map.js";
import { MakeGrid, MakeRow } from "../../makegrid.js";
import { permute, gcd, lcm } from "../../utils.js";
import { question } from "readline-sync";

const log = console.log;
const print = console.log;

let file = process.argv[2] || "input";
let raw = fs
  .readFileSync(file + ".txt")
  .toString()
  .trim();

let lines = raw.split("\n").map((line) => line.trim());
let input = lines;

let map = new Map(".");

let x = 0;
let y = 0;

// let E = 0;
// let S = 1;
// let W = 2;
// let N = 3;
let dir = 0;

let wx = 10;
let wy = 1;

// lines.forEach((line) => {
//     print(x, y);
//     print(line);
//     if (line[0] === "N") {
//       y += +line.substr(1);
//     } else if (line[0] === "S") {
//       y -= +line.substr(1);
//     } else if (line[0] === "E") {
//       x += +line.substr(1);
//     } else if (line[0] === "W") {
//       x -= +line.substr(1);
//     } else if (line[0] === "R") {
//       dir -= +line.substr(1);
//     } else if (line[0] === "L") {
//       dir += +line.substr(1);
//     } else if (line[0] === "F") {
//       let dx = Math.cos((dir * Math.PI) / 180);
//       let dy = Math.sin((dir * Math.PI) / 180);
//       print(dir, dx, dy);
//       let d = +line.substr(1);
//       x += d * dx;
//       y += d * dy;
//     }
//     print(x, y);
//   });

lines.forEach((line) => {
  print(line);
  if (line[0] === "N") {
    wy += +line.substr(1);
  } else if (line[0] === "S") {
    wy -= +line.substr(1);
  } else if (line[0] === "E") {
    wx += +line.substr(1);
  } else if (line[0] === "W") {
    wx -= +line.substr(1);
  } else if (line[0] === "R") {
    let dist = Math.sqrt(wy * wy + wx * wx);
    let angle = Math.atan2(wy, wx);
    angle -= (+line.substr(1) * Math.PI) / 180;

    wy = dist * Math.sin(angle);
    wx = dist * Math.cos(angle);
  } else if (line[0] === "L") {
    let dist = Math.sqrt(wy * wy + wx * wx);
    let angle = Math.atan2(wy, wx);
    angle += (+line.substr(1) * Math.PI) / 180;

    wy = dist * Math.sin(angle);
    wx = dist * Math.cos(angle);
  } else if (line[0] === "F") {
    //   for (let i = 0; i < +line.substr(1); i++) {

    //   }
    x += +line.substr(1) * wx;
    y += +line.substr(1) * wy;
    // print(Math.sqrt(wy * wy + wx * wx), +line.substr(1));
    // let dist = Math.sqrt(wy * wy + wx * wx) - +line.substr(1);
    // let angle = Math.atan2(wy, wx);

    // wy = dist * Math.sin(angle);
    // wx = dist * Math.cos(angle);
  }
  print(x, y);
  print(wx, wy);
});

print(x, y, x + y);
print(wx, wy, wx - wy);
