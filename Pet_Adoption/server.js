const fs = require('fs');
const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = 5004;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

const expressLayouts = require('express-ejs-layouts');
const { title } = require('process');
app.use(expressLayouts);
app.set('layout', 'layout'); // Set layout.ejs as the default layout

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
    secret: 'secret-key', // Replace with a strong secret key eventually
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}))

// Serve EJS templates
app.get('/', (req, res) => {
    res.render('index', { title: 'DogToGo', currentPage: 'home' });
});

app.get('/dog-care', (req, res) => {
    res.render('dog-care', { title: 'Dog Care', currentPage: 'dog-care' });
});

app.get('/cat-care', (req, res) => {
    res.render('cat-care', { title: 'Cat Care', currentPage: 'cat-care' });
});

app.get('/account', (req, res) => {
    res.render('account', { title: 'Create an Account', currentPage: 'account' });
});

app.get('/giveaway', (req, res) => {
    // If the user is not logged in, redirect to the login page
    if (!req.session.username) {
        return res.render('login', {
            title: 'Login',
            currentPage: 'login',
            message: 'Please log in to access the giveaway page.'
        });
    }
    // Render the giveaway page if the user is logged in
    res.render('giveaway', { title: 'Have a Pet to Give Away', currentPage: 'giveaway', username: req.session.username });
});

app.get('/logout', (req, res) => {
    if (!req.session.username) {
        // If no session exists, redirect to the login page with a message
        return res.render('login', { 
            title: 'Login', 
            currentPage: 'login', 
            message: 'You are already logged out. Please log in to continue.' 
        });
    }

    // Destroy the session if it exists
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('An error occurred while logging out.');
        }
        res.render('logout', { title: 'Log Out', currentPage: 'logout',  });
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us', currentPage: 'contact' });
});

app.get('/privacy', (req, res) => {
    res.render('privacy', { title: 'Privacy', currentPage: 'privacy' });
});

app.get('/find', (req, res) => {
    const query = req.query;

    if (Object.keys(query).length === 0) {  
        // Render the form if no query parameters are present
        res.render('find', { title: 'Find a Dog/Cat', currentPage: 'find', pets: undefined });
    } else {
        // Handle the search if query parameters are present
    const { 'dog-breed': dogBreed, 'dog-age': dogAge, 'dog-gender': dogGender, 'dog-compatibility': dogCompatibility = [],
    'cat-breed': catBreed, 'cat-age': catAge, 'cat-gender': catGender, 'cat-compatibility': catCompatibility = [] } = req.query;
    
    // Mock pet data
    const pets = [
        { name: "Blue", type: "dog", breed: "bulldog", age: "2 months", gender: "male", compatibility: ["dogs", "cats", "children"], image: "Images/bulldog.jpeg" },
        { name: "Whiskers", type: "cat", breed: "persian", age: "1 year", gender: "female", compatibility: ["cats", "children"], image: "Images/kitten.jpg" },
        { name: "Fluffers", type: "dog", breed: "labrador", age: "6 months", gender: "male", compatibility: ["dogs"], image: "Images/labrador.jpg" },
        { name: "Mittens", type: "cat", breed: "siamese", age: "3 years", gender: "female", compatibility: ["cats"], image: "Images/siamese.jpg" }, 
        { name: "Buddy", type: "dog", breed: "golden-retriever", age: "4 years", gender: "male", compatibility: ["dogs", "children"], image: "Images/golden-retriever.jpeg" }, 
        { name: "Shadow", type: "cat", breed: "maine-coon", age: "5 years", gender: "male", compatibility: ["dogs", "children"], image: "Images/maine-coon.webp" }, 
        { name: "Bella", type: "dog", breed: "german-shepherd", age: "2 years", gender: "female", compatibility: ["dogs", "cats"], image: "Images/german-shepherd.webp" }, 
        { name: "Luna", type: "cat", breed: "sphynx", age: "1 year", gender: "female", compatibility: ["children"], image: "Images/sphynx.jpg" }, 
        { name: "Max", type: "dog", breed: "bulldog", age: "3 years", gender: "male", compatibility: ["dogs", "children"], image: "Images/bulldog.jpg" }, 
        { name: "Cleo", type: "cat", breed: "persian", age: "2 years", gender: "female", compatibility: ["cats", "children"], image: "Images/persian.jpg" }
    ];

    // Determine if the search is for dogs or cats
    const isDogSearch = dogBreed || dogAge || dogGender || dogCompatibility.length > 0;
    const isCatSearch = catBreed || catAge || catGender || catCompatibility.length > 0;

    // Filter pets based on the form type (dog or cat)
    const filteredPets = pets.filter(pet => {
        if (isDogSearch && pet.type === "dog") {
            if (dogBreed && dogBreed !== "any" && pet.breed !== dogBreed) return false;

            // Adjust age filter for "puppy"
            if (dogAge && dogAge !== "any") {
            if (dogAge === "puppy" && !pet.age.includes("months")) return false;
            if (dogAge !== "puppy" && !pet.age.includes(dogAge)) return false;
        }
            if (dogGender && dogGender !== "any" && pet.gender !== dogGender) return false;
            if (dogCompatibility && !Array.isArray(dogCompatibility) ? !pet.compatibility.includes(dogCompatibility) : !dogCompatibility.every(c => pet.compatibility.includes(c))) return false;
            return true;
        }

        if (isCatSearch && pet.type === "cat") {
            if (catBreed && catBreed !== "any" && pet.breed !== catBreed) return false;

            // Adjust age filter for "kitten"
            if (catAge && catAge !== "any") {
            if (catAge === "kitten" && !pet.age.includes("months")) return false;
            if (catAge !== "kitten" && !pet.age.includes(catAge)) return false;
        }
            if (catGender && catGender !== "any" && pet.gender !== catGender) return false;
            if (catCompatibility && !Array.isArray(catCompatibility) ? !pet.compatibility.includes(catCompatibility) : !catCompatibility.every(c => pet.compatibility.includes(c))) return false;
            return true;
        }

        return false;
    });
    res.render('find', { title: 'Find a Dog/Cat', currentPage: 'find', pets: filteredPets });
    }
});

