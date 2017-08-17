
var isH5 = function(flag) {
    if (flag) {
        $("#J-H5Url").show();
    } else {
        $("#J-H5Url").hide();
    }
}

function changeStatus(model, id, type, val) {
    var token = $("#J-verify").val();
    var url = '/zhuti/album/changeStatus';

    $.post(url, {type : type, id: id, model : model, _token: token}, function (data) {
        if (data.result) {
            location.reload();
        } else {
            alert(data.error);
        }
    });
}

$(function () {
    $('#J-album-list .valid a').on('click', function () {
        var id = $(this).data('id');
        var model = $(this).data('model');
        var type = $(this).data('type');

        changeStatus(model, id, type);
    });
    $('#J-alert-warning button').on('click', function () {
        $("#J-alert-info").hide();
    });
    $('#J-search-list .add-res a').on('click', function () {
        var cpid = $(this).data('id');
        var url = '/zhuti/album/addAlbumRes';
        var token = $("#J-verify").val();

        $.post(url, {album_id : album_id, cpid : cpid, type : module, _token: token}, function(data) {
            if (data.result) {
                location.reload();
            } else {
                alert(data.error);
            }
        });
    });
})(jQuery);

function alertInfo() {
    $("#J-alert-info").show();
}

function deleteRes() {
    $("#J-alert-info").hide();
    var id = delete_id;
    var token = $("#J-verify").val();
    var url = '/zhuti/album/delete';

    $.get(url, {id : id, _token: token}, function(data) {
        if (data.result) {
            location.reload();
        } else {
            alert(data.error);
        }
    });
}