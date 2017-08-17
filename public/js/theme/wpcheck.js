$(".form_datetime").datetimepicker({
    fomat : 'yyyy-mm-dd',
    autoclose : true,
    minView : 2,
    todayBtn : true,
    todayHighlight : true,
    language: 'zh-CN',
});

function getImgHtml(url, order, id, cover)
{
    var div_s = '<div class="col-sm-1 col-md-1 img-min" style="position:relative" id=' + id + '>';
    var img_cover = '';
    var img = '<img src="' + url + '" imgOrder=' + order +' >';
    var div_e = '</div>';

    if (cover != false) {
        img_cover = '<span class="pass-cover checked" style="color:#00ff00">√</span>';
    }

    return div_s + img_cover + img + div_e;
}

$("#imgs-submit").on("click", function () {
    var gok = $(this);
    var wtype = $("#curwptype").val();
    var imgId = $('.content').find('span').map(function () {
        if (!$(this).hasClass('checked')) {
            return $(this).parents('.content').attr('id');
        }
    }).get();

    if (imgId.length > 0) {
        $.ajax({
            url: "/zhuti/wpSubmit",
            data: { 
                id: imgId,
                wtype: wtype,
            },
            dataType: "json",
            method: "POST",
            success: function(data) {
                if (data['code'] != 0) {
                    alert(data['msg']);
                    return false;
                }

                var ids = data['data'];
                for (i in ids) {
                    $('#'+ids[i]).find('span').css('color','#00ff00');
                    $('#'+ids[i]).find('span').addClass('checked');
                }
                gok.addClass('btn-success');
            }
        });
    }
});

function imgInfoRender(order, imgModal)
{
    var date = $("#datetime").val();
    var wtype = $("#curwptype").val();
    var num = $("#num").val();
    var page = $("#page").attr('page');
    var url = '/zhuti/getWpInfo?page=' + page + '&wtype=' + wtype + '&num=' + num + '&order=' + order + '&date=' + date;

    $.get(url, function(data) {
        if (data['code'] != 0) {
            alert(data['msg']);
            return false;
        }
        var imgInfo = data['data'];
        var check = false;
        if (typeof(imgInfo['check_status']) && imgInfo['check_status'] == 1) {
            check = true;
        }

        imgModal.attr('data-id', imgInfo['_id']);
        imgModal.find('#img-partner').val(partnerMap[imgInfo['sid']]['name']);
        imgModal.find('#img-id').val(imgInfo['img_id']);
        imgModal.find('#img-name').val(imgInfo['imgs']['filename']);
        imgModal.find('#img-type').val(typeMap[imgInfo['type']]);
        imgModal.find('#img-keyword').val(imgInfo['keyword']);
        imgModal.find('#img-content').attr('src', imgInfo['imgs']['img_url']);

        var imgRatio = imgModal.find('#img-ratio');
        imgRatio.html(imgInfo['imgs']['width'] + 'x' + imgInfo['imgs']['height']);
        imgRatio.attr('href', imgInfo['imgs']['img_url']);

        if (order <= 1) {
            $("#img-modal-front").hide();
        } else {
            $("#img-modal-front").show();
        }

        var total = $(".wp-column").length;
        if (order < total) {
            $("#img-modal-next").show();
        } else {
            $("#img-modal-next").hide();
        }

        if (check) {
            $(".img-cover").css('color','#00ff00');
            $(".img-cover").show();
            $("#img-modal-cancel").hide();
            $("#img-modal-check").hide();
        } else if (!$("#" + imgInfo['_id']).has('span').length) {
            $(".img-cover").hide();
            $("#img-modal-cancel").hide();
            $("#img-modal-check").show();
        } else {
            $(".img-cover").show();
            $("#img-modal-cancel").show();
            $("#img-modal-check").hide();
        }
        imgModal.modal('show');
    });
}

$(".wp-column").on("click", function () {
    var imgModal = $('#imgModal');
    var order = $(this).find('img').attr('order');
    var dataId = $(this).find('img').attr('data-id');

    imgModal.attr('order', order);
    imgInfoRender(order, imgModal);
});

$("#img-modal-next").on("click", function () {
    var imgModal = $('#imgModal');
    var order = parseInt(imgModal.attr('order')) + 1;

    imgModal.attr('order', order);
    imgInfoRender(order, imgModal);
});

$("#img-modal-front").on("click", function () {
    var imgModal = $('#imgModal');
    var order = parseInt(imgModal.attr('order')) - 1;

    if (order < 1) {
        alert('current img is the first one!');
        return false;
    }

    imgModal.attr('order', order);
    imgInfoRender(order, imgModal);
});

$("#img-modal-check").on("click", function () {
    var imgId = "#" + $('#imgModal').attr('data-id');
    var html = '<span class="pass-cover"  >√</span>';

    $(".img-cover").show();
    $(this).hide();
    $("#img-modal-cancel").show();
    $(imgId).prepend(html);
});

$("#img-modal-cancel").on("click", function () {
    var imgId = "#" + $('#imgModal').attr('data-id');

    $(".img-cover").hide();
    $(this).hide();
    $("#img-modal-check").show();
    $(imgId).find('span').remove();
});

$("#crawler").on("click", function () {
    $(this).html('正在抓取...');
    $.get('/zhuti/wpcrawler', function(data) {
        if (data['code'] == 0) {
            location.reload();
        } else {
            alert(data['msg']);
        }
        $('#crawler').html('抓取数据');
    });
});

$("#download").on("click", function () {
    var down = $(this);
    var wtype = $("#curwptype").val();
    var ids = $('.content').find('span').map(function () {
        if (!$(this).hasClass('checked')) {
            return $(this).parents('.content').attr('id');
        }
    }).get();
    if (ids.length > 0) {
        $.ajax({
            url: "/zhuti/wpdownload",
            data: { 
                ids: ids,
                wtype: wtype
            },
            dataType: "json",
            method: "POST",
            success: function(data) {
                if (data['code'] != 0) {
                    alert('download error');
                    return false;
                }
                down.toggleClass('btn-info');
                url = data['data']['url'];
                window.location.href = url;
            }
        });
    } else {
        alert('no image selected');
    }
});
