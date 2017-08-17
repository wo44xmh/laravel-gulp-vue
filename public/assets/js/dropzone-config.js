var photo_counter = 0;

Dropzone.options.realDropzone = {

    uploadMultiple: false,
    parallelUploads: 100,
    maxFilesize: maxSize,
    previewsContainer: '#dropzonePreview',
    previewTemplate: document.querySelector('#preview-template').innerHTML,
    addRemoveLinks: false,
    dictRemoveFile: 'Remove',
    dictFileTooBig: 'Image is bigger than ' + maxSize + 'MB',
    acceptedFiles: '.png,.jpg',
    // 不自动上传
    autoProcessQueue: false,

    // The setting up of the dropzone
    init: function() {

        var file = {name: preview.name, size: preview.size};

        // already file
        // this.emit("addedfile", file);
        // this.emit("thumbnail", file, preview.link);
        // this.createThumbnailFromUrl(file, preview.link);
        // this.emit("complete", file);
        // this.options.maxFiles = 1;

        var submitButton = document.querySelector("#J-submit"),
            self = this; // closure

        submitButton.addEventListener("click", function() {
            var queue = self.getQueuedFiles();

            // 如果没有队列，直接提交表单
            if (!(queue.length > 0)) {
                // $('#real-dropzone').submit();
                if (preview.id) {
                    $.ajax({
                        type: 'PUT',
                        url: '/zhuti/themepreview/' + preview.id,
                        data: {type: $('#J-type').val()},
                        dataType: 'json',
                        success: function(data) {
                            if (data && data.result) {
                                alert('修改成功');
                            } else {
                                alert(data.error);
                            }
                        }
                    });
                }
            } else {
                self.processQueue(); // Tell Dropzone to process all queued files.
            }
        });

        this.on("removedfile", function(file) {
            // $.ajax({
            //     type: 'POST',
            //     url: 'delete',
            //     data: {id: file.name},
            //     dataType: 'html',
            //     success: function(data) {
            //         var rep = JSON.parse(data);

            //         if(rep.code == 200) {
            //             photo_counter--;
            //             $("#photoCounter").text( "(" + photo_counter + ")");
            //         }

            //     }
            // });
        });

        this.on("maxfilesexceeded", function(file) {
            this.removeFile(file);
            alert('超出个数');
        });

        this.on("success", function(file, response) {
            if (response && response.result) {
                if (preview.id) {
                    $('#J-img-origin').attr('src', response.img)
                        .parent()
                        .attr('href', response.img);

                    self.removeFile(file);
                } else {
                    alert('修改成功');
                    location.href = '/zhuti/themepreview/' + response.id + '/edit';
                }
            } else {
                alert('提交有误，请重试');
            }
        });
    },

    error: function(file, response) {
        if ($.type(response) === "string") {
            var message = response; //dropzone sends it's own error messages in string
        } else {
            var message = response.message;
        }

        file.previewElement.classList.add("dz-error");
        _ref = file.previewElement.querySelectorAll("[data-dz-errormessage]");
        _results = [];

        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(node.textContent = message);
        }

        return _results;
    },

    success: function(file, done) {
    }
}
