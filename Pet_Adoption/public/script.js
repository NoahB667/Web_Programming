const { response } = require("express");

function updateDateTime() {
    document.getElementById("dateTime").innerText = new Date().toLocaleString();
}

setInterval(updateDateTime, 1000); // Refresh every second
updateDateTime();

document.addEventListener("DOMContentLoaded", function () {

    // Function to validate form inputs
    function validateForm(event, form) {
        event.preventDefault(); // Prevent form submission

        let isValid = true;
        let errorMessages = [];

        // Validate all select fields
        form.querySelectorAll("select").forEach(select => {
            if (!select.value) {
                let label = select.previousElementSibling ? select.previousElementSibling.textContent : "Field";
                errorMessages.push(`${label} is required.`);
                isValid = false;
            }
        });

        // Show alert if any errors exist
        if (!isValid) {
            alert(errorMessages.join("\n"));
            return;
        }

        // Collect form data
        const formData = new FormData(form);
        const queryParams = new URLSearchParams(formData).toString();

        // Fetch matching pets from the server
        fetch(`/search-pets?${queryParams}`)
            .then(response => response.json())
            .then(data => {
                const petsContainer = document.querySelector(".pets-container");
                petsContainer.innerHTML = ""; // Clear existing pets

                if (data.length === 0) {
                    petsContainer.innerHTML = "<p>No matching pets found.</p>";
                    return;
                }

                // Display matching pets
                data.forEach(pet => {
                const petElement = document.createElement("div");
                petElement.classList.add("pet");
                petElement.innerHTML = `
                <img src="${pet.image}" alt="${pet.breed}">
                <div class="pet-details">
                    <h3>${pet.name}</h3>
                    <p><strong>Breed:</strong> ${pet.breed}</p>
                    <p><strong>Age:</strong> ${pet.age}</p>
                    <p><strong>Gender:</strong> ${pet.gender}</p>
                    <p><strong>Gets along with:</strong> ${pet.compatibility.join(", ")}</p>
                    <button class="interested-btn">Interested</button>
                </div>`;
                petsContainer.appendChild(petElement);
            });
        }).catch(error => console.error("Error fetching pets:", error));
    
        // Validate all text inputs
        form.querySelectorAll("input[type='text']").forEach(input => {
            if (input.value.trim() === "") {
                let label = input.previousElementSibling ? input.previousElementSibling.textContent : "Field";
                errorMessages.push(`${label} is required.`);
                isValid = false;
            }
        });

        // Validate email format 
        let emailInput = form.querySelector("input[type='text'][id='email']");
        if (emailInput) {
            let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(emailInput.value.trim())) {
                errorMessages.push("Please enter a valid email address.");
                isValid = false;
            }
        }

        // Validate textareas
        form.querySelectorAll("textarea").forEach(textarea => {
            if (textarea.value.trim() === "") {
                let label = textarea.previousElementSibling ? textarea.previousElementSibling.textContent : "Field";
                errorMessages.push(`${label} is required.`);
                isValid = false;
            }
        });

        // Show alert if any errors exist
        if (!isValid) {
            alert(errorMessages.join("\n"));
        } else {
            alert("Form submitted successfully!");
        }
    }

    // Validate registration form
    const registrationForm = document.querySelector("form[action='/register']");
    if (registrationForm) {
        registrationForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent form submission

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            const usernamePattern = /^[a-zA-Z0-9]+$/;
            const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/;

            let errorMessages = [];

            if (!usernamePattern.test(username)) {
                errorMessages.push("Invalid username. It can only contain letters and numbers.");
            }

            if (!passwordPattern.test(password)) {
                errorMessages.push("Invalid password. It must be at least 4 characters long and contain at least one letter and one number.");
            }

            if (errorMessages.length > 0) {
                alert(errorMessages.join("\n"));
                return;
            }

            // If validation passes, proceed with form submission
            fetch('/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ username, password })
            }).then(response => response.text()).then(message => {
                alert(message); // Show success message
                if (message.includes("successfully created")) {
                    registrationForm.reset(); // Reset the form
                    registrationForm.reset();
                }
            }).catch(error => console.error("Error:", error));
        });
    }

    // Validate login form
    const loginForm = document.querySelector("form[action='/login']");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent form submission

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            const usernamePattern = /^[a-zA-Z0-9]+$/;
            const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/;
            let errorMessages = [];

            if (!usernamePattern.test(username)) {
                errorMessages.push("Invalid username. It can only contain letters and numbers.");
            }
            if (!passwordPattern.test(password)) {
                errorMessages.push("Invalid password. It must be at least 4 characters long and contain at least one letter and one number.");
            }
            if (errorMessages.length > 0) {
                alert(errorMessages.join("\n"));
                return;
            }

            // If validation passes, proceed with form submission 
            fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Login failed. Please check your credentials.');
                    }
                    return response.text();
                })
                .then(message => {
                    alert(message);
                    document.querySelector(".giveaway-form").style.display = "block"; // Show the giveaway form
                    loginForm.style.display = "none"; // Hide the login form
                })
                .catch(error => alert(error.message));
    });

    // Validate and submit pet giveaway form
    const giveawayForm = document.querySelector("form[action='/giveaway']");
    if (giveawayForm) {
        giveawayForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent default form submission

            // Collect form data
            const formData = new FormData(giveawayForm);
            const data = Object.fromEntries(formData.entries());
            data.compatibility = formData.getAll("compatibility"); // Handle checkboxes

            // Validate required fields
            const requiredFields = ["petType", "breed", "age", "gender", "ownerName", "email"];
            const errorMessages = [];

            requiredFields.forEach(field => {
                if (!data[field] || data[field].trim() === "") {
                    errorMessages.push(`${field} is required.`);
                }
            });

            // Validate email format
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(data.email)) {
                errorMessages.push("Please enter a valid email address.");
            }

            // Show errors if validation fails
            if (errorMessages.length > 0) {
                alert(errorMessages.join("\n"));
                return;
            }

            // Submit giveaway form via fetch
            fetch('/giveaway', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to submit pet giveaway.');
                    }
                    return response.text();
                })
                .then(message => {
                    alert(message); // Show success message
                    giveawayForm.reset(); // Reset the form
                })
                .catch(error => alert(error.message)); // Show error message
        });
    }

    // Attach event listeners to both pet forms
    document.querySelectorAll("form.pet-form").forEach(form => {
        form.addEventListener("submit", function (event) {
            validateForm(event, form);
        });
     });
    }
});



