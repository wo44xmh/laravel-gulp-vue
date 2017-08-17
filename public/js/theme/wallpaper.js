(function ($) {
    $('.box .edit button.btn').click(function () {
        /* 机型过滤 */
        var allProd = ($("#allProduct").data('allprod') + '').split(",");

        var prodtoexclude = ($(this).data('prodtoexclude') + '').split(",");
        init_select("#prodToExclude", allProd, prodtoexclude);
        $("#prodToExclude").parent().find("input.my-hidden-input").val(prodtoexclude.join(","));

        var prodtoinclude = ($(this).data('prodtoinclude') + '').split(",");
        init_select("#prodToInclude", allProd, prodtoinclude);
        $("#prodToInclude").parent().find("input.my-hidden-input").val(prodtoinclude.join(","));

        /* 地区过滤 */
        var allCountries = ($("#allCountries").data('allprod') + '').split(",");

        var countriestoexclude = ($(this).data('countriestoexclude') + '').split(",");
        init_select("#countriesToExclude", allCountries, countriestoexclude);
        $("#countriesToExclude").parent().find("input.my-hidden-input").val(countriestoexclude.join(","));

        var countriestoinclude = ($(this).data('countriestoinclude') + '').split(",");
        init_select("#countriesToInclude", allCountries, countriestoinclude);
        $("#countriesToInclude").parent().find("input.my-hidden-input").val(countriestoinclude.join(","));


        var url = $(this).data('url');
        var src = $(this).data('src');
        $('.modal-body img').attr('src', url);
        $('.modal-body a').attr('href', src);
        var keyword = $(this).data('keyword');
        var wpsource = $(this).data('wpsource');
        $('#wpkeyword').attr('value', keyword);
        $('#wpsource').attr('value', wpsource);
        var cate = $(this).data('cate');
        var id = $(this).data('id');
        $('#J-wp-id').attr('value', id);
        $('#myModalLabel').html('QIKU-' + id);

        // 设置当前状态
        var isAmaze = $('#J-Modal-' + id).attr('data-isamaze');
        $('#J-isAmaze option[value=' + isAmaze + ']').attr('selected', 'selected');
        $('#wpcate option[value=' + cate + ']').attr('selected', 'selected');
        $('#J-isAmaze option[value!=' + isAmaze + ']').removeAttr('selected');
        $('#wpcate option[value!=' + cate + ']').removeAttr('selected');
    });

    $(".livewpBtn").on('click', function () {
        var status;
        if ($(this).data("amaze") == 1) {
            $(this).data("amaze", 0);
            $(this).children(".fa").removeClass("fa-check").addClass("fa-ban");
            status = 0;
        } else {
            $(this).children(".fa").removeClass("fa-ban").addClass("fa-check");
            $(this).data("amaze", 1);
            status = 1;
        }
        var token = $("#J-verify").val();
        var wtype = $("#wtype").val();
        var id = $(this).data('id');
        $.post('/zhuti/wpeditAmaze', {'token': token, 'id': id, 'status': status, 'wtype': wtype}, function (res) {
            if (!res.json) {
                alert('服务端错误');
            }
        });
    });

    $('#J-wallpaper-list .sort input').on('blur', function () {
        var div = $(this).closest('div');
        var id = div.data('id');
        var oldsort = div.data('sort');
        var newsort = $(this).val();
        var resType = div.data('type');
        editSort('input', id, resType, newsort, oldsort);
    });

    $('.panel-heading #change-sort').on('click', function () {
        changeSort();
    });

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
        $.post('/zhuti/wpeditsort', {
            type: type, oldsort: oldsort, id: id, _token: token, newsort: newsort, resType: resType
        }, function (data) {
            if (data.result) {
                location.reload();
            } else {
                alert(data.error);
            }
        });
    }

    var arr = new Array();
    $('.J-columns .content img').each(function () {
        var id = $(this).data('id');
        var sort = $(this).data('sort');
        arr.push(sort);
    });

    function changeSort() {
        var newArr = new Array();
        var token = $("#J-verify").val();
        $('.J-columns .content img').each(function () {
            var id = $(this).data('id');
            newArr.push(id);
        });
        var data = {};
        for (var i = 0; i < newArr.length; i++) {
            data[newArr[i]] = arr[i];
        }
        var jsonArr = JSON.stringify(data);
        $.post('/zhuti/wallpaper/changesort', {data: jsonArr, _token: token}, function (data) {
            if (data && data['result']) {
                location.reload();
            }
        }, 'json')
    }

    var hoverTimer, outTimer;
    $('.J-columns').hover(function (e) {

        var src = $(this).find('img').attr('src');
        $("#preview img:first").attr('src', src);
        if (e.clientX > (document.body.clientWidth - 800) && e.clientY > (window.innerHeight - 600)) {
            $("#preview").css('left', '40px');
            $("#preview").css('right', 'auto');
        } else {
            $("#preview").css('right', '40px');
            $("#preview").css('left', 'auto');
        }
        clearTimeout(outTimer);
        hoverTimer = setTimeout(function () {
            $("#preview").fadeIn("slow");
        }, 1000);
    }, function () {
        clearTimeout(hoverTimer);
        outTimer = setTimeout(function () {
            $("#preview").fadeOut("fast", function () {
            });
        }, 50);
    });


})(jQuery);

function checkWp() {
    var wpkeyword = $('#wpkeyword').val();
    var author = $('#wpsource').val();
    var cate = $('#wpcate').val();
    var id = $('#J-wp-id').val();
    var token = $("#J-verify").val();
    var wtype = $("#wtype").val();

    var isAmaze = $("#J-isAmaze").val();
    var domAmaze = $("#J-Modal-" + id).attr("data-isamaze");

    var updateType = null;
    if (isAmaze == domAmaze) {
        updateType = 0;
    } else {
        updateType = 1;
    }

    var prodtoexclude = $("input[name=prodToExclude]").val();
    var prodtoinclude = $("input[name=prodToInclude]").val();
    var countriestoexclude = $("input[name=countriesToExclude]").val();
    var countriestoinclude = $("input[name=countriesToInclude]").val();

    $(".edit").find("[data-id=" + id + "]").data("prodtoexclude", prodtoexclude);
    $(".edit").find("[data-id=" + id + "]").data("prodtoinclude", prodtoinclude);
    $(".edit").find("[data-id=" + id + "]").data("countriestoexclude", countriestoexclude);
    $(".edit").find("[data-id=" + id + "]").data("countriestoinclude", countriestoinclude);

    $.ajax({
        type: 'PUT',
        url: '/zhuti/wallpaper/' + id,
        data: {
            keyword: wpkeyword,
            cate: cate,
            id: id,
            _token: token,
            author: author,
            wtype: wtype,
            isAmaze: isAmaze,
            updateType: updateType,
            productBlackList: prodtoexclude,
            productWhiteList: prodtoinclude,
            countriesToExclude: countriestoexclude,
            countriesToInclude: countriestoinclude,
        },
        dataType: 'json',
        success: function (data) {
            if (data && data.result) {
                alert('编辑成功');
            } else {
                if (data.msg) {
                    alert(data.msg);
                } else {
                    alert('编辑失败');
                }
            }
            location.reload();
        }
    });
}
