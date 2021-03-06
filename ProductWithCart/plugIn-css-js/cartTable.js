$(document).ready(function(){
  var checkPage = document.getElementById("productDetail");
  if(checkPage != null && checkPage.innerHTML.indexOf("productDetailView") >= -1) {
    
    getSpecificProduct(localStorage["productId"]);
  } else {
    getAllProducts();
    getAllCategories();
    //getCompleteShoppingCart();
    
  
    console.log(localStorage.getItem("__mycart"));
  }

});

function getCompleteShoppingCart() {
  localStorage.setItem("__mycart", "[");
  $.ajax({async: false,  
    type:"GET",
    url:"http://localhost:8080/cart/getUnfinishedShoppingCartOfUser/" + localStorage.getItem("userId"),
    contentType: 'application/json; charset=utf-8',
    xhrFields:{
        withCredentials:true
    },
    success:function(data){
      const jsonObj = JSON.parse(data);
      jsonObj[0].cardProducts.forEach((productInfo, index) => {
        getMoreProductInfo(productInfo.productId, productInfo.productQuantity);
      });

    },
    failure: function(errMsg){alert(errMsg);} //fehlermeldungen userfreundlicher machen

  })
}

function getMoreProductInfo(productId, quantity) {
  $.ajax({async: false,    
    type:"GET",
    url:"http://localhost:8080/product/getSpecificProduct/" + productId,
    contentType: 'application/json; charset=utf-8',
    xhrFields:{
        withCredentials:true
    },
    success:function(data){
      const jsonObj = JSON.parse(data);
      var products = [];
      products.push({
        id: jsonObj.product[0].id,
        name: jsonObj.product[0].productName,
        summary: 1,
        price: jsonObj.product[0].productPrice,
        quantity: quantity,
        image: "../img/index.jpg"
      });
      //localStorage["__mycart"] =  localStorage["__mycart"]
      localStorage["__mycart"] +=JSON.stringify(products)
      /*+ "{"
      +  "\"id\":\"" + jsonObj.product[0].id + "\","
      +  "\"name\":\"" + jsonObj.product[0].productName + "\","
      +  "\"summary\":\"1\","
      +  "\"price\":\"" + jsonObj.product[0].productPrice + "\","
      +  "\"quantity\":\"" + quantity + "\","
      +  "\"image\":\"../img/index.jpg\""
      +  "},";*/
      localStorage["__mycart"] = localStorage["__mycart"].replaceAll("[[","[").replaceAll("]]","]").replaceAll("][",",");

    },
    failure: function(errMsg){alert(errMsg);}

  })

}

function getAllCategories() {
  $.ajax({
    type:"GET",
    url:"http://localhost:8080/category/getAllCategories",
    contentType: 'application/json; charset=utf-8',
    xhrFields:{
        withCredentials:true
    },
    success:function(data){
      const jsonObj = JSON.parse(data);
      addCategoriesToDropdown(jsonObj.category);
    },
    failure: function(errMsg){alert(errMsg);}

  })

}

function addCategoriesToDropdown(categoryData) {
  var categoryDetail = document.getElementById("categoryDropdown");
  var categoryHTML="";

  categoryData.forEach((categoryInfo,index) =>{

    categoryHTML = categoryHTML +"<li><a href=\"javascript:callCategorie('" + categoryInfo.categoryName + "');\">" + categoryInfo.categoryName + "</a></li>";
  });
  categoryDetail.innerHTML= categoryHTML;            
}

function callCategorie(category) {
  console.log(category); 
  $.ajax({
    type:"GET",
    url:"http://localhost:8080/product/getAllProductsOfCategory/" + category,
    contentType: 'application/json; charset=utf-8',
    xhrFields:{
        withCredentials:true
    },
    success:function(data){
      const jsonObj = JSON.parse(data);
      addProductInTable(jsonObj.product);
    },
    error: function(errMsg){
      var productTable = document.getElementById("productCartView");
      productTable.innerHTML = "There are no products in category " + category;  
    }

})
}

function getSpecificProduct(id){
  console.log("get");
  $.ajax({
      type:"GET",
      url:"http://localhost:8080/product/getSpecificProduct/" + id,
      contentType: 'application/json; charset=utf-8',
      xhrFields:{
          withCredentials:true
      },
      success:function(data){
        const jsonObj = JSON.parse(data);
        addProductToDetail(jsonObj.product);
      },
      failure: function(errMsg){alert(errMsg);}

  })
  }

