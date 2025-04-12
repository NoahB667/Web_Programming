const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const port = 5001;
app.use(cookieParser());

// Route to track number of visits
app.get("/", (req, res) => {
    const currentDate = new Date();
    
    // Get current visit count from cookies, set to 0 if it doesn't exist
    let visits = parseInt(req.cookies.visits);
    if (isNaN(visits)) {
        visits = 0;
    }

    // Increment visit count
    visits++;

    // Store updated visit count in cookie which expires in 1 day
    res.cookie("visits", visits, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });

    // Get the last visit date from cookies
    const lastVisit = req.cookies.lastVisit;

    // Format the current visit date as string with EST/EDT
    const formattedDate = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",  // EST/EDT time zone
        weekday: "short",              // Day of the week (e.g., Sun)
        year: "numeric",              // Year (e.g., 2023)
        month: "short",               // Month (e.g., Mar)
        day: "numeric",               // Day (e.g., 20)
        hour: "2-digit",              // Hour in 2 digits (e.g., 17)
        minute: "2-digit",            // Minute in 2 digits (e.g., 16)
        second: "2-digit",            // Second in 2 digits (e.g., 18)
        timeZoneName: "short",         // Timezone abbreviation (e.g., EST or EDT)
        hour12: false                 // Force 24h format
    }).format(currentDate);

    // Remove unwanted GMT offset part from the date
    const dateWithoutGMT = formattedDate.replace(/ GMT[+-]\d{4} \([^)]+\)/, "");

    // Store the current visit time in the cookie
    res.cookie("lastVisit", dateWithoutGMT, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });

    // Check if it's the first visit or not
    if (visits === 1) {
        res.send(`<h1>Welcome to my webpage! It is your first time that you are here.</h1>`);
    } else {
        // If it's not the first visit, show the visit count and last visit time in EST
        const lastVisitDate = lastVisit || "Never visited before";
        res.send(`<h1>Hello, this is the ${visits} time that you are visiting my webpage.</h1>
                  <h1>Last time you visited my webpage on: ${lastVisitDate}</h1>`);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
