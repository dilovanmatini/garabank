// this function converts any value to numbers.
var ConvertToNumber = function( value ){
    value = parseInt(value);
    return isNaN(value) ? 0 : value;
};

window.onload = function(){
    // on press Calculate button
    document.getElementById("calculate").addEventListener('click', function() {
        // getting house price from user input
        var house_price = ConvertToNumber(document.getElementById('house_price').value);
        // getting salary category from user selection
        var salary_category = ConvertToNumber(document.getElementById('salary').value);

        // getting advance payment from user input
        var advance_payment = ConvertToNumber(document.getElementById('advance').value);

        var principal_percentage; // the bank will pay for the house based on salary

        if( salary_category == 1 ){ // if salary less than 30,000
            document.write("Unfortunately, you are not eligible to receive the mortgage because your salary is less than the 30,000.");
        }
        else if( salary_category == 30 ){ // if salary between 30,000 - 44,999
            principal_percentage = 25/100;
        }
        else if( salary_category == 45 ){ // if salary between 45,000 - 54,999
            principal_percentage = 30/100;
        }
        else if( salary_category == 55 ){ // if salary between 55,000 - 69,999
            principal_percentage = 35/100;
        }
        else if( salary_category == 70 ){ // if salary greater than or equal to 70,000
            principal_percentage = 45/100;
        }
        else{
            document.write("Please, select your yearly salary from the drop down list.");
        }

        if( advance_payment / ( house_price / 100 ) < 20 ){
            document.write("Unfortunately, you are not eligible to receive the mortgage because the advance payment is less than 20% of the house price.");
        }

        var principal = principal_percentage * house_price;

        var interist = 5; // Percentage
        interist = interist / 100; // Percentage to actual numbers
        interist = interist / 12; // divided on months

        var number_of_periods = 10; // Years
        number_of_periods = number_of_periods * 12; // N = Number of periods = 10*12 = 120

        // Based on M = P[I(1+I)^N]/[(1+I)^N–1] equation
        var monthly_payment = ( principal * interist * Math.pow( 1 + interist, number_of_periods ) ) / ( Math.pow( 1 + interist, number_of_periods ) - 1);

        var total_payment = monthly_payment * number_of_periods; // total amount of money that should return to the bank
        var interist_value = total_payment - principal;

        var output = "";

        output += "Loan (Principal) Percentage: "+(principal_percentage * 100)+"%<br>";
        output += "Loan (Principal) Value: $"+principal+"<br>";
        output += "Monthly Payment: $"+Math.ceil(monthly_payment)+"<br>";
        output += "Total Payment: $"+Math.ceil(total_payment)+"<br>";
        output += "Total Interist: $"+Math.ceil(interist_value)+"<br>";

        document.getElementById('calculation_results').innerHTML = output;
    });
};