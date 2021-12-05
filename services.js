const APPLICATIONS = [];
const SALARIES = [];
SALARIES[1] = "Less than 30,000";
SALARIES[30] = "30,000 - 44,999";
SALARIES[45] = "45,000 - 54,999";
SALARIES[55] = "55,000 - 69,999";
SALARIES[70] = "70,000 and above";
class Services{
    static main;
    static form;
    static result;
    static result_customer;
    static result_staff;
    static Calculator( house_price, salary_category, advance_payment ){

        let response = {
            error: false,
            errorMessage: ""
        };

        var principal_percentage; // the bank will pay for the house based on salary

        if( salary_category == 1 ){ // if salary less than 30,000
            response.error = true;
            response.errorMessage = "Unfortunately, you are not eligible to receive the mortgage because your salary is less than the 30,000.";
            return response;
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
            response.error = true;
            response.errorMessage = "Please, select your yearly salary from the drop down list.";
            return response;
        }

        if( advance_payment / ( house_price / 100 ) < 20 ){
            response.error = true;
            response.errorMessage = "Unfortunately, you are not eligible to receive the mortgage because the advance payment is less than 20% of the house price.";
            return response;
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

        response.principal_percentage = principal_percentage * 100;
        response.principal = principal;
        response.monthly_payment = Math.ceil(monthly_payment);
        response.total_payment = Math.ceil(total_payment);
        response.total_interist = Math.ceil(interist_value);

        return response;
    }
    static ShowForm(){
        Services.main.style.display = 'none';
        Services.form.style.display = 'block';
    }
    static ShowResult(){
        Services.form.style.display = 'none';
        Services.result.style.display = 'block';
        if( LOGGED_IN ){
            Services.result_staff.style.display = 'inline-block';
        }
        else{
            Services.result_customer.style.display = 'block';
        }
    }
    static ReloadApplications(){
        if( usingStorage ){
            let apps = JSON.stringify({
                items: APPLICATIONS
            });
            localStorage.setItem('apps', apps);
        }
    }
    static LoadApplications(){
        if( usingStorage ){
            let apps = JSON.parse( localStorage.getItem('apps') || "{}" );
            if( apps.items && apps.items.length > 0 ){
                for( let i = 0; i < apps.items.length; i++ ){
                    APPLICATIONS.push(apps.items[i]);
                }
            }
        }
    }
    static SetApplication( params ){
        if( usingStorage ){
            APPLICATIONS.push(params);
            let apps = JSON.stringify({
                items: APPLICATIONS
            });
            localStorage.setItem('apps', apps);
        }
    }
    static GetApplicationByID( id ){
        for( let i = 0; i < APPLICATIONS.length; i++ ){
            let app = APPLICATIONS[i];
            if( app.id == id ){
                return app;
            }
        }
        return false;
    }
    static DeleteApplicationByID( id ){
        for( let i = 0; i < APPLICATIONS.length; i++ ){
            let app = APPLICATIONS[i];
            if( app.id == id ){
                APPLICATIONS.splice(i, 1);
                break;
            }
        }
        Services.ReloadApplications();
    }
    static FetchApplications(){

        let table = document.getElementById('applications');
        if( usingStorage && table ){
            if( LOGGED_IN === true ){
                table.style.display = 'table';
                for( let i = 0; i < APPLICATIONS.length; i++ ){
                    let app = APPLICATIONS[i];
                    let row = table.insertRow(table.rows.length);
                    let cell1 = row.insertCell(0);
                    let cell2 = row.insertCell(1);
                    let cell3 = row.insertCell(2);
                    let cell4 = row.insertCell(3);
                    let cell5 = row.insertCell(4);
                    let cell6 = row.insertCell(5);
        
                    cell1.innerHTML = app.id;
                    cell2.innerHTML = app.firstname +" "+app.lastname;
                    cell3.innerHTML = app.house_price;
                    cell4.innerHTML = app.salary;
                    cell5.innerHTML = app.advance_payment;
                    cell6.innerHTML = '<button onclick="Services.ProceedApplication('+app.id+');">Proceed</button>';
                }
            }
        }
    }
    static ProceedApplication( id ){
        let app = Services.GetApplicationByID( id );
        if( app === false ) return;

        document.getElementById('app-id').value = id;
        document.getElementById('first-name').value = app.firstname;
        document.getElementById('last-name').value = app.lastname;
        document.getElementById('email').value = app.email;
        document.getElementById('phone').value = app.phone;
        document.getElementById('address').value = app.address;

        document.getElementById('hourse-price').value = app.house_price;
        SelectByValue( document.getElementById('salary'), app.salary );
        document.getElementById('advance-payment').value = app.advance_payment;

        Services.ShowForm();
    }
    static GenerateForm( id, calc ){
        if( !usingStorage || !LOGGED_IN ){
            return;
        }

        let app = Services.GetApplicationByID( id );
        if( app === false ) return;

        document.getElementById('form-app-id').innerHTML = app.id;
        document.getElementById('form-name').innerHTML = app.firstname+" "+app.lastname;
        document.getElementById('form-email').innerHTML = app.email;
        document.getElementById('form-phone').innerHTML = app.phone;
        document.getElementById('form-address').innerHTML = app.address;
        document.getElementById('form-house-price').innerHTML = app.house_price;
        document.getElementById('form-salary').innerHTML = SALARIES[app.salary];
        document.getElementById('form-advance-payment').innerHTML = app.advance_payment;
        document.getElementById('form-principle').innerHTML = '$ '+calc.principal+' <span>'+calc.principal_percentage+'%</span>';
        document.getElementById('form-monthly-payment').innerHTML = '$ '+calc.monthly_payment+' <span>For 10 years</span>';
        document.getElementById('form-total-payment').innerHTML = '$ '+calc.total_payment;
        document.getElementById('form-total-interist').innerHTML = '$ '+calc.total_interist;

        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);
  
        function drawChart(){
            var data = google.visualization.arrayToDataTable([
                ['',            ''],
                ['Loan',        calc.principal],
                ['Interist',    calc.total_interist]
            ]);
            var chart = new google.visualization.PieChart(document.getElementById('diagram'));
            chart.draw(data, {});
        }
    }
    static GenerateID(){
        return ConvertToNumber( Math.random() * 1000000 );
    }
    static SaveInfo(){

        let app_id = ConvertToNumber( document.getElementById('app-id').value );
        let firstname = document.getElementById('first-name').value;
        let lastname = document.getElementById('last-name').value;
        let email = document.getElementById('email').value;
        let phone = document.getElementById('phone').value;
        let address = document.getElementById('address').value;

        let house_price = ConvertToNumber( document.getElementById('hourse-price').value );
        let salary = ConvertToNumber( document.getElementById('salary').value );
        let advance_payment = ConvertToNumber( document.getElementById('advance-payment').value );

        if( firstname == "" ){
            alert('Please, write the first name');
        }
        else if( lastname == "" ){
            alert('Please, write the last name');
        }
        else if( email == "" ){
            alert('Please, write the email address');
        }
        else if( phone == "" ){
            alert('Please, write the phone number');
        }
        else if( address == "" ){
            alert('Please, write the address');
        }
        else if( house_price == 0 ){
            alert('Please, write house price');
        }
        else if( salary == 0 ){
            alert('Please, select the salary ');
        }
        else if( advance_payment == 0 ){
            alert('Please, write the advance payment');
        }
        else{
            let calc = Services.Calculator( house_price, salary, advance_payment );

            if( calc.error === true ){
                alert(calc.errorMessage);
            }
            else{
                if( app_id == 0 ){
                    app_id = Services.GenerateID();
                }
                Services.DeleteApplicationByID(app_id);
                let app = {
                    id: app_id,
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    phone: phone,
                    address: address,

                    house_price: house_price,
                    salary: salary,
                    advance_payment: advance_payment
                };
                Services.SetApplication(app);
                Services.GenerateForm(app_id, calc);
                Services.ShowResult();
            }
        }
    }
};

