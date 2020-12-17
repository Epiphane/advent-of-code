import fs from "fs";

const print = console.log;

let file = process.argv[2] || "input";
let raw = fs
  .readFileSync(file + ".txt")
  .toString()
  .trim();

let lines = raw.split("\n").map((line) => line.trim());

let rules = [];
let tickets = [];

lines.forEach((line, y) => {
  let match = line.match(/(.*): (\d+)-(\d+) or (\d+)-(\d+)/);
  if (match) {
    rules.push([
      [+match[2], +match[3]],
      [+match[4], +match[5]],
    ]);
  } else if (line.indexOf(",") >= 0) {
    tickets.push(line.split(",").map((i) => +i));
  }
});

let myticket = tickets.shift();

let errorRate = 0;

let valid = tickets.filter((ticket) => {
  for (let field = 0; field < ticket.length; field++) {
    let val = ticket[field];
    let good = false;
    rules.forEach(([r1, r2], rule) => {
      if ((val >= r1[0] && val <= r1[1]) || (val >= r2[0] && val <= r2[1])) {
        good = true;
      }
    });

    if (!good) {
      errorRate += val;
      return false;
    }
  }

  return true;
});

print(`Part 1: ${errorRate}`);

let scores = rules.map(() => new Array(rules.length).fill(0));
valid.forEach((ticket) => {
  ticket.forEach((val, field) => {
    rules.forEach(([r1, r2], rule) => {
      if ((val >= r1[0] && val <= r1[1]) || (val >= r2[0] && val <= r2[1])) {
        scores[field][rule]++;
      }
    });
  });
});

let fields = scores
  .map((matches, field) => {
    return {
      field,
      matches: matches.map((i) => (i === valid.length ? 1 : 0)),
    };
  })
  .sort(
    (a, b) =>
      a.matches.reduce((prev, good) => prev + good, 0) -
      b.matches.reduce((prev, good) => prev + good, 0)
  );

let fieldForRule = [];

while (fields.length > 0) {
  let { field, matches } = fields.shift();

  let rule = matches.indexOf(1);
  fieldForRule[rule] = field;

  fields.forEach((field) => {
    field.matches = field.matches.map((val, i) => (i === rule ? 0 : val));
  });
}

let result = 1;
for (let i = 0; i < 6; i++) {
  result *= myticket[fieldForRule[i]];
}

print(`Part 2: ${result}`);
