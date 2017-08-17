$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('#_token').val()
    }
});

$(".form_datetime").datetimepicker({
    fomat : 'yyyy-mm-dd',
    autoclose : true,
    minView : 2,
    todayBtn : true,
    todayHighlight : true,
    language: 'zh-CN',
});

$(".form_datetime").on("changeDate", function (ev) {
    var t = ev.date.valueOf()/1000;
    window.location.href = '/magazine/page/lockscreen.magazine?t=' + t;
});

$("#preDay").on("click", function () {
    var t = (new Date($("#datetime").val().replace(/-/g, "/"))).getTime()/1000 - 86400;
    window.location.href = '/magazine/page/lockscreen.magazine?t=' + t;
});

$("#nextDay").on("click", function () {
    var t = (new Date($("#datetime").val().replace(/-/g, "/"))).getTime()/1000 + 86400;
    window.location.href = '/magazine/page/lockscreen.magazine?t=' + t;
});

$(".glyphicon-download-alt").on("click", function () {
    var down = $(this);
    var sid = $(this).parents('tr').attr('sid');
    var mgzId = $(this).parents('tr').attr('mgzId');
    var dailyId = $(this).parents('tr').attr('dailyId');
    var imgIds = $(this).parents('tr').next().find('span').parents('.img-min').map(function () {
        if (!$(this).find('span').hasClass('checked')) {
            var str = this.id;
            return parseInt(str.slice(str.lastIndexOf('_')+1));
        }
    }).get();

    if (imgIds.length > 0) {
        $.ajax({
            url: "/lockscreen/mgzdownload",
            data: { 
                sid: sid, 
                mgzId: mgzId, 
                dailyId: dailyId, 
                imgIds: imgIds
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

$(".glyphicon-list-alt,.list-alt").on("click", function () {
    var sid = $(this).parents('tr').attr('sid');
    var mgzId = $(this).parents('tr').attr('mgzId');
    var dailyId = $(this).parents('tr').attr('dailyId');
    var sp_img = $(this).parents('tr').next().find('.sp-img');

    if (sp_img.children().length == 0) {
        $.ajax({
            url: "/lockscreen/getMgzInfo?sid=" + sid + '&mgzId=' + mgzId + '&dailyId=' + dailyId,
            dataType: "json",
            method: "GET",
            success: function(data) { 
                if (data['code'] !=0 ) {
                    alert(data['msg']);
                    return;
                }

                var imgs = data['data'];
                var html = "";
                var cover = false;

                for(i in imgs) {
                    cover = false;
                    if (typeof(imgs[i]['check_status']) != "undefined" && imgs[i]['check_status'] == 1) {
                        cover = true;
                    }

                    var id = mkSingleId(sid, mgzId, dailyId, imgs[i]['img_id']);
                    html = getImgHtml(id, parseInt(i)+1, cover, imgs[i]);
                    sp_img.append(html);
                }
            }
        });
    }

    $(this).parents('tr').next().toggle();
    $(this).parents('tr').find('.glyphicon-list-alt').toggleClass('btn-info');
});

function mkSingleId(sid, mgzId, dailyId, imgId)
{
    return sid + '_' + mgzId + '_' + dailyId + '_' + imgId;
}

function getImgHtml(id, order, cover, data)
{
    var div_s = '<div class="col-sm-1 col-md-1 img-min" style="position:relative" id=' + id + '>';
    var img_cover = '';
    var img = '<img src="' + data['preview_img'] + '" imgOrder=' + order +' >';
    var div_e = '</div>';

    if (cover != false) {
        img_cover = '<span class="pass-cover checked" style="color:#00ff00">√</span>';
    }

    return div_s + img_cover + img + div_e;
}

$(".glyphicon-ok").on("click", function () {
    var gok = $(this);
    var sid = $(this).parents('tr').attr('sid');
    var mgzId = $(this).parents('tr').attr('mgzId');
    var dailyId = $(this).parents('tr').attr('dailyId');

    var imgId = $(this).parents('tr').next().find('span').parents('.img-min').map(function () {
        if (!$(this).find('span').hasClass('checked')) {
            var str = this.id;
            return parseInt(str.slice(str.lastIndexOf('_')+1));
        }
    }).get();

    if (imgId.length > 0) {
        $.ajax({
            url: "/lockscreen/mgzSubmit",
            data: { 
                sid: sid, 
                mgzId: mgzId, 
                dailyId: dailyId, 
                imgIds: imgId
            },
            dataType: "json",
            method: "POST",
            success: function(data) {
                if (data['code'] != 0) {
                    alert(data['msg']);
                    return false;
                }

                var data = data['data'];
                var imgIds = data['imgIds'];
                for (i in imgIds) {
                    var id = mkSingleId(data['sid'], data['mgzId'], data['dailyId'], imgIds[i]);
                    $('#' + id).find('span').css('color','#00ff00');
                    $('#' + id).find('span').addClass('checked');
                }
                gok.addClass('btn-success');
            }
        });
    }
});

function imgInfoRender(imgModal)
{
    var sid = imgModal.attr('sid');
    var mgzId = imgModal.attr('mgzId');
    var dailyId = imgModal.attr('dailyId');
    var order = imgModal.attr('order');
    var url = '/lockscreen/getImgInfo?sid=' + sid + '&mgzId=' + mgzId + '&dailyId=' + dailyId + '&order=' + order;

    $.get(url, function(data) {
        if (data['code'] != 0) {
            alert(data['msg']);
            return false;
        }
        var imgInfo = data['data'];
        var imgs = imgInfo['resource'];
        var sdiv = imgModal.find('#template_img').parent();
        var check = false;
        if (typeof(imgInfo['check_status']) && imgInfo['check_status'] == 1) {
            check = true;
        }

        imgModal.attr('imgId', imgInfo['img_id']);
        imgModal.find('#img-id').html(imgInfo['img_id']);
        imgModal.find('#img-title').html(imgInfo['title']);
        imgModal.find('#img-decribe-content').html(imgInfo['content']);
        imgModal.find('#img-shelves').html((new Date(imgInfo['shelves_date']*1000).toLocaleString()));
        imgModal.find('#img-tag').html(imgInfo['tag']);
        imgModal.find('#img-link').attr('href', imgInfo['url_click']);
        imgModal.find('#img-content').attr('src',imgInfo['preview_img']);
        imgModal.find('#resource-type').html(imgInfo['resource_type']);
        imgModal.find('#img-start').html((new Date(imgInfo['start_time']*1000).toLocaleString()));
        imgModal.find('#img-end').html((new Date(imgInfo['end_time']*1000).toLocaleString()));

        $('.size_img').remove();

        for (k in imgs) {
            var template = imgModal.find('#template_img').clone();
            template.removeAttr('style');
            template.addClass('size_img');
            template.html(imgs[k]['ratio']);
            template.attr('href', imgs[k]['url']);
            sdiv.prepend(template);
        }

        if (order <= 1) {
            //$("#img-modal-front").hide();
            $("#img-modal-front").attr("disabled", "disabled");
        } else {
            $("#img-modal-front").removeAttr("disabled");
        }

        if (imgInfo['next']) {
            $("#img-modal-next").removeAttr("disabled");
        } else {
            $("#img-modal-next").attr("disabled", "disabled");
        }

        var id = mkSingleId(sid, mgzId, dailyId, imgInfo['img_id']);
        if (check) {
            $(".img-cover").css('color','#00ff00');
            $(".img-cover").show();
            $("#img-modal-cancel").hide();
            $("#img-modal-check").hide();
        } else if (!$("#" + id).has('span').length) {
            $(".img-cover").hide();
            $("#img-modal-cancel").hide();
            $("#img-modal-check").show();
        } else {
            $(".img-cover").show();
            $("#img-modal-cancel").show();
            $("#img-modal-check").hide();
        }
    });
}

$(".sp-img").on("click", ".img-min", function () {
    var imgModal = $('#imgModal');
    var order = $(this).find('img').attr('imgOrder');
    var sid = $(this).parents('.sp-img').attr('sid');
    var mgzId = $(this).parents('.sp-img').attr('mgzId');
    var dailyId = $(this).parents('.sp-img').attr('dailyId');

    imgModal.attr('sid', sid);
    imgModal.attr('mgzId', mgzId);
    imgModal.attr('dailyId', dailyId);
    imgModal.attr('order', order);

    imgInfoRender(imgModal);
    imgModal.modal('show');
});

$("#img-modal-next").on("click", function () {
    var imgModal = $('#imgModal');
    var order = parseInt(imgModal.attr('order')) + 1;
    imgModal.attr('order', order);

    imgInfoRender(imgModal);
});

$("#img-modal-front").on("click", function () {
    var imgModal = $('#imgModal');
    var order = parseInt(imgModal.attr('order')) - 1;

    if (order < 1) {
        alert('current img is the first one!');
        return false;
    }
    imgModal.attr('order', order);
    imgInfoRender(imgModal);
});

$("#img-modal-check").on("click", function () {
    var sid = $('#imgModal').attr('sid');
    var mgzId = $('#imgModal').attr('mgzId');
    var dailyId = $('#imgModal').attr('dailyId');
    var imgId = $('#imgModal').attr('imgId');
    var id = "#" + mkSingleId(sid, mgzId, dailyId, imgId);
    var html = '<span class="pass-cover"  >√</span>';

    $(".img-cover").show();
    $(this).hide();
    $("#img-modal-cancel").show();
    $(id).prepend(html);
});

$("#img-modal-cancel").on("click", function () {
    var sid = $('#imgModal').attr('sid');
    var mgzId = $('#imgModal').attr('mgzId');
    var dailyId = $('#imgModal').attr('dailyId');
    var imgId = $('#imgModal').attr('imgId');
    var id = "#" + mkSingleId(sid, mgzId, dailyId, imgId);

    $(".img-cover").hide();
    $(this).hide();
    $("#img-modal-check").show();
    $(id).find('span').remove();
});

$("#crawler").on("click", function () {
    $(this).html('正在抓取...');
    $.get('/lockscreen/mgzcrawler', function(data) {
        if (data['code'] == 0) {
            location.reload();
        } else {
            alert(data['msg']);
        }
        $('#crawler').html('抓取数据');
    });
});
