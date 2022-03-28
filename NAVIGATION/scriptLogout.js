function logout() {
    
    $.ajax({
        url: 'http://localhost:8080/logout',
        type: 'GET',
        /*data: JSON.stringify({
            username: emailInput,
            password: passwordInput
        }),*
        xhrFields: {
            withCredentials: true
        },
        headers: {
            Authorization: 'application/json'
        },*/
        success: function (response) {
            getUserId(emailInput);
        },
        error: function (e) {
            alertM.innerHTML = e.responseText;
        }
    })

    localStorage["login"] = "";
    localStorage["shoppingCartId"] = "";
    localStorage["productId"] = "";
    localStorage["userId"] = "";
    location.href = '../STANDARD/logIn.html';
}