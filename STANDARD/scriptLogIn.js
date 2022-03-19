function logInAccount(){
    var emailInput = document.getElementById("email").value;
    var passwordInput = document.getElementById("password").value;
    var alertM = document.getElementById("alertMessage");

    if(emailInput.length >=1 && passwordInput.length >=1) {

        $.ajax({
            url: 'http://localhost:8080/login',
            type: 'POST',
            data: JSON.stringify({
                username: emailInput,
                password: passwordInput
            }),
            xhrFields: {
                withCredentials: true
            },
            headers: {
                Authorization: 'application/json'
            },
            success: function (response) {
                location.href = 'index.html';
                console.log("success");

                sessionStorage.setItem('login', response);
            },
            error: function (e) {
                alertM.innerHTML = e.responseText;
            }
        })
    }
    else{
        alertM.innerHTML="Benutzername oder Passwort ist falsch";
        console.log(alertM);
    }
}