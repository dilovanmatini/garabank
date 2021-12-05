// Collecting all functions and executes after loading page.
const CALLBACKS = [];
var ifLoaded = function(callback){
    CALLBACKS.push(callback);
};
window.onload = function(){
    CALLBACKS.forEach(function(callback){
        callback();
    });
};

// Since we don't have server-side, the username and password will be vailable for everyone who checks this file. It is just for test :)
// stored login credientials
const LOGIN_CREDENTIALS = [
    { username: "dilovan", password: "2021" },
    { username: "fatima", password: "2021" }
];
let LOGGED_IN = false;

// This variable checks if used browser is compatible with using local storage or not
let usingStorage = localStorage ? true : false;

/**
 * This function checks the username and password if they meet the stored login credentials or not.
 * @param {string} name 
 * @param {*} pass 
 * @returns it returns the status of the login
 */
function checkLoginCredentials(name, pass){
    let status = false;
    for( let i = 0; i < LOGIN_CREDENTIALS.length; i++ ){
        let data = LOGIN_CREDENTIALS[i];
        if( name == data.username && pass == data.password ){
            status = true;
            break;
        }
    }
    return status;
}

/**
 * This function will work when a user press Login button.
 * It compares and sets the given username and password
 * @returns 
 */
function doLogin(){

    // If the browser does not support storage service, the below message will appear.
    if(!usingStorage){
        alert('You cannot login. The localStorage service is not available.');
        return;
    }

    // Getting Login inputs
    let uname_inp = document.getElementById('uname');
    let upass_inp = document.getElementById('upass');
    let button = document.getElementById('login_button');

    // During checking process, the inputs will be disabled
    uname_inp.setAttribute('disabled', true);
    upass_inp.setAttribute('disabled', true);
    button.setAttribute('disabled', true);

    // Getting inputs values
    let username = uname_inp.value;
    let password = upass_inp.value;

    // Check if the given values exist or not.
    if( checkLoginCredentials(username, password) ){
        localStorage.setItem('uname', username);
        localStorage.setItem('upass', password);
        document.location = 'index.html';
    }
    else{
        // If the given values are not exist, below message will popup.
        alert('The username or password is incorrect. Please try again.');

        // Enabling inputs again for next attempt
        uname_inp.removeAttribute('disabled');
        upass_inp.removeAttribute('disabled');
        button.removeAttribute('disabled');
    }
}

/**
 * Checking Login status and comparing stored data with the actual login data.
 */
function checkLogin(){
    if( usingStorage ){

        // Using try and catch to check login page because the IS_LOGIN_PAGE variable is only declared in Login page.
        let isLoginPage;
        try{
            isLoginPage = IS_LOGIN_PAGE;
        }
        catch(e){
            isLoginPage = false;
        }

        // It checks if the current page is Login page or not.
        if( isLoginPage === true ){
            localStorage.removeItem('uname');
            localStorage.removeItem('upass');
        }

        let uname = localStorage.getItem('uname') || '';
        let upass = localStorage.getItem('upass') || '';

        const link = document.getElementById('login_link');

        // If stored data exist, the Login text will be replaced by Logout.
        if( checkLoginCredentials(uname, upass) ){
            link.innerHTML = "Logout";
            LOGGED_IN = true;
        }
        else{
            link.innerHTML = "Login";
            LOGGED_IN = false;
        }
    }
}

// This function converts any value to numbers. Even it converts NaN to 0.
function ConvertToNumber( value ){
    value = parseInt(value);
    return isNaN(value) ? 0 : value;
};

function SelectByValue( select, value ){
    for( let i = 0; i < select.options.length; i++ ){
        if( select.options[i].value == value ){
            select.selectedIndex = i;
            break;
        }
    }
}



// The code inside this function will be executed after the page will be fully loaded.
ifLoaded(function(){

    // Running the Login checks to perform some actions.
    checkLogin();














    // on press Calculate button
    // document.getElementById("calculate").addEventListener('click', function() {
    //     // getting house price from user input
    //     var house_price = ConvertToNumber(document.getElementById('house_price').value);
    //     // getting salary category from user selection
    //     var salary_category = ConvertToNumber(document.getElementById('salary').value);

    //     // getting advance payment from user input
    //     var advance_payment = ConvertToNumber(document.getElementById('advance').value);

    //     var principal_percentage; // the bank will pay for the house based on salary

    //     if( salary_category == 1 ){ // if salary less than 30,000
    //         document.write("Unfortunately, you are not eligible to receive the mortgage because your salary is less than the 30,000.");
    //     }
    //     else if( salary_category == 30 ){ // if salary between 30,000 - 44,999
    //         principal_percentage = 25/100;
    //     }
    //     else if( salary_category == 45 ){ // if salary between 45,000 - 54,999
    //         principal_percentage = 30/100;
    //     }
    //     else if( salary_category == 55 ){ // if salary between 55,000 - 69,999
    //         principal_percentage = 35/100;
    //     }
    //     else if( salary_category == 70 ){ // if salary greater than or equal to 70,000
    //         principal_percentage = 45/100;
    //     }
    //     else{
    //         document.write("Please, select your yearly salary from the drop down list.");
    //     }

    //     if( advance_payment / ( house_price / 100 ) < 20 ){
    //         document.write("Unfortunately, you are not eligible to receive the mortgage because the advance payment is less than 20% of the house price.");
    //     }

    //     var principal = principal_percentage * house_price;

    //     var interist = 5; // Percentage
    //     interist = interist / 100; // Percentage to actual numbers
    //     interist = interist / 12; // divided on months

    //     var number_of_periods = 10; // Years
    //     number_of_periods = number_of_periods * 12; // N = Number of periods = 10*12 = 120

    //     // Based on M = P[I(1+I)^N]/[(1+I)^N–1] equation
    //     var monthly_payment = ( principal * interist * Math.pow( 1 + interist, number_of_periods ) ) / ( Math.pow( 1 + interist, number_of_periods ) - 1);

    //     var total_payment = monthly_payment * number_of_periods; // total amount of money that should return to the bank
    //     var interist_value = total_payment - principal;

    //     var output = "";

    //     output += "Loan (Principal) Percentage: "+(principal_percentage * 100)+"%<br>";
    //     output += "Loan (Principal) Value: $"+principal+"<br>";
    //     output += "Monthly Payment: $"+Math.ceil(monthly_payment)+"<br>";
    //     output += "Total Payment: $"+Math.ceil(total_payment)+"<br>";
    //     output += "Total Interist: $"+Math.ceil(interist_value)+"<br>";

    //     document.getElementById('calculation_results').innerHTML = output;
    // });
});