ifLoaded(function(){
    // Assigning Apply elements to the static properties.
    Services.main = document.getElementById("apply-main");
    Services.form = document.getElementById("apply-form");
    Services.result = document.getElementById("apply-result");
    Services.result_customer = document.getElementById("apply-customer");
    Services.result_staff = document.getElementById("apply-staff");

    Services.LoadApplications();

    Services.FetchApplications();

    document.getElementById("apply").addEventListener('click', function(){
        Services.ShowForm();
        return false;
    });

    document.getElementById("do-apply").addEventListener('click', function(){
        Services.SaveInfo();
        return false;
    });
});













/*



*/




// this function converts any value to numbers.
// var ConvertToNumber = function( value ){
//     value = parseInt(value);
//     return isNaN(value) ? 0 : value;
// };

// window.onload = function(){
//     document.getElementById("check-mortgage").addEventListener('click', function(){
//         Services.ShowApplyingCheck();
//         return false;
//     });

//     // // on press Calculate button
//     // document.getElementById("calculate").addEventListener('click', function() {
//     //     // getting house price from user input
//     //     var house_price = ConvertToNumber(document.getElementById('house_price').value);
//     //     // getting salary category from user selection
//     //     var salary_category = ConvertToNumber(document.getElementById('salary').value);

//     //     // getting advance payment from user input
//     //     var advance_payment = ConvertToNumber(document.getElementById('advance').value);

