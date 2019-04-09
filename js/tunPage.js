(function(){
    function TurnPage(options){
        this.wrap = options.wrap;
        this.curPage = options.curPage || 1;
        this.allPage = options.allPage || 1;
        this.callback = options.callback || function (){};
        this.fillHTML();
        this.bindEvent();
        this.fillCss();
    }

    TurnPage.prototype.fillHTML = function (){
        $(this.wrap).empty();
        //填充上一页
        if(this.curPage > 1){
            $(this.wrap).append($('<li class="pre-page">上一页</li>'));
        }else {
            $(this.wrap).remove(".pre-page");
        }
        //填充中间页
        if(this.curPage != 1 && this.curPage - 2 >1){

            $(this.wrap).append($('<li class="tab-number ">1</li>'));
        }
        if(this.curPage -2 > 2){
            $(this.wrap).append($('<span> ...</span>'));
        }

        for(var i = this.curPage-2;i<= this.curPage+2;i++){
            if(0 < i && i <= this.allPage){
                var oLi = $('<li class="tab-number">'+ i+ '</li>');
                if(i==this.curPage){
                    oLi.addClass("cur-page");
                }
                $(this.wrap).append(oLi);
            }
        }
        if(this.allPage - this.curPage > 3){
            $(this.wrap).append($('<span> ...</span>'));
        }
        if(this.curPage + 2 < this.allPage){
            $(this.wrap).append($('<li class="tab-number">'+ this.allPage + '</li>'));
        }


        //填充下一页
        if(this.curPage < this.allPage){
            $(this.wrap).append($('<li class="next-page">下一页</li>'));
        }else {
            $(this.wrap).remove(".next-page");
        }
    }
    TurnPage.prototype.bindEvent = function (){
        var  self = this;
        $('.pre-page').click(function (){
                self.curPage --;
                self.changePage();
        });
        $(".next-page").click(function () {
            self.curPage++;
            self.changePage();
        });
        $('.tab-number',this.wrap).click(function () {
            var curPage = parseInt($(this).text());
            self.curPage = curPage;
            self.changePage();
        })
    }
    TurnPage.prototype.fillCss = function(){
        $(".tab-number").css({
            float: "left",
            width:"10px",
            height:"10px",
            backgroundColor:"yellow"
        })
    }

    TurnPage.prototype.changePage = function () {
        this.fillHTML();
        this.bindEvent();
        this.callback();
    }
    $.fn.extend({
        turnPage:function (options){
            options.wrap = this;
            new TurnPage(options);
        }
    })
}())