$(document).ready(function() {
    var cols = document.querySelectorAll('.J-columns .column');
    [].forEach.call(cols, function(col) {
        col.addEventListener('dragstart', handleDragStart, false);
        col.addEventListener('dragenter', handleDragEnter, false);
        col.addEventListener('dragover', handleDragOver, false);
        col.addEventListener('dragleave', handleDragLeave, false);
        col.addEventListener('dragend', handleDragEnd, false);
        col.addEventListener('drop', handleDrop, false);
    });
    var dragSrcEl = null;
    function handleDragStart(e) {
        this.classList.add('drag');
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }
    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDragEnter(e) {
        this.classList.add('over');
    }

    function handleDragLeave(e) {
        this.classList.remove('over');
    }
    function handleDragEnd(e) {
        [].forEach.call(cols, function (col) {
            col.classList.remove('over');
        });
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        this.classList.remove('drag');
        dragSrcEl.classList.remove('drag');
        if (dragSrcEl != this) {
            dragSrcEl.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData('text/html');

        }
        return false;
    }
})
