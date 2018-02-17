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

        // Post request for adding comments
        var post_id = $('#post_id').val();
        var headers = new Headers({
            "Content-Type": "application/json"
        });
        var initObj = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                comment: $('#postComment').val()
            })
        };
        var postURL = "/posts/" + post_id + "/comments/new";
        fetch(postURL, initObj)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            });
    });

});