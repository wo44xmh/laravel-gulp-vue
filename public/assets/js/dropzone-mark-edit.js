var photo_counter = 0;
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('input[name="_token"]').val()
    }
});
Dropzone.options.realDropzone = {

    uploadMultiple: false,
    parallelUploads: 100,
    maxFilesize: maxSize,
    //previewsContainer: '#dropzonePreview',
    previewTemplate: document.querySelector('#preview-template').innerHTML,
    addRemoveLinks: false,
    dictRemoveFile: 'Remove',
    dictFileTooBig: 'Image is bigger than ' + maxSize + 'MB',
    acceptedFiles: '.png,.jpg',
    // 不自动上传
    autoProcessQueue: false,
    url: '/zhuti/mark/' + mark.id,

    // The setting up of the

    init: function() {
        var file = {zhName: mark.zhName};
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
            var name = $('#mark-name').val();
            // 如果没有队列，直接提交表单
            if (!(queue.length > 0)) {
                // $('#real-dropzone').submit();
                if (mark.id) {
                    $.ajax({
                        type: 'PUT',
                        url: '/zhuti/mark/' + mark.id,
                        data: {name : name},
                        dataType: 'json',
                        success: function(data) {
                            if (data && data.result) {
                                document.getElementById('modal-content').innerHTML= '角标名称修改成功';
                                $('#J-Modal').click();
                            } else {
                                document.getElementById('modal-content').innerHTML=data.error;
                                $('#J-Modal').click();
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
                if (mark.id) {
                $('#J-img-origin').attr('src', response.img)
                    .parent()
                    .attr('href', response.img);
                    self.removeFile(file);
                    if (response.name) {
                        $("#mark-name").val = response.name;
                    }
                    document.getElementById('modal-content').innerHTML='修改成功';
                    $('#J-Modal').click();
                } else {
                    document.getElementById('modal-content').innerHTML='修改成功';
                    $('#J-Modal').click();
                }
            } else {
                document.getElementById('modal-content').innerHTML= response.error;
                $('#J-Modal').click();
            }
        });
    },
}




