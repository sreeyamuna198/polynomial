const fs = require("fs");

// -----------------------------------------------------
// 1. READ JSON FILE
// -----------------------------------------------------
const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

const n = data.keys.n;
const k = data.keys.k;

// -----------------------------------------------------
// 2. DECODE Y VALUES (convert base → decimal)
// -----------------------------------------------------
function decode(base, value) {
    return parseInt(value, base);
}

let X = [];
let Y = [];
let count = 0;

for (let key in data) {
    if (key === "keys") continue;

    count++;
    if (count > k) break; // Use minimum required roots

    X.push(parseInt(key));               // x-values from JSON keys
    Y.push(decode(parseInt(data[key].base), data[key].value)); // decoded y-values
}

// -----------------------------------------------------
// 3. COMPUTE CONSTANT TERM USING NEWTON'S METHOD
// -----------------------------------------------------
function computeConstant(X, Y, k) {
    let table = [];

    // Prepare difference table with Y values
    for (let i = 0; i < k; i++) {
        table.push([Y[i]]);
    }

    // Fill divided differences
    for (let col = 1; col < k; col++) {
        for (let row = 0; row < k - col; row++) {
            let numerator = table[row + 1][col - 1] - table[row][col - 1];
            let denominator = X[row + col] - X[row];
            table[row].push(numerator / denominator);
        }
    }

    // Constant term (C) = F[0]
    return table[0][0];
}

let C = computeConstant(X, Y, k);

// -----------------------------------------------------
// 4. PRINT CONSTANT TERM
// -----------------------------------------------------
console.log("Constant C =", C);
