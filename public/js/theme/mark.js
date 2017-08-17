/**
 * Created by zhouyuhong on 2016/4/8.
 */
(function($) {
    function changeStatus(id, type, val) {
        var token = $("#J-verify").val();
        var url = '/zhuti/mark';
        $.post(url, {type: type, id: id, _token: token},function (data){
            if (data.result) {
                location.reload();
            } else {
                alert(data.error);
            }
        });
    }

    $(document).ready(function () {
        $("#J-mark-list .valid a").on('click', function () {
            var id = $(this).data('id');
            changeStatus(id, 'marklist');
        });
    });
})(jQuery)