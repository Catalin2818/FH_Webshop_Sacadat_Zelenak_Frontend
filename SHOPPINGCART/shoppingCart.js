$(document).ready(function(){

    // Activate tooltip
    $('[data-toggle="tooltip"]').tooltip();

    // Select/Deselect checkboxes
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

    var addUserIdInput = document.getElementById("addUserId").value;
    var addProductIdInput = document.getElementById("addProductId").value;
    var addFinishedInput = document.getElementById("addFinished").value;

    var shoppingCart = '{'
        //+'"id": 1,'
        +'"user":"' +addUserIdInput+'",'
        +'"products":"' +addProductIdInput+'",'
        +'"finished":"' +addFinishedInput+'",'
        +'}';

    $.ajax({
        type:"POST",
        url:"http://localhost:8080/cart/addToShoppingCart",
        data:shoppingCart,
        authorization: "Bearer {token}",
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
        success:function(data){console.log(data);

           const jsonObj = JSON.parse(data);

            jsonObj.shoppingCart.forEach((shoppingCartInfo,index) =>{
                console.log(`${index} : ${shoppingCartInfo.id}, 
                                        ${shoppingCartInfo.user}, 
                                        ${shoppingCartInfo.products}, 
                                        ${shoppingCartInfo.finished}`)
            });

            addProductInTable(jsonObj.product);
            console.log(data);
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
        success:function(data){
            getAllProducts();
        },
        failure: function(errMsg){alert(errMsg);}
    });
}

function addProductInTable(shoppingCartData){
    var shoppingCartTable = document.getElementById("shoppingCartTable");
    var productHTML = "";

    shoppingCartData.forEach((shoppingCartInfo,index) =>{
        console.log(`${index} : ${shoppingCartInfo.id}, ${shoppingCartInfo.user}, ${shoppingCartInfo.products}, ${shoppingCartInfo.finished}`)

        productHTML=productHTML + "<tr><td><span className=\"custom-checkbox\"><input type=\"checkbox\" id=\"checkbox1\" name=\"options[]\" value=\"1\"><label htmlFor=\"checkbox1\"></label></span>" +
            "</td><td>"+ shoppingCartInfo.id +"</td><td>"+ shoppingCartInfo.user +"</td><td>"+ shoppingCartInfo.products +"</td><td>"+ shoppingCartInfo.finished +
            "<button type=\"button\" className=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#editShoppingCart\" onclick='editProductsInModal(this)'><i class=\"fa fa-pencil\" aria-hidden=\"true\" data-toggle=\"tooltip\" title=\"Edit\"></i></button>" +
            "<button type=\"button\" className=\"btn btn-primary\" onclick=deleteProduct(this)><i class=\"fa fa-trash-o\" aria-hidden=\"true\" data-toggle=\"tooltip\" title=\"Delete\"></i></button>"+
            "</td>" +
            "</tr>";
    });
    console.log(productHTML);
    shoppingCartTable.innerHTML= shoppingCartHTML;
}

