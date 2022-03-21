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
                getUserId(emailInput);
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

function getUserId(emailInput) {
    $.ajax({
        url: 'http://localhost:8080/user/getUserWithEmail/' + emailInput,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        headers: {
            Authorization: 'application/json'
        },
        success: function (data) {
            const jsonObj = JSON.parse(data); 
            localStorage["login"] = jsonObj.role;
            localStorage["userId"] = jsonObj.id;
            getShoppingCartId(jsonObj.id);
        },
        error: function (e) {
            alertM.innerHTML = e.responseText;
        }
    })
}

function getShoppingCartId(userId) {
    $.ajax({
        url: 'http://localhost:8080/cart/getUnfinishedShoppingCartOfUser/' + userId,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        headers: {
            Authorization: 'application/json'
        },
        success: function (data) {
            if(data != undefined) {
            const jsonObj = JSON.parse(data); 
                localStorage["shoppingCartId"] = jsonObj[0].id;
            }
            location.href = '../ProductWithCart/newIndex.html';
        },
        error: function (e) {
            alertM.innerHTML = e.responseText;
        }
    })
}