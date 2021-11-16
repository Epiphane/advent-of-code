const fs = require('fs');

const OPS = require('./ops');

function main(inputFile) {
    console.log(`-------------- Running ${inputFile} --------------`)
    let input = fs.readFileSync(`${inputFile}.txt`).toString();
    let lines = input.trim().split('\n');

    let maxx = 0;
    let maxy = 0;
    let maxz = 0;
    let minx = 0;
    let miny = 0;
    let minz = 0;

    // pos=<76659180,55463797,20890147>, r=80344142
    let nanobots = lines.map((line, id) => {
        let caretopen = line.indexOf('<');
        let caretclose = line.indexOf('>');
        let pos = line.substr(caretopen + 1, caretclose - caretopen - 1).split(',').map(i => parseInt(i));
        let r = parseInt(line.substr(caretclose + 5));
        if (pos[0] > maxx) maxx = pos[0];
        if (pos[1] > maxy) maxy = pos[1];
        if (pos[2] > maxz) maxz = pos[2];
        if (pos[0] < minx) minx = pos[0];
        if (pos[1] < miny) miny = pos[1];
        if (pos[2] < minz) minz = pos[2];
        return {
            id,
            x: pos[0],
            y: pos[1],
            z: pos[2],
            r,
            neighbors: 0
        }
    });

    nanobots.sort((n1, n2) => n1.r - n2.r);
    let strong = nanobots[nanobots.length - 1];

    let result = 0;
    for (let i = 0; i < nanobots.length; i ++) {
        let bot = nanobots[i];
        if (Math.abs(bot.x - strong.x) + Math.abs(bot.y - strong.y) + Math.abs(bot.z - strong.z) <= strong.r) {
            result ++;
        }
    }

    let scores = [];
    scores.minx = 0;
    scores.maxx = 0;
    scores.miny = 0;
    scores.maxy = 0;
    scores.minz = 0;
    scores.maxz = 0;
    scores.add = (x, y, z) => {
        scores[x] = scores[x] || [];
        scores[x][y] = scores[x][y] || [];
        scores[x][y][z] = scores[x][y][z] || 0;
        if (x < scores.minx) { scores.minx = x; }
        if (y < scores.miny) { scores.miny = y; }
        if (z < scores.minz) { scores.minz = z; }
        if (x > scores.maxx) { scores.maxx = x; }
        if (y > scores.maxy) { scores.maxy = y; }
        if (z > scores.maxz) { scores.maxz = z; }
        scores[x][y][z] += 1;
    };
    scores.print = (generator) => {
        return scores.map(row => {
            return row.map(el => generator(el)).join(' ');
        }).join('\n');
    };

    nanobots.forEach(bot => {
        nanobots.forEach(other => {
            let dist = Math.abs(bot.x - other.x) + Math.abs(bot.y - other.y) + Math.abs(bot.z - other.z);
            if (dist <= bot.r + other.r) {
                bot.neighbors ++;
            }
        });
    });

    nanobots.sort((b1, b2) => {
        if (b1.id !== b2.id) return b1.id - b2.id;
        if (b1.neighbors !== b2.neighbors) return b1.neighbors - b2.neighbors;
        if (b1.r !== b2.r) return b1.r - b2.r;
        if (b1.x !== b2.x) return b1.x - b2.x;
        if (b1.y !== b2.y) return b1.y - b2.y;
        if (b1.z !== b2.z) return b1.z - b2.z;
        return b1.r - b2.r;
    });

    let connections = nanobots.map(bot => {
        return nanobots.map(other => {
            let dist = Math.abs(bot.x - other.x) + Math.abs(bot.y - other.y) + Math.abs(bot.z - other.z);
            return dist <= bot.r + other.r;
        });
    });

    // console.log(connections[0].map(e => e ? 1 : 0).join(''));
    // console.log(nanobots.slice(0, 5));

    fs.writeFileSync('graph.txt', connections.map(row => row.map(e => e ? '1' : ' ').join('')).join('\n'));

    function IsValid(component) {
        for (let i = 0; i < component.length; i ++) {
            for (let j = i + 1; j < component.length; j ++) {
                if (!connections[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    function LargestValid(component, s = 0, r = 0) {
        if (IsValid(component)) { return [component]; }

        let best = [[]];
        for (let i = s; i < component.length; i ++) {
            let removed = component.slice(0, i).concat(component.slice(i + 1));
            let subgraph = LargestValid(removed, i, r + 1);
            if (subgraph[0].length === 0) continue;
            if (subgraph[0].length > best[0].length) {
                best = subgraph;
            }
            else if (subgraph[0].length === best[0].length) {
                best = best.concat(subgraph);
                // console.log(`${r} ${best[0].length}: ${best[0].join(' ')}`);
            }
        }
        if (best[0].length > 0) {
            console.log(`${r} ${best[0].length}: ${best[0].join(' ')}`);
        }
        return best;
    }

    let a = 0;
    let bestSoFar = 0;
    function TryAdd(component, i, bestLength) {
        if (component.length + (nanobots.length - i) < bestSoFar) { return [component]; }
        component = component.concat([i]);
        let best = [component];
        if (component.length > bestSoFar) {
            bestSoFar = component.length;
        }
        if (component.length === bestSoFar) { console.log(bestSoFar, component.join(' ')); }

        if(a++ % 1000 === 0)
            console.log(`(${bestSoFar}) (${component.length}) ` + component.slice(0, 20).join(' ') + ' + ' + i)

        let neighbors = connections[i].slice(i + 1);
        // console.log(`neighbors (${i}): ${connections[i]} -> ` + neighbors.join(','))
        if (neighbors.filter(i => i).length + component.length < bestSoFar) { return best; }
        neighbors.forEach((connec, neighbor) => {
            if (!connec) return;
            let good = true;
            neighbor += i + 1;
            for (let n = 0; n < component.length; n ++) {
                let node = component[n];
                if (!connections[node][neighbor]) {
                    good = false;
                    break;
                }
            }
            if (good) {
                let bigger = TryAdd(component, neighbor, best.length);
                if (bigger[0].length > best[0].length) {
                    best = bigger;
                }
                else if (bigger[0].length === best[0].length) {
                    best = best.concat(bigger);
                }
            }
        });

        // console.log(' return ' + best.join(' | '))
        return best;
    }
    // let component = LargestValid(nanobots.map(n => n.id));
    // console.log(component);

    // let bestComponents = [[]];
    // for (let origin = 0; origin < connections.length; origin ++) {
    //     console.log('Finding best for ' + origin + ' (' + connections[origin].filter(e => e).length + ' neighbors)')
    //     // console.log(connections[origin].map(e => e ? 1 : 0).join(''));
    //     let components = TryAdd([], origin, Math.max(bestComponents[0].length, 0));
    //     // let component = LargestValid(nanobots.map(n => n.id));
    //     if (components[0].length > bestComponents[0].length) {
    //         bestComponents = components;
    //     }
    //     else if (components[0].length === bestComponents[0].length) {
    //         bestComponents = bestComponents.concat(components);
    //     }
    //     console.log(nanobots[origin].id, components);
    // }
    // console.log('best components:' + bestComponents.join(' | '));
    // console.log(component);

    bestComponent = [0,1,2,3,4,5,6,7,9,11,12,13,14,15,16,17,18,19,20,21,22,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,229,230,231,232,233,234,235,236,237,238,240,241,242,243,244,245,246,247,248,249,250,252,253,255,256,257,258,259,260,261,262,263,264,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,294,295,296,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,316,317,318,319,320,321,322,323,324,325,326,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,345,346,347,348,349,351,352,353,354,355,356,357,358,359,360,361,362,363,364,365,366,367,368,369,370,371,372,373,374,375,376,377,378,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399,400,401,402,403,404,405,406,408,409,410,411,412,413,414,415,416,417,418,419,420,421,422,423,424,425,426,427,428,429,430,431,432,433,434,435,436,437,438,439,440,441,442,443,444,445,446,447,448,449,450,451,452,453,454,455,456,457,458,459,460,461,462,463,464,465,466,467,468,469,470,471,472,473,474,475,476,477,478,479,480,481,482,483,484,485,486,487,488,489,490,491,492,493,494,495,496,497,498,499,500,501,502,503,504,505,506,507,508,509,510,511,512,513,514,515,516,517,518,519,520,521,522,523,524,525,526,527,528,529,530,531,532,533,534,535,536,537,538,539,540,541,542,543,544,545,546,547,548,550,551,552,553,554,555,556,557,558,559,560,561,562,563,564,565,566,567,568,569,570,571,573,574,575,576,577,579,580,581,582,583,584,585,586,587,588,589,590,591,592,593,594,595,596,597,598,599,600,601,602,603,605,606,608,610,611,612,613,614,615,616,617,618,619,620,621,622,623,624,625,626,627,628,629,630,631,632,633,634,635,636,637,638,639,640,641,642,643,644,645,646,647,648,649,650,651,652,653,654,655,656,657,658,659,660,661,662,663,664,665,666,667,668,669,670,671,672,673,674,675,676,677,678,679,680,681,682,683,684,685,686,687,688,689,690,691,692,693,694,695,696,697,698,699,700,701,702,703,704,705,706,707,708,709,710,711,712,713,715,716,717,718,719,720,721,722,723,724,725,726,727,728,729,730,731,732,733,734,735,736,737,738,739,740,741,742,743,744,745,746,747,748,749,750,751,752,753,754,755,757,758,759,760,761,763,764,765,766,767,768,769,770,771,773,774,775,776,777,778,779,780,781,782,783,784,785,786,787,788,789,790,791,792,793,794,795,796,797,798,799,800,801,802,803,804,805,806,807,808,809,810,811,812,813,814,815,816,817,818,819,820,821,822,823,824,825,826,827,828,829,830,831,832,833,834,835,836,837,838,839,840,841,842,843,844,845,846,847,848,849,850,851,852,853,854,855,856,857,858,859,860,861,862,863,864,865,866,867,868,869,870,871,872,873,874,875,876,877,878,879,880,881,883,884,885,886,887,888,889,890,891,892,893,894,895,896,897,898,899,900,901,902,903,904,905,906,907,908,909,910,911,912,914,915,916,917,918,919,920,921,922,923,924,925,926,927,928,929,930,931,932,933,934,935,936,937,938,939,940,941,942,943,944,945,946,947,948,950,951,952,953,954,955,956,957,958,959,960,961,962,963,964,965,966,967,968,969,970,971,973,974,975,976,977,978,980,981,983,984,985,986,987,988,989,990,991,992,993,994,995,996,997,998,999];
    // console.log('Component: ' + bestComponent);
    // console.log(nanobots);

    let bots = nanobots.filter(bot => {
        return bestComponent.indexOf(bot.id) >= 0;
    });

    bots.sort((b1, b2) => {
        // if (b1.id !== b2.id) return b1.id - b2.id;
        // if (b1.neighbors !== b2.neighbors) return b1.neighbors - b2.neighbors;
        // if (b1.r !== b2.r) return b1.r - b2.r;
        if (b1.x !== b2.x) return b1.x - b2.x;
        if (b1.y !== b2.y) return b1.y - b2.y;
        if (b1.z !== b2.z) return b1.z - b2.z;
        return b1.r - b2.r;
    });

    let common = { minx, maxx, miny, maxy, minz, maxz };

    bots.forEach(bot => {
        if (bot.x - bot.r > common.minx) common.minx = bot.x - bot.r;
        if (bot.y - bot.r > common.miny) common.miny = bot.y - bot.r;
        if (bot.z - bot.r > common.minz) common.minz = bot.z - bot.r;
        if (bot.x + bot.r < common.maxx) common.maxx = bot.x + bot.r;
        if (bot.y + bot.r < common.maxy) common.maxy = bot.y + bot.r;
        if (bot.z + bot.r < common.maxz) common.maxz = bot.z + bot.r;
    });

    console.log(common);

    const XP = 100;
    const XM = 100;
    let bounds = {
        minx: common.minx, //Math.floor((common.minx + common.maxx) / 2) - XM,
        maxx: common.maxx, //Math.floor((common.minx + common.maxx) / 2) + XP,
        miny: common.miny, //Math.floor((common.miny + common.maxy) / 2) - 0,
        maxy: common.maxy, //Math.floor((common.miny + common.maxy) / 2) + 200,
        minz: common.minz, //Math.floor((common.minz + common.maxz) / 2) - XM,
        maxz: common.maxz, //Math.floor((common.minz + common.maxz) / 2) + XP,
    }

    bounds = { minx: 33199029,
        maxx: 35699029,
        miny: 47499470,
        maxy: 49899470,
        minz: 47379722,
        maxz: 49679722 };

    bots.forEach((bot, bi) => {
        return;
        console.log(bot);
        let dx = -bot.r;
        for (; dx <= bot.r; dx ++) {
            let x = bot.x + dx;
            if (x < common.minx || x > common.maxx) continue;

            let yext = bot.r - Math.abs(dx);
            console.log(x, dx, yext);
            for (let dy = -yext; dy <= yext; dy ++) {
                let y = bot.y + dy;
                if (y < common.miny || y > common.maxy) continue;
                // console.log(y, dy); 

                let zext = bot.r - Math.abs(dx) - Math.abs(dy);
                for (let dz = -zext; dz <= zext; dz ++) {
                    let z = bot.z + dz;
                    if (z < common.minz || z > common.maxz) continue;

                    let good = true;
                    for (let b = 0; b < bots.length; b ++) {
                        let bot = bots[b];
                        if (Math.abs(bot.x - x) + Math.abs(bot.y - y) + Math.abs(bot.z - z) >= bot.r) {
                            good = false;
                            break;
                        }
                    }
                    if (good) {
                        console.log(x, y, z);
                    }

                    // let near = 0;
                    // nanobots.forEach(other => {
                    //     if (Math.abs(other.x - x) +
                    //         Math.abs(other.y - y) +
                    //         Math.abs(other.z - z)
                    //         <= other.r) {
                    //         near ++;
                    //     }
                    // });
                    // if (near > nanos) {
                    //     nanos = near;
                    //     best = {x, y, z};
                    //     console.log(best, nanos);
                    // }
                }
            }
        }
    });

    let res = {
        minx: common.maxx, //Math.floor((common.minx + common.maxx) / 2) - XM,
        maxx: common.minx, //Math.floor((common.minx + common.maxx) / 2) + XP,
        miny: common.maxy, //Math.floor((common.miny + common.maxy) / 2) - 0,
        maxy: common.miny, //Math.floor((common.miny + common.maxy) / 2) + 200,
        minz: common.maxz, //Math.floor((common.minz + common.maxz) / 2) - XM,
        maxz: common.minz, //Math.floor((common.minz + common.maxz) / 2) + XP,
    }

    let distances = nanobots.map(bot => {
        let d = Math.abs(bot.x) + Math.abs(bot.y) + Math.abs(bot.z);
        return [d - bot.r, d + bot.r];
    });
    distances.sort((d1, d2) => d1[0] - d2[0] || d1[1] - d2[1]);
    console.log(distances);

    let checkpoints = [];
    distances.forEach(d => { checkpoints.push(d[0]); checkpoints.push(d[1]); });
    checkpoints.sort();

    let best1d = 0;
    checkpoints.forEach(x => {
        let contained = 0;
        distances.forEach(d => {
            if (x >= d[0] && x <= d[1]) {
                contained ++;
            }
        });
        if (contained > best1d) {
            best1d = contained;
            console.log(contained, x);
        }
    })

    // let minoverlap = 114454052;
    // let distances = bots.map(bot => {
    //     return bots.map(other => {
    //         let dist = Math.abs(bot.x - other.x) + Math.abs(bot.y - other.y) + Math.abs(bot.z - other.z);
    //         let overlap = bot.r + other.r - dist;
    //         if (overlap === 0) {
    //             minoverlap = overlap;
    //             console.log(minoverlap, bot, other);
    //         }
    //         return overlap;
    //     });
    // });

    // console.log(minoverlap);

    // fs.writeFileSync('distances.txt', distances.map(row=>row.join(' ')).join('\n'));
    return;

    let mindist = 100000000000;
    for (let x = 30699029; x <= bounds.maxx; x += (mindist > 100 ? 1 : 1)) {
        // console.log(x);
        for (let y = 49609470; y <= bounds.maxy; y += (mindist > 100 ? 1 : 1)) {
            // console.log(y);
            for (let z = 45189722; z <= bounds.maxz; z += (mindist > 100 ? 1 : 1)) {
                let good = true;
                for (let b = 0; b < bots.length; b ++) {
                    let bot = bots[b];
                    let dist = Math.abs(bot.x - x) + Math.abs(bot.y - y) + Math.abs(bot.z - z);
                    if (dist > bot.r) {
                        good = false;
                        let excess = dist - bot.r;
                        if (excess <= mindist) {
                            mindist = excess;
                            // console.log(x, y, z, b, bot.x, bot.y, bot.z, bot.r);
                            // console.log(Math.abs(bot.x - x), Math.abs(bot.y - y), Math.abs(bot.z - z))
                            // console.log(excess + ' >= ' + bot.r);
                            // console.log(`min (bot ${b} ${bot.x} ${bot.y} ${bot.z} ${bot.r})`, mindist, x, y, z);
                        }
                        break;
                    }
                }
                if (good) {
                    console.log('------------------- Answer!!! -----------------------');
                    console.log(x, y, z);
                    console.log(x + y + z);
                    return;
                }
            }
        }
    }

    return;

    let best = {x: -7923428, y: 37361276, z: 18802517};
    let nanos = 155;
    bots.forEach((bot, bi) => {
        console.log(bot);
        let dx = -bot.r;
        for (; dx <= bot.r; dx ++) {
            let x = bot.x + dx;
            if (x < common.minx || x > common.maxx) continue;

            let yext = bot.r - Math.abs(dx);
            console.log(x, dx, yext);
            for (let dy = -yext; dy <= yext; dy ++) {
                let y = bot.y + dy;
                if (y < common.miny || y > common.maxy) continue;
                // console.log(y, dy);

                let zext = bot.r - Math.abs(dx) - Math.abs(dy);
                for (let dz = -zext; dz <= zext; dz ++) {
                    let z = bot.z + dz;
                    if (z < common.minz || z > common.maxz) continue;

                    let good = true;
                    for (let b = 0; b < bots.length; b ++) {
                        let bot = bots[b];
                        if (Math.abs(bot.x - x) + Math.abs(bot.y - y) + Math.abs(bot.z - z) >= bot.r) {
                            good = false;
                            break;
                        }
                    }
                    if (good) {
                        console.log(x, y, z);
                    }

                    // let near = 0;
                    // nanobots.forEach(other => {
                    //     if (Math.abs(other.x - x) +
                    //         Math.abs(other.y - y) +
                    //         Math.abs(other.z - z)
                    //         <= other.r) {
                    //         near ++;
                    //     }
                    // });
                    // if (near > nanos) {
                    //     nanos = near;
                    //     best = {x, y, z};
                    //     console.log(best, nanos);
                    // }
                }
            }
        }
    });

    best = {x: 0, y: 0, z: 0};
    nanos = 0;
    let top = Math.max(-minx, maxx) + Math.max(-miny, maxy) + Math.max(-minz, maxz);
    for (let dist = 1005000; dist < top; dist += 10000) {
        if (dist > 100) console.log(dist);
        for (let x = -dist; x <= dist; x += Math.floor(dist / 200)) {

            let yext = dist - Math.abs(x);
            for (let y = -yext; y <= yext; y ++) {
                let zext = yext - Math.abs(y);
                [zext, -zext].forEach(z => {
                    let near = 0;
                    for (let n = 0; n < nanobots.length; n ++) {
                        let other = nanobots[n];
                        if (Math.abs(other.x - x) +
                            Math.abs(other.y - y) +
                            Math.abs(other.z - z)
                            <= other.r) {
                            near ++;
                        }

                        if (near + (nanobots.length - (n + 1)) < nanos) {
                            break;
                        }
                    }
                    if (near > nanos) {
                        nanos = near;
                        best = {x, y, z};
                        // console.log(dist, best, nanos);
                    }
                })
            }
        }
    }

    for (let x = 0; x <= maxx; x ++) {
        for (let y = 0; y <= maxy; y ++) {
            for (let z = 0; z <= maxz; z ++) {
                if (x === 0 && y === 0) z = 15417980;
                let near = 0;
                nanobots.forEach(bot => {
                    if (Math.abs(bot.x - x) + Math.abs(bot.y - y) + Math.abs(bot.z - z) <= bot.r) {
                        near ++;
                    }
                });
                if (near > nanos) {
                    nanos = near;
                    best = {x, y, z};
                    // console.log(best, nanos);
                }
            }
        }
    }
    for (let x = 0; x >= minx; x --) {
        for (let y = 0; y >= miny; y --) {
            for (let z = 0; z >= minz; z --) {
                let near = 0;
                nanobots.forEach(bot => {
                    if (Math.abs(bot.x - x) + Math.abs(bot.y - y) + Math.abs(bot.z - z) <= bot.r) {
                        near ++;
                    }
                });
                if (near > nanos) {
                    nanos = near;
                    best = {x, y, z};
                    // console.log(best, nanos);
                }
            }
        }
    }
    // console.log(best);
    // console.log(nanos);
}

// main('sample');
main('input');
