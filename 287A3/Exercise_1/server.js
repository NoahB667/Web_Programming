const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")))

function findSummation(N) {
    const num = parseInt(N, 10);
    if (!isNaN(num) && num > 0) {
        return (num*(num+1))/2
    } else return false;
}

function uppercaseFirstandLast(str) {
    if (typeof str !== 'string') return false;
    return str.split(" ").map(word => {
        if (word.length > 1) {
            const first = word[0].toUpperCase();
            const middle = word.slice(1, -1);
            const last = word[word.length - 1].toUpperCase();
            return first + middle + last;
        } else {
            return word.toUpperCase();
        }
    }).join(" ");
}


function findAverageAndMedian(arr) {
    if (!Array.isArray(arr) || arr.some(isNaN)) return false;
    const numbers = arr.map(Number).sort((a, b) => a - b);
    const average = numbers.reduce((a, b) => a + b, 0)/numbers.length;
    const mid = Math.floor(numbers.length/2);
    let median;
    if (numbers.length % 2 === 0) {
        median = (numbers[mid - 1] + numbers[mid]) / 2;
    } else {
        median = numbers[mid];
    }
    return {average, median}
}

function find4Digits(str) {
    if (typeof str !== 'string') return false;
    const match = str.split(" ").find(word => /^\d{4}$/.test(word));
    if (match !== undefined) {
        return match;
    } else {
        return false;
    }
}

//Routes to handle form submissions
app.post("/summation", (req, res) => {
    const result = findSummation(req.body.N);
    res.send(`Summation result: ${result}`);
});

app.post("/uppercase", (req, res) => {
    const result = uppercaseFirstandLast(req.body.text);
    res.send(`Modified String: ${result}`);
});

app.post("/average-median", (req, res) => {
    const numbers = req.body.numbers.split(",").map(num => num.trim());
    const result = findAverageAndMedian(numbers);
    res.send(`Average: ${result.average}, Median ${result.median}`);
});

app.post("/find4digits", (req, res) => {
    const result = find4Digits(req.body.numString);
    res.send(`First 4-digit number: ${result}`);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
