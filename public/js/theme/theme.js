function toggleChargeInfo() {
    if ($("#J-charge").val() == 1) {
        $("#J-charge-info").show();
    } else {
        $("#J-charge-info").hide();
    }
}

function setValue() {
    var appid = $('#mypaychargevalue option:selected').attr('appid');
    $("#appid").val(appid);
}

function addMark(position,event) {
    var position = position;
    $('#mark-position').attr('value',position);
    $('#J-Modal').click()
    event.stopPropagation();          //停止事件冒泡
}
function showMark() {
    var url = $('#select-mark').find('option:selected').data('url');
    $('#mark-img').attr('src', url);
}
function editMark() {
    $('#preview-mark-theme span').show();
}

function checkMark(type) {
    var url = $('#select-mark').find('option:selected').data('url');
    var id = $('#select-mark').find('option:selected').data('id');
    var cpid = theme.cpid;
    var name = theme.name;
    var identity = $('#select-mark').find('option:selected').data('cpid');
    $('#theme-mark').attr('src',url);
    var position = $('#mark-position').val();
    $('#theme-mark').attr('src',url);
    $.post('/zhuti/mark/editMark',{resid : cpid, name : name, position : position, id : id, markId: identity, type : type}, function(data) {
        if (data['result']) {
            alert('编辑成功');
            location.reload();
        } else {
            alert(data['error']);
        }
    },"json")
};

function upload() {
    var fd = new FormData();
    fd.append("input-1", $("#input-1")[0].files[0]);
    //var xhr = new XMLHttpRequest();
    //xhr.upload.onprogress = function (event) {
    //    if (event.lengthComputable) {
    //        var percent = Math.round(event.loaded * 100 / event.total);
    //        console.log('%d%', percent);
    //        $("#upprog").text(percent);
    //    }
    //};
    ////传输开始事件
    //xhr.onloadstart = function (event) {
    //    console.log('load start');
    //    $("#upprog").text('开始上传');
    //    $("#stopbtn").one('click', function () {
    //        xhr.abort();
    //        $(this).hide();
    //    });
    //    loading(true);
    //};
    ////ajax过程成功完成事件
    //xhr.onload = function(event) {
    //    console.log('load success');
    //    $("#upprog").text('上传成功');
    //    console.log(xhr.responseText);
    //    var ret = JSON.parse(xhr.responseText);
    //    addToFlist(ret.fname);
    //};
    //// ajax过程发生错误事件
    //xhr.onerror = function(event) {
    //    console.log('error');
    //    $("#upprog").text('发生错误');
    //};
    //
    //// ajax被取消
    //xhr.onabort = function(event) {
    //    console.log('abort');
    //    $("#upprog").text('操作被取消');
    //};
    //
    //// loadend传输结束，不管成功失败都会被触发
    //xhr.onloadend = function (event) {
    //    console.log('load end');
    //    loading(false);
    //};

    // 发起ajax请求传送数据
    //xhr.open('POST', '/zhuti/uploadFile', true);
    //xhr.send(fd);
    //$.post('/zhuti/uploadFile',{fd : 1}, function(data) {
    //    alert(data);
    //});
    var url = '/zhuti/uploadFile';
    var token = $("#J-verify").val();
    $.post(url, {f:fd,_token: token}, function (data) {
        var data = $.trim(data);
        alert(data);
    });
}

function addToFlist(fname) {
    var temp = ["<p id='" + fname + "'>",
        fname,
        "<button onclick='delFile(\"" + fname + "\");'>删除</button>",
        "</p>"
    ];
    $("#flist").append(temp.join(""));
}

function delFile(fname) {
    console.log('to delete file: ' + fname);
    //
}

function loading(showloading) {
    if (showloading) {
        $("#uptxt").show();
        $("#stopbtn").show();
    } else {
        $("#uptxt").hide();
        $("#stopbtn").hide();
    }
}




(function ($) {
    function editSort(type, id, resType, newsort, oldsort) {
        var token = $("#J-verify").val();

        if (type === 'input') {
            if (newsort == oldsort) {
                return false;
            }

            var pattern = /^\d+$/;
            if (!pattern.test(newsort)) {
                alert("请输入大于零的整数!");
                return false;
            }
        }
        $.post('/zhuti/editsort', {
            type: type, oldsort: oldsort, id: id, _token: token, newsort : newsort, resType : resType
        }, function (data) {
            if (data.result) {
                location.reload();
            } else {
                alert(data.error);
            }
        });
    }

    function changeStatus(model, id, type, val) {
        var token = $("#J-verify").val();
        var url = '/zhuti/' + model + '/changeStatus';

        $.post(url, {type : type, id: id, _token: token}, function (data) {
            if (data.result) {
                location.reload();
            } else {
                alert(data.error);
            }
        });
    }

    $(function () {
        $('#J-theme-list .sort input').on('blur', function () {
            var td = $(this).closest('td');
            var id = td.data('id');
            var oldsort = td.data('sort');
            var newsort = $(this).val();
            var resType = td.data('type');

            editSort('input', id, resType, newsort, oldsort);
        });

        $('#J-theme-list .sort .desc').on('click', function () {
            var td = $(this).closest('td');
            var id = td.data('id');
            var resType = td.data('type');

            editSort('desc', id, resType);
        });

        $('#J-theme-list .sort .asc').on('click', function () {
            var td = $(this).closest('td');
            var id = td.data('id');
            var resType = td.data('type');

            editSort('asc', id, resType);
        });

        $('#J-theme-list .good a').on('click', function () {
            var id = $(this).data('id');
            var model = $(this).data('model');

            changeStatus(model, id, 'good');
        });

        $('#J-theme-list .valid a').on('click', function () {
            var id = $(this).data('id');
            var model = $(this).data('model');

            changeStatus(model, id, 'valid');
        });

        $('#J-theme-show .refmark-valid a').on('click', function() {
            var id = $(this).data('id');
            var model = $(this).data('model');

            changeStatus(model, id, 'status');
        });

        $('.content img').on('dblclick',function () {
            var id = $(this).data('id');
            var model = $(this).data('model');
            changeStatus(model, id, 'valid');
        })
    });
})(jQuery);
