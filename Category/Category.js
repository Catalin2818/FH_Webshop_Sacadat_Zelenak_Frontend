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

    getAllCategories();
});

function addCategory(){

    var addCategoryInput = document.getElementById("addCategory").value;


    var user = '{'
        +'"id": 0,'
        +'"categoryName":"' +addCategoryInput+'"'
        +'}';

    $.ajax({
        type:"POST",
        url:"http://localhost:8080/category/admin/addCategories",
        data:user,
        dataType:'json',
        contentType:'application/json; charset=utf-8',
        success:function(data){
            const jsonObj = JSON.parse(data);

            jsonObj.user.forEach((categoryInfo,index) =>{
                console.log(`${index} : ${categoryInfo.id}, ${categoryInfo.categoryName}`)
            });

            addCategoryInTable(jsonObj.category);

            //TODO close modal
             },
        failure: function(errMsg){alert(errMsg);}
    });

}

function getAllCategories(){

    $.ajax({
        type:"GET",
        url:"http://localhost:8080/category/getAllCategories",
        contentType: 'application/json; charset=utf-8',
        success:function(data){console.log(data);

            const jsonObj = JSON.parse(data);

            jsonObj.category.forEach((categoryInfo,index) =>{
                console.log(`${index} : ${categoryInfo.id}, ${categoryInfo.categoryName}`)
            });

            addCategoryInTable(jsonObj.category);
            },
        failure: function(errMsg){alert(errMsg);}

    })
}


function editCategoryInModal(event){

    var editIdInput = document.getElementById("editID");
    var editCategoryInput = document.getElementById("editCategory");

    editIdInput.innerText = event.parentNode.parentNode.cells[1].innerHTML;
    editCategoryInput.value = event.parentNode.parentNode.cells[2].innerHTML;
}

function editCategoryFunc(){

    var editIdInput = document.getElementById("editID").innerHTML;
    var editCategoryInput = document.getElementById("editCategory").value;


    var category = '{'
        +'"id":'+editIdInput +','
        +'"categoryName":"' +editCategoryInput+'"'
        +'}';

    $.ajax({
        type:"POST",
        url:"http://localhost:8080/category/admin/updateCategory",
        data:category,
        dataType:'json',
        contentType:'application/json; charset=utf-8',
        success:function(data){

            const jsonObj = JSON.parse(data);

            jsonObj.category.forEach((categoryInfo,index) =>{
                console.log(`${index} : ${categoryInfo.id}, ${categoryInfo.firstName}`)
            });

            addCategoryInTable(jsonObj.category);
            //TODO close modal
        },
        failure: function(errMsg){alert(errMsg);}
    });
}

function deleteCategory(event){

    var id = event.parentNode.parentNode.cells[1].innerHTML;
    console.log(id);

    $.ajax({
        type:"GET",
        url:"http://localhost:8080/category/admin/deleteCategory/"+id,
        contentType: 'application/json; charset=utf-8',
        success:function(data){
            getAllCategories();
        },
        failure: function(errMsg){alert(errMsg);}
    });

}

function addCategoryInTable(categoryData){
    var categoryTable = document.getElementById("categoryTable");
    var categoryHTML = "";

    categoryData.forEach((categoryInfo,index) =>{
        console.log(`${index} : ${categoryInfo.id}, ${categoryInfo.categoryName}`)
        categoryHTML=categoryHTML + "<tr><td><span className=\"custom-checkbox\"><input type=\"checkbox\" id=\"checkbox1\" name=\"options[]\" value=\"1\"><label htmlFor=\"checkbox1\"></label></span>" +
            "</td><td>"+ categoryInfo.id +"</td><td>"+ categoryInfo.categoryName +"</td><td>" +
            "<button type=\"button\" className=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#editCategoryModal\" onclick=editCategoryInModal(this)><i class=\"fa fa-pencil\" aria-hidden=\"true\" data-toggle=\"tooltip\" title=\"Edit\"></i></button>" +
            "<button type=\"button\" className=\"btn btn-primary\" onclick=deleteCategory(this)><i class=\"fa fa-trash-o\" aria-hidden=\"true\" data-toggle=\"tooltip\" title=\"Delete\"></i></button>"+
            "</td>" +
            "</tr>";
    });
    console.log(categoryHTML);
    categoryTable.innerHTML= categoryHTML;
}
