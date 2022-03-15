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


    /*var addProduktNameInput = document.getElementById("addProductName").value;
    var addProduktHerkunftInput = document.getElementById("addProductOrigin").value;
    var addProduktBeschrInput = document.getElementById("addProductDesc").value;
    var addProduktAllergeneInput = document.getElementById("addProductAllergens").value;
    var addProduktPreisInput = document.getElementById("addProductPrice").value;
    var addProduktStueckanzahlInput = document.getElementById("addProductQuantity").value;
    var addProduktKategorieInput = document.getElementById("addProductCategory").value;
    var addProduktAgbeholtInput = document.getElementById("addProductPickup").value;*/

    var shoppingCart = '{'
        //+'"id": 1,'
        +'"user":"' +addUserIdInput+'",'
        +'"products":"' +addProductIdInput+'",'
        +'"finished":"' +addFinishedInput+'",'
        /*+'"productAllergens": "'+addProduktAllergeneInput+'",'
        +'"productPrice": '+addProduktPreisInput+','
        +'"productQuantity": '+addProduktStueckanzahlInput+','
        +'"productCategory": "'+addProduktKategorieInput+'",'
        +'"productPickup": "'+addProduktAgbeholtInput +'"'*/
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
    /*var editProductAllergensInput = document.getElementById("editProductAllergens");
    var editProductPriceInput = document.getElementById("editProductPrice");
    var editProductQuantityInput = document.getElementById("editProductQuantity");
    var editProductCategoryInput = document.getElementById("editProductCategory");
    var editProductPickupInput = document.getElementById("editProductPickup");*/

    editShoppingCartIdInput.innerText = event.parentNode.parentNode.cells[1].innerHTML;
    editShoppingCartUserIdInput.value = event.parentNode.parentNode.cells[2].innerHTML;
    editShoppingCartProductIdInput.value = event.parentNode.parentNode.cells[3].innerHTML;
    editFinishedInput.value = event.parentNode.parentNode.cells[4].innerHTML;
    /*editProductAllergensInput.value = event.parentNode.parentNode.cells[5].innerHTML;
    editProductPriceInput.value = event.parentNode.parentNode.cells[6].innerHTML;
    editProductQuantityInput.value = event.parentNode.parentNode.cells[7].innerHTML;
    editProductCategoryInput.value = event.parentNode.parentNode.cells[8].innerHTML;
    editProductPickupInput.value = event.parentNode.parentNode.cells[9].innerHTML;*/

}

function editProduct(){


    var editShoppingCartIdInput = document.getElementById("editShoppingCartId").innerHTML;
    var editShoppingCartUserIdInput = document.getElementById("editUserId").innerHTML;
    var editShoppingCartProductIdInput = document.getElementById("editProductId").innerHTML;
    var editFinishedInput = document.getElementById("editFinished").value;

    /*var editProductIdInput = document.getElementById("editProductID").innerHTML;
    var editProductNameInput = document.getElementById("editProductName").value;
    var editProductOriginInput = document.getElementById("editProductOrigin").value;
    var editProductDescInput = document.getElementById("editProductDesc").value;
    var editProductAllergensInput = document.getElementById("editProductAllergens").value;
    var editProductPriceInput = document.getElementById("editProductPrice").value;
    var editProductQuantityInput = document.getElementById("editProductQuantity").value;
    var editProductCategoryInput = document.getElementById("editProductCategory").value;
    var editProductPickupInput = document.getElementById("editProductPickup").value;*/


    var shoppingCartT ='{'
        +'"id":' +editShoppingCartIdInput +','
        +'"user":"' +editShoppingCartUserIdInput+'",'
        +'"product":"' +editShoppingCartProductIdInput+'",'
        +'"finished":"' +editFinishedInput+'",'
        /*+'"productAllergens": "'+editProductAllergensInput+'",'
        +'"productPrice": '+editProductPriceInput+','
        +'"productQuantity": '+editProductQuantityInput+','
        +'"productCategory": "'+editProductCategoryInput+'",'
        +'"productPickup": "'+editProductPickupInput +'"'*/
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

