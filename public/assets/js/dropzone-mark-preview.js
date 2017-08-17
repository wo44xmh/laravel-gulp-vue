Dropzone.autoDiscover = false;
(function () {
    $('#J-preview-img').dropzone({
        url: "/zhuti/mark/uploadPreviewImg/" + mark.id,
        paramName: 'img',
        uploadMultiple: false,
        parallelUploads: 100,
        maxFilesize: maxSize,
        addRemoveLinks: false,
        dictFileTooBig: 'Image is bigger than ' + maxSize + 'MB',
        acceptedFiles: '.png,.jpg',
        // 不自动上传
        autoProcessQueue: true,

        // The setting up of the dropzone
        init: function() {
        },

        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },

        sending: function(file, xhr, formData) {
            // Pass token. You can use the same method to pass any other values as well such as a id to associate the image with for example.
            // Laravel expect the token post value to be named _token by default
            // xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
            formData.append('_method', 'PUT');
        },

        error: function(file, response) {
            alert('提交有误，请重试');
            return false;
        },

        success: function(file, response) {
            if (response && response.result) {
                $('#J-preview-img').attr('src', response.img);
            } else {
                console.log(reponse);
                alert('提交有误，请重试');
            }
        }
    }).popover({
        trigger: 'hover'
    })
})();
