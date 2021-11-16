const fs = require('fs');
const util = require('../../util');

let format = /(.*)/;

function main(inputFile) {
    let input = fs.readFileSync(inputFile).toString().trim();
    let lines = input.split('\n');

    let mapping = {};
    let reverse = {};
    let baseMolecule = '';

    let state = 0;
    lines.forEach((line, id) => {
        if (state === 0) {
            if (line.trim() === '') {
                state = 1;
            }
            else {
                let parts = line.split(' => ');
                mapping[parts[0]] = mapping[parts[0]] || [];
                mapping[parts[0]].push(parts[1]);
                reverse[parts[1]] = reverse[parts[1]] || [];
                reverse[parts[1]].push(parts[0]);
            }
            return null;
        }
        else {
            baseMolecule = line.trim();
        }
    });

    let answer = baseMolecule;

    function Develop(molecule) {
        let molecules = {};
        for (let i = 0; i < molecule.length; i ++) {
            let prefix;
            let suffix;
            let substitutions;
            if (mapping[molecule[i]]) {
                prefix = molecule.substr(0, i);
                suffix = molecule.substr(i + 1);
                substitutions = mapping[molecule[i]];
            }
            else if (mapping[molecule.substr(i, 2)]) {
                prefix = molecule.substr(0, i);
                suffix = molecule.substr(i + 2);
                substitutions = mapping[molecule.substr(i, 2)];
            }
            else {
                continue;
            }
    
            substitutions.forEach(subst => {
                let newMolecule = prefix + subst + suffix;
                molecules[newMolecule] = true;
    
                // if (i < 10) {
                //     console.log(i, newMolecule.length, newMolecule.substr(0, 20), Object.keys(molecules).length);
                // }
            });
        }

        return Object.keys(molecules);
    }

    let reverseOptions = Object.keys(reverse);
    reverseOptions.sort((s1, s2) => s2.length - s1.length);
    function DevelopTo(molecule, result = 'e') {
        if (molecule === result) {
            return 0;
        }

        for (let i = 0; i < reverseOptions.length; i ++) {
            let reversal = reverseOptions[i];
            let ndx = molecule.indexOf(reversal);
            while (ndx >= 0) {
                let prefix = molecule.substr(0, ndx);
                let suffix = molecule.substr(ndx + reversal.length);
                let res = DevelopTo(prefix + reverse[reversal][0] + suffix, result);
                if (res >= 0) {
                    return res + 1;
                }
                ndx = molecule.indexOf(reversal, i + 1);
            }
        }
        return -1;
    }

    console.log(DevelopTo(baseMolecule, 'e'));
    return;

    function Dedevelop(molecule) {
        let molecules = {};
        reverseOptions.forEach(reversal => {
            let i = molecule.indexOf(reversal);
            while (i >= 0) {
                let prefix = molecule.substr(0, i);
                let suffix = molecule.substr(i + reversal.length);
                molecules[prefix + reverse[reversal][0] + suffix] = true;
                i = molecule.indexOf(reversal, i + 1);
            }
        })

        return Object.keys(molecules);
    }

    let rounds = 0;
    let possibilities = [baseMolecule];
    while (possibilities.indexOf('e') < 0) {
        let newPossibilities = {};
        possibilities.forEach(poss => {
            Dedevelop(poss).forEach(mol => newPossibilities[mol] = true);
        });
        possibilities = Object.keys(newPossibilities).filter(mol => mol.length < baseMolecule.length);
        console.log(rounds ++);
        // console.log(possibilities);
        possibilities.sort((s1, s2) => s1.length - s2.length);
        console.log(possibilities[possibilities.length - 1]);
        console.log(possibilities.length);
    }

    console.log(rounds);
    // console.log(Object.keys(molecules).length);
};

main('input.txt');
