import fs from 'fs';
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let lines = raw.split('\n').map(line => line.trim())

let passports = [];
let pass = {};
lines.forEach(line => {
    if (!line) {
        passports.push(pass);
        pass = {};
        return;
    }
    else {
        line.split(' ').forEach(p => {
            let match = p.match(/([a-z]+):(.+)/);
            if (match) {
                pass[match[1]] = match[2];
            }
        });
    }
});

passports.push(pass);

function valid1({ byr, iyr, eyr, hgt, hcl, ecl, pid }) {
    return !!byr && !!iyr && !!eyr && !!hgt && !!hcl && !!ecl && !!pid;
}

print(`Part 1: ${passports.filter(valid1).length}`)

function test_byr(byr) { return byr >= 1920 && byr <= 2002 }
function test_iyr(iyr) { return iyr >= 2010 && iyr <= 2020 }
function test_eyr(eyr) { return eyr >= 2020 && eyr <= 2030 }
function test_hgt(hgt) {
    if (!hgt) return false;
    let cm = hgt.match(/([0-9]+)cm/);
    let inc = hgt.match(/([0-9]+)in/);

    if (cm) {
        return +cm[1] >= 150 && +cm[1] <= 193;
    }

    if (inc) {
        return +inc[1] >= 59 && +inc[1] <= 76;
    }

    return false;
}
function test_hcl(hcl) {
    return hcl && !!hcl.match(/#([0-9a-f]{6})/)
}
function test_ecl(ecl) {
    return ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].indexOf(ecl) >= 0;
}
function test_pid(pid) {
    return pid && !!pid.match(/^[0-9]{9}$/);
}

function valid2({ byr, iyr, eyr, hgt, hcl, ecl, pid }) {
    return test_byr(+byr) &&
        test_iyr(+iyr) &&
        test_eyr(+eyr) &&
        test_hgt(hgt) &&
        test_hcl(hcl) &&
        test_ecl(ecl) &&
        test_pid(pid);
}

print(`Part 2: ${passports.filter(valid2).length}`)
