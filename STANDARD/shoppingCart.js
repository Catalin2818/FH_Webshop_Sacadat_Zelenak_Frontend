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

    var addProduktNameInput = document.getElementById("addProductName").value;
    var addProduktHerkunftInput = document.getElementById("addProductOrigin").value;
    var addProduktBeschrInput = document.getElementById("addProductDesc").value;
    var addProduktAllergeneInput = document.getElementById("addProductAllergens").value;
    var addProduktPreisInput = document.getElementById("addProductPrice").value;
    var addProduktStueckanzahlInput = document.getElementById("addProductQuantity").value;
    var addProduktKategorieInput = document.getElementById("addProductCategory").value;
    var addProduktAgbeholtInput = document.getElementById("addProductPickup").value;

    var products = '{'
        //+'"id": 1,'
        +'"productName":"' +addProduktNameInput+'",'
        +'"productOrigin":"' +addProduktHerkunftInput+'",'
        +'"productDesc":"' +addProduktBeschrInput+'",'
        +'"productAllergens": "'+addProduktAllergeneInput+'",'
        +'"productPrice": '+addProduktPreisInput+','
        +'"productQuantity": '+addProduktStueckanzahlInput+','
        +'"productCategory": "'+addProduktKategorieInput+'",'
        +'"productPickup": "'+addProduktAgbeholtInput +'"'
        +'}';

    $.ajax({
        type:"POST",
        url:"http://localhost:8080/product/addProducts",
        data:products,
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
        url:"http://localhost:8080/product/getAllProducts",
        //contentType: 'application/json; charset=utf-8',
        success:function(data){console.log(data);

           const jsonObj = JSON.parse(data);

            jsonObj.product.forEach((productInfo,index) =>{
                console.log(`${index} : ${productInfo.id}, 
                                        ${productInfo.productName}, 
                                        ${productInfo.productOrigin}, 
                                        ${productInfo.productDesc}, 
                                        ${productInfo.productAllergens}, 
                                        ${productInfo.productPrice}, 
                                        ${productInfo.productQuantity},
                                        ${productInfo.productCategory},
                                        ${productInfo.productPickup}`)
            });

            addProductInTable(jsonObj.product);
            console.log(data);
        },
        failure: function(errMsg){alert(errMsg);}

    })
}

function editProductsInModal(event){

    var editProductIdInput = document.getElementById("editProductID")
    var editProductNameInput = document.getElementById("editProductName");
    var editProductOriginInput = document.getElementById("editProductOrigin");
    var editProductDescInput = document.getElementById("editProductDesc");
    var editProductAllergensInput = document.getElementById("editProductAllergens");
    var editProductPriceInput = document.getElementById("editProductPrice");
    var editProductQuantityInput = document.getElementById("editProductQuantity");
    var editProductCategoryInput = document.getElementById("editProductCategory");
    var editProductPickupInput = document.getElementById("editProductPickup");

    editProductIdInput.innerText = event.parentNode.parentNode.cells[1].innerHTML;
    editProductNameInput.value = event.parentNode.parentNode.cells[2].innerHTML;
    editProductOriginInput.value = event.parentNode.parentNode.cells[3].innerHTML;
    editProductDescInput.value = event.parentNode.parentNode.cells[4].innerHTML;
    editProductAllergensInput.value = event.parentNode.parentNode.cells[5].innerHTML;
    editProductPriceInput.value = event.parentNode.parentNode.cells[6].innerHTML;
    editProductQuantityInput.value = event.parentNode.parentNode.cells[7].innerHTML;
    editProductCategoryInput.value = event.parentNode.parentNode.cells[8].innerHTML;
    editProductPickupInput.value = event.parentNode.parentNode.cells[9].innerHTML;

}

function editProduct(){

    var editProductIdInput = document.getElementById("editProductID").innerHTML;
    var editProductNameInput = document.getElementById("editProductName").value;
    var editProductOriginInput = document.getElementById("editProductOrigin").value;
    var editProductDescInput = document.getElementById("editProductDesc").value;
    var editProductAllergensInput = document.getElementById("editProductAllergens").value;
    var editProductPriceInput = document.getElementById("editProductPrice").value;
    var editProductQuantityInput = document.getElementById("editProductQuantity").value;
    var editProductCategoryInput = document.getElementById("editProductCategory").value;
    var editProductPickupInput = document.getElementById("editProductPickup").value;


    var product ='{'
        +'"id":' +editProductIdInput +','
        +'"productName":"' +editProductNameInput+'",'
        +'"productOrigin":"' +editProductOriginInput+'",'
        +'"productDesc":"' +editProductDescInput+'",'
        +'"productAllergens": "'+editProductAllergensInput+'",'
        +'"productPrice": '+editProductPriceInput+','
        +'"productQuantity": '+editProductQuantityInput+','
        +'"productCategory": "'+editProductCategoryInput+'",'
        +'"productPickup": "'+editProductPickupInput +'"'
        +'}';

    $.ajax({
        type:"POST",
        url:"http://localhost:8080/product/updateProduct",
        data:product,
        dataType: 'json',
        contentType:'application/json; charset=utf-8',
        success:function(data){

            const jsonObj = JSON.parse(data);

            jsonObj.product.forEach((productInfo,index) =>{
                console.log(`${index} : ${productInfo.id}, 
                                        ${productInfo.productName}, 
                                        ${productInfo.productOrigin}, 
                                        ${productInfo.productDesc}, 
                                        ${productInfo.productAllergens}, 
                                        ${productInfo.productPrice}, 
                                        ${productInfo.productQuantity},
                                        ${productInfo.productCategory},
                                        ${productInfo.productPickup}`)
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
        url:"http://localhost:8080/product/deleteProduct/"+id,
        contentType: 'application/json; charset=utf-8',
        success:function(data){
            getAllProducts();
        },
        failure: function(errMsg){alert(errMsg);}
    });

}

function addProductInTable(productData){
    var productTable = document.getElementById("productTable");
    var productHTML = "";

    productData.forEach((productInfo,index) =>{
        console.log(`${index} : ${productInfo.id}, ${productInfo.productName}, ${productInfo.productOrigin}, ${productInfo.productDesc}, ${productInfo.productAllergens}, ${productInfo.productPrice}, ${productInfo.productQuantity},${productInfo.productCategory},${productInfo.productPickup}`)

        productHTML=productHTML + "<tr><td><span className=\"custom-checkbox\"><input type=\"checkbox\" id=\"checkbox1\" name=\"options[]\" value=\"1\"><label htmlFor=\"checkbox1\"></label></span>" +
            "</td><td>"+ productInfo.id +"</td><td>"+ productInfo.productName +"</td><td>"+ productInfo.productOrigin +"</td><td>"+ productInfo.productDesc +"</td><td>"+ productInfo.productAllergens +"</td><td>"+ productInfo.productPrice +"</td><td>"+productInfo.productQuantity+"</td><td>"+productInfo.ProductCategory+"</td><td>"+productInfo.productPickup+"</td><td>"+
            "<button type=\"button\" className=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#editEmployeeModal\" onclick='editProductsInModal(this)'><i class=\"fa fa-pencil\" aria-hidden=\"true\" data-toggle=\"tooltip\" title=\"Edit\"></i></button>" +
            "<button type=\"button\" className=\"btn btn-primary\" onclick=deleteProduct(this)><i class=\"fa fa-trash-o\" aria-hidden=\"true\" data-toggle=\"tooltip\" title=\"Delete\"></i></button>"+
            "</td>" +
            "</tr>";
    });
    console.log(productHTML);
    productTable.innerHTML= productHTML;
}

