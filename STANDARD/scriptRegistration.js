function createAccount(){
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var password = document.getElementById("password").value;
    var email = document.getElementById("email").value;
    var alertM = document.getElementById("alertMessage");

    if(email.length >=1 && password.length >=1 &&
        (email.length >=1 && email.match(".+@.+\\.[A-z]{2,4}") &&
        !firstName.includes(" ") && !lastName.includes(" ") &&
        !email.includes(" ") && !password.includes(" "))) {

        var user = '{'
            +'"id": 0,'
            +'"firstName":"' +firstName+'",'
            +'"lastName":"' +lastName+'",'
            +'"email":"' +email+'",'
            +'"password": "'+password+'",'
            +'"cart": "1",'
            +'"role": "user",'
            +'"enabled": true,'
            +'"active": true,'
            +'"loggedIn": false'
            +'}';

        $.ajax({
            type:"POST",
            url:"http://localhost:8080/user/registration",
            data:user,
            contentType:'application/json',
            success:function(data){
console.log(data);
                location.href = 'logIn.html';
            },
            failure: function(errMsg){alert(errMsg);}
        });

        /*$.ajax({
            url: 'http://localhost:8080/user/registration',
            type: 'POST',
            data: {
                user: 'User',
                password: 'Password',
                email: 'Email'
            },
            success: function (response) {
                window.location.href="http://localhost:63342/FHJavaSemesterProject/index.html";

            },
            error: function (e) {
                console.log("error");
            }
        })*/
    }
    else{
        alertM.innerHTML="Every field has to be filled out correctly";
        console.log(alertM);
    }
}

