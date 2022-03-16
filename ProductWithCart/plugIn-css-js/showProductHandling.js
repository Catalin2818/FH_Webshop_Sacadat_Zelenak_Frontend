$(document).ready(function(){

    //getAllProducts();

});

function getAllProducts(){
console.log("get");
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
                                        ${productInfo.productPickup},
                                        ${productInfo.image}`)
            });

            addProductInTable(jsonObj.product);
            console.log(data);
        },
        failure: function(errMsg){alert(errMsg);}

    })
}

function addProductInTable(productData){
    var productTable = document.getElementById("productCartView");
    var productHTML = "";

    productData.forEach((productInfo,index) =>{
        
        productHTML=productHTML + "<div class=\"col-md-3 text-center\">"+
        "<img src=\"../img/index.jpg\" width=\"200\" height=\"200\" alt=\"\">"+
        "<br><br>"+
        productInfo.productName + " - <strong>€ " + productInfo.productPrice + "</strong>"+
        "<br><br>"+
        "<button class=\"btn btn-danger my-cart-btn\" data-id=\"1\" data-name=\"product 1\" data-summary=\"summary 1\" data-price=\"10\" data-quantity=\"1\" data-image=\"../img/index.jpg\">"+
            "Add to cart"+
        "</button>"+
        "<a href=\"\" class=\"btn btn-info\">Details</a>"+
        "</div>";
    });
    console.log(productHTML);
    productTable.innerHTML= productHTML;
}