$(document).ready(function () {
    var addCommentButton = document.getElementById('addComment');
    addCommentButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        var comment = $('#postComment').val();
        var commentSection = $('#comments');
        commentSection.append(`
        <div class="comments">`
        + comment +
        `</div>
        <hr>`);
    });

});