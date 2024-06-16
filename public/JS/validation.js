

// Function to check if the password meets the criteria set
export function checkPassword(password, passwordInput, button) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
    let result = passwordRegex.test(password);

    // If statement to enable or disable submit button depending on the result of the password
    if (result) {
        button.disabled = false;
        // Green if password does meet the criteria
        passwordInput.style.color = "green";
    } else {
        button.disabled = true;
        // Red if it does not meet the password criteria
        passwordInput.style.color = "red";
    }
    return result;
}

// Function to check if the phone number meets the criteria
export function checkPhoneNumber(phoneNumber, phoneNumberInput) {
    const phoneNumberRegex = /^\d{10}$/;
    let result = phoneNumberRegex.test(phoneNumber);

    // If statement to set phone number color to green or red depending if it meets the phone number regex or not
    if (result) {
        phoneNumberInput.style.color = "green";
    } else {
        phoneNumberInput.style.color = "red";
    }
    return result;
}