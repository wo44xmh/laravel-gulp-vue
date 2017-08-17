(function ($) {
    $('#J-font-list .sort input').on('blur', function () {
        var td = $(this).closest('td');
        var id = td.data('id');
        var oldsort = td.data('sort');
        var newsort = $(this).val();
        var resType = td.data('type');

        editSort('input', id, resType, newsort, oldsort);
    });

    $('#J-font-list .sort .desc').on('click', function () {
        var td = $(this).closest('td');
        var id = td.data('id');
        var resType = td.data('type');

        editSort('desc', id, resType);
    });

    $('#J-font-list .sort .asc').on('click', function () {
        var td = $(this).closest('td');
        var id = td.data('id');
        var resType = td.data('type');

        editSort('asc', id, resType);
    });

    $('#J-font-list .valid a').on('click', function () {
        var id = $(this).data('id');
        var model = $(this).data('model');

        changeStatus(model, id, 'valid');
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
        $.post('/zhuti/fonteditsort', {
            type: type, oldsort: oldsort, id: id, _token: token, newsort: newsort, resType: resType
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
})(jQuery);
