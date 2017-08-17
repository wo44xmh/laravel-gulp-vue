Dropzone.autoDiscover = false;
(function () {
    var myDropzone = new Dropzone('#J-preview-img', {
        url: "/zhuti/wallpaper/uploadImg",
        paramName: 'img',
        uploadMultiple: true,
        parallelUploads: 100,
        maxFilesize: maxSize,
        addRemoveLinks: false,
        dictFileTooBig: 'Image is bigger than ' + maxSize + 'MB',
        acceptedFiles: '.png,.jpg,.jpeg',
        // 不自动上传
        autoProcessQueue: false,

        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },

        sendingmultiple: function(file, xhr, formData) {
            formData.append('_method', 'PUT');
            formData.set('keyword', $('#wpkeywords').val());
            formData.set('source', $('#wpsources').val());
            formData.set('cate', $('#wpcates').val());
            formData.set('banner', $('#banner').val());
            formData.set('curwp', $('#curwptype').val());
            if ($('#curwptype').val() == 'singlewp') {
                formData.set('master', document.getElementById("master").checked);
            } else if ($('#curwptype').val() == 'doublewp') {
                formData.set('bannerid', $('#bannerid').val());
            }
        },

        successmultiple: function(file, response) {
            $('#progressbar').modal('hide');
            alert(response['msg']);
            location.reload();
        },
        
        addedfile: function(file) {
            $('#uploadInfo').modal('show');
        },

        totaluploadprogress: function(progress, bytesSent) {
            var bar = $('#bar');
            var barInfo = $('#barInfo');
            barInfo.html(progress);
            bar.css('width', progress + '%');
            bar.attr('aria-valuenow', progress + '%');
        }
    });

    $('#uploadwp').on('click', function() {
        if ($('#curwptype').val() == 'singlewp') {
            var master = document.getElementById("master").checked;
            var banner = $('#banner').val();
            if (master && banner == '') {
                alert('选定大师专栏的同时必须填写banner');
                return false;
            }
        } else if ($('#curwptype').val() == 'doublewp') {
            var banner = $('#banner').val().trim();
            var bannerID = $('#bannerid').val().trim();
            if ((banner == '' && bannerID != '') || (banner != '' && bannerID == '')){
                alert('双幅banner上传必须同时填写banner 和 bannerid');
                return false;
            }
        }
        $('#progressbar').modal('show');
        myDropzone.processQueue();
    });

})();




