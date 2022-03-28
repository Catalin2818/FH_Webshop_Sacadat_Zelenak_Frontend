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

    getAllUsers();
});

function addUser(){

    var addVornameInput = document.getElementById("addVorname").value;
    var addNachnameInput = document.getElementById("addNachname").value;
    var addEmailInput = document.getElementById("addEmail").value;
    var addPasswortInput = document.getElementById("addPasswort").value;

    var user = '{'
        +'"id": 0,'
        +'"firstName":"' +addVornameInput+'",'
        +'"lastName":"' +addNachnameInput+'",'
        +'"email":"' +addEmailInput+'",'
        +'"password": "'+addPasswortInput+'",'
        +'"cart": "1",'
        +'"role": "user"'
    +'}';

    $.ajax({
        type:"POST",
        url:"http://localhost:8080/user/addUsers",
        data:user,
        dataType:'json',
        contentType:'application/json; charset=utf-8',
        success:function(data){
            const jsonObj = JSON.parse(data);

            jsonObj.user.forEach((userInfo,index) =>{
                console.log(`${index} : ${userInfo.id}, ${userInfo.firstName}, ${userInfo.lastName}, ${userInfo.email}, ${userInfo.password}, ${userInfo.cart}, ${userInfo.role}`)
            });

            addUserInTable(jsonObj.user);
            //getAllUsers();
            //TODO close modal
             },
        failure: function(errMsg){alert(errMsg);}
    });

}

function getAllUsers(){

    $.ajax({
        type:"GET",
        url:"http://localhost:8080/user/getAllUsers",
        contentType: 'application/json; charset=utf-8',
        success:function(data){console.log(data);

            const jsonObj = JSON.parse(data);

            /*jsonObj.forEach((userInfo,index) =>{
                console.log(`${index} : ${userInfo.id}, 
                                        ${userInfo.firstName}, 
                                        ${userInfo.lastName}, 
                                        ${userInfo.email}, 
                                        ${userInfo.password}, 
                                        ${userInfo.cart}, 
                                        ${userInfo.role}`)
            });*/

            addUserInTable(jsonObj);
            },
        failure: function(errMsg){alert(errMsg);}

    })
}


function editUserInModal(event){

    var editIdInput = document.getElementById("editID");
    var editVornameInput = document.getElementById("editVorname");
    var editNachnameInput = document.getElementById("editNachname");
    var editEmailInput = document.getElementById("editEmail");
    var editPasswortInput = document.getElementById("editPasswort");

    editIdInput.innerText = event.parentNode.parentNode.cells[1].innerHTML;
    editVornameInput.value = event.parentNode.parentNode.cells[2].innerHTML;
    editNachnameInput.value = event.parentNode.parentNode.cells[3].innerHTML;
    editEmailInput.value = event.parentNode.parentNode.cells[4].innerHTML;
    editPasswortInput.value = event.parentNode.parentNode.cells[5].innerHTML;
}

function editUser(){

    var editIdInput = document.getElementById("editID").innerHTML;
    var editVornameInput = document.getElementById("editVorname").value;
    var editNachnameInput = document.getElementById("editNachname").value;
    var editEmailInput = document.getElementById("editEmail").value;
    var editPasswortInput = document.getElementById("editPasswort").value;

    var user = '{'
        +'"id":'+editIdInput +','
        +'"firstName":"' +editVornameInput+'",'
        +'"lastName":"' +editNachnameInput+'",'
        +'"email":"' + editEmailInput+'",'
        +'"password": "'+editPasswortInput+'",'
        +'"cart": "1",'
        +'"role": "user"'
        +'}';

    $.ajax({
        type:"POST",
        url:"http://localhost:8080/user/updateUser",
        data:user,
        dataType:'json',
        contentType:'application/json; charset=utf-8',
        success:function(data){

            const jsonObj = JSON.parse(data);

            jsonObj.user.forEach((userInfo,index) =>{
                console.log(`${index} : ${userInfo.id}, ${userInfo.firstName}, ${userInfo.lastName}, ${userInfo.email}, ${userInfo.password}, ${userInfo.cart}, ${userInfo.role}`)
            });

            addUserInTable(jsonObj.user);
        
        },
        failure: function(errMsg){alert(errMsg);}
    });
}

function deleteUser(event){

    var id = event.parentNode.parentNode.cells[1].innerHTML;
    console.log(id);

    $.ajax({
        type:"GET",
        url:"http://localhost:8080/user/deleteUser/"+id,
        contentType: 'application/json; charset=utf-8',
        success:function(data){
            getAllUsers();
        },
        failure: function(errMsg){alert(errMsg);}
    });

}

function addUserInTable(userData){
    var userTable = document.getElementById("userTable");
    var userHTML = "";

    userData.forEach((userInfo,index) =>{
        console.log(`${index} : ${userInfo.id}, ${userInfo.firstName}, ${userInfo.lastName}, ${userInfo.email}, ${userInfo.password}, ${userInfo.cart}, ${userInfo.role}`)
        userHTML=userHTML + "<tr><td><span className=\"custom-checkbox\"><input type=\"checkbox\" id=\"checkbox1\" name=\"options[]\" value=\"1\"><label htmlFor=\"checkbox1\"></label></span>" +
            "</td><td>"+ userInfo.id +"</td><td>"+ userInfo.firstName +"</td><td>"+ userInfo.lastName +"</td><td>"+ userInfo.email +"</td><td>"+ userInfo.password +"</td><td>"+
            "<button type=\"button\" className=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#editEmployeeModal\" onclick=editUserInModal(this)><i class=\"fa fa-pencil\" aria-hidden=\"true\" data-toggle=\"tooltip\" title=\"Edit\"></i></button>" +
            "<button type=\"button\" className=\"btn btn-primary\" onclick=deleteUser(this)><i class=\"fa fa-trash-o\" aria-hidden=\"true\" data-toggle=\"tooltip\" title=\"Delete\"></i></button>"+
            "</td>" +
            "</tr>";
    });
    //console.log(userHTML);
    userTable.innerHTML= userHTML;
}
