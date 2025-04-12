function updateDateTime() {
    document.getElementById("dateTime").innerText = new Date().toLocaleString();
}

setInterval(updateDateTime, 1000); // Refresh every second
updateDateTime();

document.addEventListener("DOMContentLoaded", function () {
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

    document.querySelectorAll("form.pet-form").forEach(form => {
        form.addEventListener("submit", function (event) {
            validateForm(event, form);
        });
    });
});