function addProductToDetail(productData) {
  var productDetail = document.getElementById("productDetailView");
  var productHTML = "";
  var productImage = "";

  productData.forEach((productInfo,index) =>{
          
    productHTML=productHTML + "<h2 class = \"product-title\">" + productInfo.productName + "</h2>" +
        "<div class = \"product-price\"><p class = \"new-price\">New Price: ??? <span>" + productInfo.productPrice + "</span></p></div>" +
        "<div class = \"product-detail\"><h2>about this item: </h2><p>" + productInfo.productDesc + "</p>" +
        "<div class = \"product-category\"><p>Category: <span>" + productInfo.productCategory + "</span></p></div> " +
        
        //"<button type = \"button\" class = \"btn btn-secondary btn-lg active\" onclick=\"addProductInTable\">Add to cart</button>" +
        
        "<a href=\"../ProductWithCart/ProductPage.html\" class=\"btn btn-secondary btn-lg active\" role=\"button\"" +
        "aria-pressed=\"true\">Back to products</a></div>"

        if(productInfo.image != "") {
          productImage = productInfo.image;
        }
  });
  
  productDetail.innerHTML= productHTML;
  var productDetailImg = document.getElementById("productDetailImage");
  if(productImage != "") {
    productDetailImg.src = "data:image/png;base64," + productImage;
  }
}

function getAllProducts(){
  console.log("get");
      $.ajax({
          type:"GET",
          url:"http://localhost:8080/product/getAllProducts",
          //contentType: 'application/json; charset=utf-8',
          success:function(data){
            const jsonObj = JSON.parse(data); 
            addProductInTable(jsonObj.product);
          },
          failure: function(errMsg){alert(errMsg);}
  
      })
  }
  
function addProductInTable(productData){
    var productTable = document.getElementById("productCartView");
    productTable.innerHTML = "";
    var productHTML = "";
    var addButton = "<button class=\"btn btn-danger\" onclick=\"location.href='../STANDARD/logIn.html';\">Add to cart</button>";
    var productImage = "";

    productData.forEach((productInfo,index) =>{
      if(localStorage["login"] != "") {
        addButton = "<button class=\"btn btn-danger my-cart-btn\" data-id=\"" + productInfo.id + " \" data-name=\"" + productInfo.productName + "\" data-summary=\"summary 1\" data-price=\"" + productInfo.productPrice + "\" data-quantity=\"1\" data-image=\"../img/index.jpg\">"+
        "Add to cart</button>";
      }  

      if(productInfo.image != "") {
        productImage = "<img src=\"data:image/png;base64," + productInfo.image + "\" width=\"250\" height=\"250\" alt=\"\">";
      } else {
        productImage = "<img src=\"../img/index.jpg\" width=\"250\" height=\"250\" alt=\"\">"
      }

        productHTML=productHTML + "<div class=\"col-lg-3 col-md-4 col-sm-6 col-xs-12 text-center\">"+
        productImage +
        "<br><br>"+
        productInfo.productName + " - <strong>??? " + productInfo.productPrice + "</strong>"+
        "<br><br>"+
        addButton +
        "<button class=\"btn btn-info\" onClick=\"detailsOfProduct(" + productInfo.id +")\">Details</button>" +
        /*"<a href=\"../ProductWithCart/productDetail.html\" id=\"link1\" class=\"btn btn-info\">Details</a>"+*/
        "</div>";
    });
    productTable.innerHTML= productHTML;
}

function sendFinishedRequest() {
  $.ajax({
    type:"GET",
    url:"http://localhost:8080/cart/setShoppingCartFinished/" + localStorage["userId"],
    contentType: 'application/json',
    authorization: "Bearer {token}",
    xhrFields:{
        withCredentials:true
    },
    success:function(data){
      return true;
    },
    failure: function(errMsg){
      return false;
    }
  })
}

function detailsOfProduct(productId) {
  localStorage["productId"] = productId;
  window.location.href = "../ProductWithCart/productDetail.html";
}


