import { checkPassword } from "../public/JS/validation.js";
import { checkPhoneNumber } from "../public/JS/validation.js";

// Mock objects for passwordInput and button
const passwordInput = {
    style: {
        color: ""
    }
};

const button = {
    disabled: false
};

// import expect from chai
const expect = chai.expect;

// Mocha test for checkPassword function 
describe('#checkPassword', () => {
    it('should return true if password format is correct', () => {
        // Create some valid and invalid passwords
        const badPasswords = ["user123", "User", "useruser"];
        const goodPasswords = ["User123", "useR321"];

        // Check the bad passwords
        for(let password of badPasswords){
            expect( checkPassword(password, passwordInput, button) ).to.equal(false);
        }

        // Check the good passwords
        for(let password of goodPasswords){
            expect( checkPassword(password, passwordInput, button) ).to.equal(true);
        }
    });
});

// Mock objects for passwordInput and button
const phoneNumberInput = {
    style: {
        color: ""
    }
};

// Mocha test for checkPassword function 
describe('#checkPhonenumber', () => {
    it('should return true if phonenumber format is correct', () => {
        // Create some valid and invalid passwords
        const badPhones = ["0552934769", "0553924", ""];
        const goodPhones = ["0552935769", "0554920532"];

        // Check the bad passwords
        for(let phoneNumber of badPhones){
            expect( checkPhoneNumber(phoneNumber, phoneNumberInput) ).to.equal(false);
        }

        // Check the good passwords
        for(let phoneNumber of goodPhones){
            expect( checkPhoneNumber(phoneNumber, phoneNumberInput) ).to.equal(true);
        }
    });
});