// Route to handle user registration
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Validate username and password format
    const usernamePattern = /^[a-zA-Z0-9]+$/;
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/;
    if (!usernamePattern.test(username)) {
        return res.status(400).send("Username can only contain letters and numbers.");
    }
    if (!passwordPattern.test(password)) {
        return res.status(400).send("Password must be at least 4 characters long and contain both letters and numbers.");
    }
    // Check if username already exists
    const loginFilePath = path.join(__dirname, 'data/login.txt');
    const users = fs.readFileSync(loginFilePath, 'utf-8').split('\n').filter(Boolean);

    if (users.some(user => user.split(':')[0] === username)) {
        return res.status(400).send('Username already exists. Please choose a different username.');
    }

    // Add new user to the file
    fs.appendFileSync(loginFilePath, `${username}:${password}\n`);
    res.send('Registration successful, you can now log in.');
});

// Route to handle user login for "Giveaway"
app.post('/login', (req, res) => {
    const {username, password} = req.body;

    const loginFilePath = path.join(__dirname, 'data/login.txt');
    const users = fs.readFileSync(loginFilePath, 'utf-8').split('\n').filter(Boolean);

    const isValidUser = users.some(user => {
        const [storedUsername, storedPassword] = user.split(':');
        return storedUsername === username && storedPassword === password;
    });

    if (isValidUser) {
        req.session.username = username; // Start a session for the user
        console.log('Login successful, redirecting to /giveaway'); // Debugging
        res.redirect('/giveaway'); // Redirect to giveaway page
    } else { 
        console.log('Invalid login attempt'); // Debugging
        res.status(401).send('Invalid username or password.');
    }
});

// Route to handle pet giveaway form submission
app.post('/giveaway', (req, res) => {
    if (!req.session.username) {
        return res.status(401).send('You must be logged in to give away a pet.');
    }
    
    // Destructure form data from the request body
    const {petType, breed, age, gender, compatibility, ownerName, email, comment} = req.body;

    // Validate required fields
    if (!petType || !breed || !age || !gender || !ownerName || !email) {
        return res.status(400).send('All required fields must be filled out.');
    }

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        return res.status(400).send('Please enter a valid email address.');
    }

    const petsFilePath = path.join(__dirname, 'data/available_pet_info.txt');
    const petsData = fs.existsSync(petsFilePath) ? fs.readFileSync(petsFilePath, 'utf-8').split('\n').filter(Boolean) : [];
    const newId = petsData.length + 1; // Simple ID generation

    // Handle compatibility: default to an empty array if undefined
    const compatibilityArray = Array.isArray(compatibility) ? compatibility : (compatibility ? [compatibility] : []);
    const compatibilityString = compatibilityArray.join(',');

    // Create a new pet entry
    const newPetEntry = `${newId}:${req.session.username}:${petType}:${breed}:${age}:${gender}:${compatibilityString}:${ownerName}:${email}:${comment || 'None'}`;
    fs.appendFileSync(petsFilePath, `${newPetEntry}\n`);

    res.send('Pet giveaway information submitted successfully.');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

