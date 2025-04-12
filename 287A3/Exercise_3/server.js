const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 5002;

// Parse form data
app.use(bodyParser.urlencoded({extended: true}));

// HTML Form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/submit', (req, res) => {
    const name = req.body.name;
    const phone = req.body.phone;
    // Regular expression to check phone number format is correct (ddd-ddd-dddd)
    const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
    if (phonePattern.test(phone)) {
        res.send(`<h1>Thank you ${name}, Your phone number: ${phone} is valid.</h1>`);
    } else {
        res.send(`<h1>Your phone number is invalid, please enter a valid phone number in the format ddd-ddd-dddd.</h1>`);
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