//     //     var principal_percentage; // the bank will pay for the house based on salary

//     //     if( salary_category == 1 ){ // if salary less than 30,000
//     //         document.write("Unfortunately, you are not eligible to receive the mortgage because your salary is less than the 30,000.");
//     //     }
//     //     else if( salary_category == 30 ){ // if salary between 30,000 - 44,999
//     //         principal_percentage = 25/100;
//     //     }
//     //     else if( salary_category == 45 ){ // if salary between 45,000 - 54,999
//     //         principal_percentage = 30/100;
//     //     }
//     //     else if( salary_category == 55 ){ // if salary between 55,000 - 69,999
//     //         principal_percentage = 35/100;
//     //     }
//     //     else if( salary_category == 70 ){ // if salary greater than or equal to 70,000
//     //         principal_percentage = 45/100;
//     //     }
//     //     else{
//     //         document.write("Please, select your yearly salary from the drop down list.");
//     //     }

//     //     if( advance_payment / ( house_price / 100 ) < 20 ){
//     //         document.write("Unfortunately, you are not eligible to receive the mortgage because the advance payment is less than 20% of the house price.");
//     //     }

//     //     var principal = principal_percentage * house_price;

//     //     var interist = 5; // Percentage
//     //     interist = interist / 100; // Percentage to actual numbers
//     //     interist = interist / 12; // divided on months

//     //     var number_of_periods = 10; // Years
//     //     number_of_periods = number_of_periods * 12; // N = Number of periods = 10*12 = 120

//     //     // Based on M = P[I(1+I)^N]/[(1+I)^N–1] equation
//     //     var monthly_payment = ( principal * interist * Math.pow( 1 + interist, number_of_periods ) ) / ( Math.pow( 1 + interist, number_of_periods ) - 1);

//     //     var total_payment = monthly_payment * number_of_periods; // total amount of money that should return to the bank
//     //     var interist_value = total_payment - principal;

//     //     var output = "";

//     //     output += "Loan (Principal) Percentage: "+(principal_percentage * 100)+"%<br>";
//     //     output += "Loan (Principal) Value: $"+principal+"<br>";
//     //     output += "Monthly Payment: $"+Math.ceil(monthly_payment)+"<br>";
//     //     output += "Total Payment: $"+Math.ceil(total_payment)+"<br>";
//     //     output += "Total Interist: $"+Math.ceil(interist_value)+"<br>";

//     //     document.getElementById('calculation_results').innerHTML = output;
//     // });
// };