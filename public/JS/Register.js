// improting checkPassowrd and checkPhoneNumber from the valdiation.js file for handling validation 
import { checkPassword, checkPhoneNumber } from './validation.js';

// initializing the variables button and passwordInput and phoneNumberInput
let button;
let passwordInput;
let phoneNumberInput;


        

        // function to initialize the page
        window.onload = init;

        function init() {
            // getting the submit button and disable it initially at the start
            button = document.querySelector(".submit input");
            button.disabled = true;
        
            // getting password input and initially setting color to red
            passwordInput = document.getElementById("password");
            passwordInput.style.color = "red";
        
            // getting phone number input and initially setting color to red
            phoneNumberInput = document.getElementById("phoneNumber");
            phoneNumberInput.style.color = "red";
        
            // adding event listener for input on both password and phone number
            passwordInput.addEventListener("input", () => checkPassword(passwordInput.value, passwordInput, button));
            phoneNumberInput.addEventListener("input", () => checkPhoneNumber(phoneNumberInput.value, phoneNumberInput));
        }

       

        window.register = async()=> {
            let username = document.getElementById("username").value;
            let password = document.getElementById("password").value;
            let confirmPassword = document.getElementById("confirmPassword").value;
            let phoneNumber = document.getElementById("phoneNumber").value;
        
            // Convert to JSON
            const UserJSON = JSON.stringify({ username: username, password: password, phoneNumber: phoneNumber });
        
            // Checking if the passwords match
            if (password !== confirmPassword) {
                document.getElementById("msg").innerText = "Passwords do not match.";
                clearForm();
                return;
            }

        
            
               
      
        
            // POST UserJSON to server
            try {
                const response = await fetch('/M00860241/Register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: UserJSON
                });
        
                // Check if registration was successful
                if (response.ok) {
                    // Clear previous error messages
                    document.getElementById("msg").innerText = "";
        
                    // Parse the response JSON
                    const result = await response.json();
                    console.log(result);
        
                    // Display success message
                    document.getElementById("msg").innerText = "Congrats, you are registered!";
                    clearForm();
                    // Reload the page after 2 seconds
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                } else {
                    // Check if the error is due to username already exists
                    if (response.status === 409) {
                        document.getElementById("msg").innerText = "Username already exists!";
                        clearForm();
                    } 
                }
            } catch (err) {
                // Display error message
                console.log("Error registering user: " + err);
                document.getElementById("msg").innerText = "Error registering user. Please try again later.";
            }
        }
        

        // function to clear the registration form
        function clearForm() {
            // Clear input fields
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
            document.getElementById("confirmPassword").value = "";
            document.getElementById("phoneNumber").value = "";

            // Reset input colors
            passwordInput.style.color = "red";
            phoneNumberInput.style.color = "red";

            // disable the submit button again
            button.disabled = true;
        }
