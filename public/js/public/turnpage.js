var TurnPage = {
    page:1,                             //当前页码
    maxPage:0,                          //最大页数
    pageCount:20,                       //每页展现记录数
    funGetData:'',                      //翻页获取数据的回调函数
    /**
     * @param page_id   //页码div的id
     * @param funName      //获取页码数据的函数名称
     * @param total_count   //总记录数
     */
    showPage:function(page_id, funName, total_count){
        this.funGetData = funName;
        this.maxPage = Math.ceil(total_count/this.pageCount);
        var strHtml = '<div class="row-fluid">' +
            '<div class="span6">';
        if(total_count == 0){
            strHtml += '<div class="dataTables_info">Showing 0 to 0 of 0 entries</div>';
        }else{
            if(TurnPage.maxPage == 1 || TurnPage.page == TurnPage.maxPage){
                pcount = total_count;
            }else{
                pcount = TurnPage.page * this.pageCount;
            }
            strHtml += '<div class="dataTables_info">Showing ' + Math.ceil((TurnPage.page-1) * this.pageCount + 1) + ' to '+ pcount + ' of '+ total_count +' entries</div>';
        }

        strHtml +=      '</div>' +
        '<div class="span6">' +
        '<div class="dataTables_paginate paging_bootstrap pagination">';
        if(TurnPage.page == 1){
            strHtml += '<ul><li class="prev disabled"><a>← <span class="hidden-480">Prev</span></a></li>';
        }else{
            strHtml += '<ul><li class="prev"><a href="javascript:TurnPage.prePage();">← <span class="hidden-480">Prev</span></a></li>';
        }

        strHtml +=      '<li class="active"><a>' + TurnPage.page + '</a></li>';

        if(TurnPage.page == TurnPage.maxPage || total_count == 0){
            strHtml +=      '<li class="next disabled"><a><span class="hidden-480">Next</span> → </a></li>';
        }else{
            strHtml +=      '<li class="next"><a href="javascript:TurnPage.nextPage();"><span class="hidden-480">Next</span> → </a></li>';
        }
        strHtml +=      '</ul>' +
        '</div>' +
        '</div>' +
        '</div>';
        $("#" + page_id).html(strHtml);
    },
    currentPage:function(){              //刷新当前页
        TurnPage.callBack();
    },
    nextPage:function(){                //下一页
        if ((Math.ceil(TurnPage.page)) < (Math.ceil(TurnPage.maxPage))){
            TurnPage.page += 1;
            TurnPage.callBack();
        }
    },
    prePage:function(){                 //前一页
        if ((Math.ceil(TurnPage.page)) != 1){
            TurnPage.page -= 1;
            TurnPage.callBack();
        }
    },
    lastPage:function(){                //最后一页
        if (TurnPage.page != TurnPage.maxPage){
            TurnPage.page = TurnPage.maxPage;
            TurnPage.callBack();
        }
    },
    firstPage:function(){           //第一页
        if ((Math.ceil(TurnPage.page)) != 1){
            TurnPage.page = 1;
            TurnPage.callBack();
        }
    },
    callBack:function(){
        fnCallBack(TurnPage.funGetData);
    }
};

var fnCallBack = function(callback){
    callback();
}