(function ($) {

  if(localStorage["login"] != ""){
    getCompleteShoppingCart();
  }

    "use strict";
    
    var OptionManager = (function () {
      var objToReturn = {};
    
      var _options = null;
      var DEFAULT_OPTIONS = {
        currencySymbol: '$',
        classCartIcon: 'my-cart-icon',
        classCartBadge: 'my-cart-badge',
        classProductQuantity: 'my-product-quantity',
        classProductRemove: 'my-product-remove',
        classCheckoutCart: 'my-cart-checkout',
        affixCartIcon: true,
        showCheckoutModal: true,
        numberOfDecimals: 2,
        cartItems: null,
        clickOnAddToCart: function ($addTocart) {},
        afterAddOnCart: function (products, totalPrice, totalQuantity) {},
        clickOnCartIcon: function ($cartIcon, products, totalPrice, totalQuantity) {},
        checkoutCart: function (products, totalPrice, totalQuantity) {
          return false;
        },
        getDiscountPrice: function (products, totalPrice, totalQuantity) {
          return null;
        }
      };
    
    
      var loadOptions = function (customOptions) {
        _options = $.extend({}, DEFAULT_OPTIONS);
        if (typeof customOptions === 'object') {
          $.extend(_options, customOptions);
        }
      };
      var getOptions = function () {
        return _options;
      };
    
      objToReturn.loadOptions = loadOptions;
      objToReturn.getOptions = getOptions;
      return objToReturn;
    }());
    
    var MathHelper = (function () {
      var objToReturn = {};
      var getRoundedNumber = function (number) {
        if (isNaN(number)) {
          throw new Error('Parameter is not a Number');
        }
        number = number * 1;
        var options = OptionManager.getOptions();
        return number.toFixed(options.numberOfDecimals);
      };
      objToReturn.getRoundedNumber = getRoundedNumber;
      return objToReturn;
    }());
    
    var ProductManager = (function () {
      var objToReturn = {};
    
      /*
      PRIVATE
      */
      const STORAGE_NAME = "__mycart";
      localStorage[STORAGE_NAME] = localStorage[STORAGE_NAME] ? localStorage[STORAGE_NAME] : "";
      var getIndexOfProduct = function (id) {
        var productIndex = -1;
        var products = getAllProducts();
        $.each(products, function (index, value) {
          if (value.id == id) {
            productIndex = index;
            return;
          }
        });
        return productIndex;
      };
      var setAllProducts = function (products) {
        localStorage[STORAGE_NAME] = JSON.stringify(products);
      };
      var addProduct = function (id, name, summary, price, quantity, image) {
        var products = getAllProducts();
        products.push({
          id: id,
          name: name,
          summary: summary,
          price: price,
          quantity: quantity,
          image: image
        });
        setAllProducts(products);
      };
    
      /*
      PUBLIC
      */
      var getAllProducts = function () {
        try {
          
          var products = JSON.parse(localStorage[STORAGE_NAME]);
          return products;
        } catch (e) {
          return [];
        }
      };
      var updatePoduct = function (id, quantity, increaseQuantity) {
        var productIndex = getIndexOfProduct(id);
        if (productIndex < 0) {
          return false;
        }
        var products = getAllProducts();
        if(increaseQuantity) {
          products[productIndex].quantity = products[productIndex].quantity * 1 + (typeof quantity === "undefined" ? 1 : quantity * 1);
        } else {
          products[productIndex].quantity = typeof quantity === "undefined" ? products[productIndex].quantity * 1 + 1 : quantity * 1;
        }
        setAllProducts(products);
        return true;
      };
      var setProduct = function (id, name, summary, price, quantity, image) {
        if (typeof id === "undefined") {
          console.error("id required");
          return false;
        }
        if (typeof name === "undefined") {
          console.error("name required");
          return false;
        }
        if (typeof image === "undefined") {
          console.error("image required");
          return false;
        }
        if (!$.isNumeric(price)) {
          console.error("price is not a number");
          return false;
        }
        if (!$.isNumeric(quantity)) {
          console.error("quantity is not a number");
          return false;
        }
        summary = typeof summary === "undefined" ? "" : summary;
    
        if (!updatePoduct(id, quantity, true)) {
          addProduct(id, name, summary, price, quantity, image);
        }
      };
      var clearProduct = function () {
        setAllProducts([]);
      };
      var removeProduct = function (id) {
        var products = getAllProducts();
        products = $.grep(products, function (value, index) {
          return value.id != id;
        });
        setAllProducts(products);
      };
      var getTotalQuantity = function () {
        var total = 0;
        var products = getAllProducts();
        $.each(products, function (index, value) {
          total += value.quantity * 1;
        });
        return total;
      };
      var getTotalPrice = function () {
        var products = getAllProducts();
        var total = 0;
        $.each(products, function (index, value) {
          total += value.quantity * value.price;
          total = MathHelper.getRoundedNumber(total) * 1;
        });
        return total;
      };
    
      objToReturn.getAllProducts = getAllProducts;
      objToReturn.updatePoduct = updatePoduct;
      objToReturn.setProduct = setProduct;
      objToReturn.clearProduct = clearProduct;
      objToReturn.removeProduct = removeProduct;
      objToReturn.getTotalQuantity = getTotalQuantity;
      objToReturn.getTotalPrice = getTotalPrice;
      return objToReturn;
    }());
    
    
    var loadMyCartEvent = function (targetSelector) {
    
      var options = OptionManager.getOptions();
      var $cartIcon = $("." + options.classCartIcon);
      var $cartBadge = $("." + options.classCartBadge);
      var classProductQuantity = options.classProductQuantity;
      var classProductRemove = options.classProductRemove;
      var classCheckoutCart = options.classCheckoutCart;
    
      var idCartModal = 'my-cart-modal';
      var idCartTable = 'my-cart-table';
      var idGrandTotal = 'my-cart-grand-total';
      var idEmptyCartMessage = 'my-cart-empty-message';
      var idDiscountPrice = 'my-cart-discount-price';
      var classProductTotal = 'my-product-total';
      var classAffixMyCartIcon = 'my-cart-icon-affix';
    
    
      if (options.cartItems && options.cartItems.constructor === Array) {
        ProductManager.clearProduct();
        $.each(options.cartItems, function () {
          ProductManager.setProduct(this.id, this.name, this.summary, this.price, this.quantity, this.image);
        });
      }
    
      $cartBadge.text(ProductManager.getTotalQuantity());
    
      if (!$("#" + idCartModal).length) {
        $('body').append(
          '<div class="modal fade" id="' + idCartModal + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' +
          '<div class="modal-dialog" role="document">' +
          '<div class="modal-content">' +
          '<div class="modal-header">' +
          '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
          '<h4 class="modal-title" id="myModalLabel"><span class="glyphicon glyphicon-shopping-cart"></span> My Cart</h4>' +
          '</div>' +
          '<div class="modal-body">' +
          '<table class="table table-hover table-responsive" id="' + idCartTable + '"></table>' +
          '</div>' +
          '<div class="modal-footer">' +
          '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
          '<button type="button" class="btn btn-secondary ' + classCheckoutCart + '">Checkout</button>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>'
        );
      }
    
      var drawTable = function () {
        var $cartTable = $("#" + idCartTable);
        $cartTable.empty();
    
        var products = ProductManager.getAllProducts();
        $.each(products, function () {
          var total = this.quantity * this.price;
          $cartTable.append(
            '<tr title="' + this.summary + '" data-id="' + this.id + '" data-price="' + this.price + '">' +
            '<td class="text-center" style="width: 30px;"><img width="30px" height="30px" src="' + this.image + '"/></td>' +
            '<td>' + this.name + '</td>' +
            '<td title="Unit Price" class="text-right">' + options.currencySymbol + MathHelper.getRoundedNumber(this.price) + '</td>' +
            '<td title="Quantity"><input type="number" min="1" style="width: 70px;" class="' + classProductQuantity + '" value="' + this.quantity + '"/></td>' +
            '<td title="Total" class="text-right ' + classProductTotal + '">' + options.currencySymbol + MathHelper.getRoundedNumber(total) + '</td>' +
            '<td title="Remove from Cart" class="text-center" style="width: 30px;"><a href="javascript:void(0);" class="btn btn-xs btn-danger ' + classProductRemove + '">X</a></td>' +
            '</tr>'
          );
        });
    
        $cartTable.append(products.length ?
          '<tr>' +
          '<td></td>' +
          '<td><strong>Total</strong></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td class="text-right"><strong id="' + idGrandTotal + '"></strong></td>' +
          '<td></td>' +
          '</tr>' :
          '<div class="alert alert-danger" role="alert" id="' + idEmptyCartMessage + '">Your cart is empty</div>'
        );
    
        var discountPrice = options.getDiscountPrice(products, ProductManager.getTotalPrice(), ProductManager.getTotalQuantity());
        if (products.length && discountPrice !== null) {
          $cartTable.append(
            '<tr style="color: red">' +
            '<td></td>' +
            '<td><strong>Total (including discount)</strong></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td class="text-right"><strong id="' + idDiscountPrice + '"></strong></td>' +
            '<td></td>' +
            '</tr>'
          );
        }
    
        showGrandTotal();
        showDiscountPrice();
      };
      var showModal = function () {
        drawTable();
        $("#" + idCartModal).modal('show');
      };
      var updateCart = function () {
        $.each($("." + classProductQuantity), function () {
          var id = $(this).closest("tr").data("id");
          ProductManager.updatePoduct(id, $(this).val());
        });
      };
      var showGrandTotal = function () {
        $("#" + idGrandTotal).text(options.currencySymbol + MathHelper.getRoundedNumber(ProductManager.getTotalPrice()));
      };
      var showDiscountPrice = function () {
        $("#" + idDiscountPrice).text(options.currencySymbol + MathHelper.getRoundedNumber(options.getDiscountPrice(ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity())));
      };
    
      /*
      EVENT
      */
      if (options.affixCartIcon) {
        var cartIconBottom = $cartIcon.offset().top * 1 + $cartIcon.css("height").match("/\d+/") * 1;
        var cartIconPosition = $cartIcon.css('position');
        $(window).scroll(function () {
          $(window).scrollTop() >= cartIconBottom ? $cartIcon.addClass(classAffixMyCartIcon) : $cartIcon.removeClass(classAffixMyCartIcon);
        });
      }
    
      $cartIcon.click(function () {
        options.showCheckoutModal ? showModal() : options.clickOnCartIcon($cartIcon, ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity());
      });
    
      $(document).on("input", "." + classProductQuantity, function () {
        var price = $(this).closest("tr").data("price");
        var id = $(this).closest("tr").data("id");
        var quantity = $(this).val();
    
        $(this).parent("td").next("." + classProductTotal).text(options.currencySymbol + MathHelper.getRoundedNumber(price * quantity));
        ProductManager.updatePoduct(id, quantity);
    
        $cartBadge.text(ProductManager.getTotalQuantity());
        showGrandTotal();
        showDiscountPrice();
      });
    
      $(document).on('keypress', "." + classProductQuantity, function (evt) {
        if (evt.keyCode >= 48 && evt.keyCode <= 57) {
          return;
        }
        evt.preventDefault();
      });
    
      $(document).on('click', "." + classProductRemove, function () {
        var $tr = $(this).closest("tr");
        var id = $tr.data("id");
        $tr.hide(500, function () {
          ProductManager.removeProduct(id);
          drawTable();
          $cartBadge.text(ProductManager.getTotalQuantity());
        });
      });
    
      $(document).on('click', "." + classCheckoutCart, function () {
        var products = ProductManager.getAllProducts();
        if (!products.length) {
          $("#" + idEmptyCartMessage).fadeTo('fast', 0.5).fadeTo('fast', 1.0);
          return;
        }
        updateCart();
        var isCheckedOut = options.checkoutCart(ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity());
        if (isCheckedOut !== false) {
          if(!sendFinishedRequest()) {
            ProductManager.clearProduct();
            $cartBadge.text(ProductManager.getTotalQuantity());
            $("#" + idCartModal).modal("hide");
            localStorage["__mycart"] = "";
          } else {
            console.log("something went wrong");
          }
        }
      });
    
      $(document).on('click', targetSelector, function () {
        var $target = $(this);
        options.clickOnAddToCart($target);
    
        var id = $target.data('id');
        var name = $target.data('name');
        var summary = $target.data('summary');
        var price = $target.data('price');
        var quantity = $target.data('quantity');
        var image = $target.data('image');
    
        ProductManager.setProduct(id, name, summary, price, quantity, image);
        $cartBadge.text(ProductManager.getTotalQuantity());
    
        options.afterAddOnCart(ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity());
      });
    
    };
    
    $.fn.myCart = function (userOptions) {
      OptionManager.loadOptions(userOptions);
      var checkPage = document.getElementById("productDetail");
      if(!(checkPage != null && checkPage.innerHTML.indexOf("productDetailView") >= -1)) {
        loadMyCartEvent(this.selector);
      }
      return this;
    };
    
    
    })(jQuery);