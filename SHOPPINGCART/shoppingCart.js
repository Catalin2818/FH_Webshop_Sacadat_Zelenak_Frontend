$(document).ready(function(){

    $('[data-toggle="tooltip"]').tooltip();

    var checkbox = $('table tbody input[type="checkbox"]');
    $("#selectAll").click(function()
    {
        if(this.checked){
            checkbox.each(function()
            {
                this.checked = true;
            });
        }
        else
        {
            checkbox.each(function()
            {
                this.checked = false;
            });
        }
    });
    checkbox.click(function()
    {
        if(!this.checked)
        {
            $("#selectAll").prop("checked", false);
        }
    });

    getAllProducts();
});

function addProduct(){

    var addIDInput = document.getElementById("addID").value;
    var addUserIdInput = document.getElementById("addUserId").value;
    var addProductIdInput = document.getElementById("addProductId").value;
    var addProductQuantityInput = document.getElementById("addProductQuantity").value;
    var addFinishedInput = document.getElementById("addFinished").value;

    if(addIDInput == "") {
        addIDInput = 0;
    }

    var user = '{'
        +'"id":'+addUserIdInput +','
        +'"firstName":"",'
        +'"lastName":"",'
        +'"email":"",'
        +'"password": "",'
        +'"cart": "",'
        +'"role": "user",'
        +'"enabled":true,"active":true,"loggedIn":false'
        +'}';
    var cardProducts = '[{'
        +'"id": 0,'
        +'"productQuantity":'+addProductQuantityInput +','
        +'"shoppingCart": 0,'
        +'"productId":'+addProductIdInput
        +'}]';

    var shoppingCart = '{'
        +'"id": ' + addIDInput + ','
        +'"user": ' + user + ','
        +'"cardProducts":' + cardProducts + ','
        +'"productQuantity":1,'
        +'"finished":' +addFinishedInput
        +'}';

        console.log(shoppingCart);

    $.ajax({
        type:"POST",
        url:"http://localhost:8080/cart/addToShoppingCart",
        data:shoppingCart,
        authorization: "Bearer {token}",
        xhrFields:{
            withCredentials:true
        },
        //dataType:'json',
        contentType:"application/json",
        success:function(data){alert("success");
            getAllProducts();
            //TODO close modal
        },
        failure: function(errMsg){alert(errMsg);}
    });

}

function getAllProducts(){

    $.ajax({
        type:"GET",
        url:"http://localhost:8080/cart/getWholeShoppingCart",
        //contentType: 'application/json; charset=utf-8',
        xhrFields:{
            withCredentials:true
        },
        success:function(data){console.log(data);

           const jsonObj = JSON.parse(data);

            /*jsonObj.forEach((shoppingCartInfo,index) =>{
                console.log(`${index} : ${shoppingCartInfo.id}, 
                                        ${shoppingCartInfo.user.id}, 
                                        ${shoppingCartInfo.cardProducts},
                                        ${shoppingCartInfo.productQuantity},
                                        ${shoppingCartInfo.finished}`)
                shoppingCartInfo.cardProducts.forEach((cardProducts, index) => {
                    console.log(`${index} : ${cardProducts.id}, 
                                        ${cardProducts.productId}, 
                                        ${cardProducts.shoppingCart},
                                        ${cardProducts.productQuantity}`)
                });
            });*/

            addProductInTable(jsonObj);
        },
        failure: function(errMsg){alert(errMsg);}
    })
}

function editProductsInModal(event){

    var editShoppingCartIdInput = document.getElementById("editShoppingCartId");
    var editShoppingCartUserIdInput = document.getElementById("editUserId");
    var editShoppingCartProductIdInput = document.getElementById("editProductId");
    var editFinishedInput = document.getElementById("editFinished");

    editShoppingCartIdInput.innerText = event.parentNode.parentNode.cells[1].innerHTML;
    editShoppingCartUserIdInput.value = event.parentNode.parentNode.cells[2].innerHTML;
    editShoppingCartProductIdInput.value = event.parentNode.parentNode.cells[3].innerHTML;
    editFinishedInput.value = event.parentNode.parentNode.cells[4].innerHTML;

}

function editProduct(){

    var editShoppingCartIdInput = document.getElementById("editShoppingCartId").innerHTML;
    var editShoppingCartUserIdInput = document.getElementById("editUserId").innerHTML;
    var editShoppingCartProductIdInput = document.getElementById("editProductId").innerHTML;
    var editFinishedInput = document.getElementById("editFinished").value;

    var shoppingCartT ='{'
        +'"id":' +editShoppingCartIdInput +','
        +'"user":"' +editShoppingCartUserIdInput+'",'
        +'"product":"' +editShoppingCartProductIdInput+'",'
        +'"finished":"' +editFinishedInput+'",'
        +'}';

    $.ajax({
        type:"POST",
        url:"http://localhost:8080/cart/updateShoppingCart",
        data:shoppingCartT,
        dataType: 'json',
        contentType:'application/json; charset=utf-8',
        xhrFields:{
            withCredentials:true
        },
        success:function(data){

            const jsonObj = JSON.parse(data);

            jsonObj.shoppingCart.forEach((shoppingCartInfo,index) =>{
                console.log(`${index} : ${shoppingCartInfo.id}, 
                                        ${shoppingCartInfo.user}, 
                                        ${shoppingCartInfo.products}, 
                                        ${shoppingCartInfo.finished}`)
            });

            addProductInTable(jsonObj.product);

        },
        failure: function (errMsg){alert(errMsg);}
    });
}

function deleteProduct(event){

    var id = event.parentNode.parentNode.cells[1].innerHTML;
    console.log(id);

    $.ajax({
        type:"GET",
        url:"http://localhost:8080/cart/deleteShoppingCart/"+id,
        contentType: 'application/json; charset=utf-8',
        xhrFields:{
            withCredentials:true
        },
        success:function(data){
            getAllProducts();
        },
        failure: function(errMsg){alert(errMsg);}
    });
}

function addProductInTable(shoppingCartData){
    var shoppingCartTable = document.getElementById("shoppingCartTable");
    var shoppingCartHTML = "";
    var leftSideOfProductHTML = "";
    var productHTML = "";
    var rightSideOfInfoHTML = "";

    shoppingCartData.forEach((shoppingCartInfo,index) =>{
        console.log(`${index} : ${shoppingCartInfo.id}, ${shoppingCartInfo.user}, ${shoppingCartInfo.products}, ${shoppingCartInfo.finished}`)

        leftSideOfProductHTML="<tr><td><span className=\"custom-checkbox\"><input type=\"checkbox\" id=\"checkbox1\" name=\"options[]\" value=\"1\"><label htmlFor=\"checkbox1\"></label></span>" +
            "</td><td>"+ shoppingCartInfo.id +"</td><td>"+ shoppingCartInfo.user.id +"</td><td>";
            
        rightSideOfInfoHTML = "</td><td>"+ shoppingCartInfo.finished + "</td>"+
        "</tr>"; 

        shoppingCartInfo.cardProducts.forEach((cardProducts, index) => {
            shoppingCartHTML = shoppingCartHTML + leftSideOfProductHTML + cardProducts.productId +"</td><td>" + cardProducts.productQuantity + rightSideOfInfoHTML;
        });
    });
    
    shoppingCartTable.innerHTML= shoppingCartHTML;
}

