var allData = null;//储存最新的请求回来的数据
var everPage = 10;//每一页显示的信息条数
var curPage = 1;
//切换导航条
function changList() {
    $('.menu dl').on("click","dd",function (e) {
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        var dataId = "#"+$(this).attr("data-id");
        $(dataId).css("display","block").siblings().css("display","none");
    })
}

//重新下载学生信息并显示
function rendShow () {
    $.ajax({
        type: "GET",
        url: "http://api.duyiedu.com/api/student/findAll",
        data:"appkey=sunyou_1550668581895",
        //dataType: 'jsonp' ,
        success:  function(msg){
            var str = JSON.parse(msg);
            if(str.status == "success"){
                allData = str.data;
               studentShow();
            }
        }
    })
}
function studentShow(){
    var oDiv ="";
    var page = (curPage-1)*everPage;
    var pageData = allData.slice(page,page+10);
    pageData.forEach(function(ele,i){
        oDiv += "<tr>\
                    <td>"+ele.sNo+"</td>\
                    <td>"+ele.name+"</td>\
                    <td>"+(ele.sex ? '女':'男')+"</td>\
                    <td>"+ele.email+"</td>\
                    <td>"+(-ele.birth+new Date().getFullYear())+"</td>\
                    <td>"+ele.phone+"</td>\
                    <td>"+ele.address+'</td>\
                    <td>\
                    <buttn class="btn edit" data-index= '+i+'>编辑</buttn>\
                        <buttn class="btn del" data-index='+i+'>删除</buttn>\
                        </td>\
                        </tr>'
    })
    $('tbody').html(" ");
    $(oDiv).appendTo($('tbody'));
    blindEvent();
    pageShow();
}
//新增学生信息
function addStudent() {
    $(".add-submit").click(function(e){
        e.preventDefault();
        var oDemo = $("#add-student-form").get(0);
        var str = getForm(oDemo);
        var data = Object.assign({appkey:"sunyou_1550668581895"},str)
        $.ajax({
            type: "get",
            url: "http://api.duyiedu.com/api/student/addStudent",
            data:data,
            success:function (msg) {
                var str = JSON.parse(msg);
                alert(str.msg);
                if(str.status =="success"){
                    $('#studentList').click();
                   $('#add-student-form').get(0).reset();
                    rendShow();
                }
            }
        })
    })

}

//删除学生信息
function delStudent(){
    $(".del").click(function (e) {
        var allow = window.confirm("确定删除？");
        if(!allow){
            return false;
        }
        var index = $(this).attr("data-index");
        var sNo = allData[index].sNo;
        var str = {
            sNo: sNo,
            appkey:"sunyou_1550668581895"
        }
        $.ajax({
            type:"get",
            url:"http://api.duyiedu.com/api/student/delBySno",
            data: str,
            success: function (msg) {
                var msg1 = JSON.parse(msg)
                alert(msg1.msg);
                if(msg1.status == "success"){
                    rendShow();
                }
            }
        })
    })
}

//编辑学生信息
function editStudent() {
    var editForm = document.getElementById('edit-student-form');
    var data = getForm(editForm);
    var str = Object.assign({appkey:"sunyou_1550668581895"},data);
    $.ajax({
        type:"get",
        url: "http://api.duyiedu.com/api/student/updateStudent",
        data:str,
        success: function(msg){
            var msg1 = JSON.parse(msg)
            alert(msg1.msg);
            if(msg1.status == "success"){
                $('.cover').hide();
                rendShow();
            }
        }
    })
}
//获取表单数据
function getForm(oDemo) {
    var result ={};
    result.name = oDemo.name.value;
    result.sNo =oDemo.sNo.value;
    result.email = oDemo.email.value;
    result.address = oDemo.address.value;
    result.phone = oDemo.phone.value;
    result.sex = oDemo.sex.value;
    result.birth = oDemo.birth.value;
     return result;
}
//表单数据回填
function initEditform(data) {
    var editForm = document.getElementById('edit-student-form');
    console.log(editForm)
    for (var prop in data) {
        if (editForm[prop]) {
            editForm[prop].value = data[prop];
        }
    }
}
function blindEvent (){
    //绑定编辑事件
    $(".edit").click(function (e){
        var index = $(this).attr("data-index");
        $(".cover").show();
        console.log(333);
        initEditform(allData[index]);
    })
    //绑定遮罩层事件
    $(".cover").click(function () {
        $('.cover').hide();
    })
    //阻止遮罩层上的编辑信息层的冒泡事件
    $('#edit-student').click(function(event){
        event.stopPropagation();
    })
    //绑定编提交辑事件
    $('#edit-submit').off().click(function (e){
        e.preventDefault();
        editStudent();
    })
    delStudent();
}
function init(){
    rendShow();
    changList();
    blindEvent();
    addStudent();
}
init();

function pageShow(){
    var allPage = Math.ceil(allData.length / everPage);
  //var curPage =;

    $('#tunPage').turnPage({
        curPage:curPage,
        allPage:allPage,
        callback: function(page){
            curPage = page;
            studentShow();
        }
    })
}
