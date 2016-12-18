function loadGalleryImages() {
    let dbRef = firebase.database().ref();
    let uid = firebase.auth().currentUser.uid;
    $('.gallery-images').empty();

    dbRef.child("images/" + uid).on('child_added', renderImages);
    function renderImages(image) {
        $(`.noPhotos`).hide();
        $("#topDividerGallery").removeClass("red").addClass("green");

        let entryToRender = $(`
            <div class="imageHolder">
                <img class="materialboxed responsive-img z-depth-1 gallery-image" src="${image.val().url}">  
                <blockquote>
                    <span style="margin-right: 5%; font-size: 1.2em;">Name: <strong>${escape(image.val().name)}</strong></span>
                    <span style="margin-left: 5%; font-size: 1.2em;">Altitude: <strong>${escape(Math.round(image.val().alt))}m</strong> a.s.l.</span>
                </blockquote>
            </div>`);

        let buttonsRow = $(`<div class="row"></div>`);

        let deleteButton =
            $(`<a style="margin-left: 10px;" class="btn-floating btn-large waves-effect waves-light red">
                <i class="material-icons">delete</i></a>`).click(function () {
                let button = this;
                alertify.confirm('Confirm', 'Delete image?', function () {
                    deleteImage(image, button);
                }, function () {
                    showErrorAlert('Canceled.');
                });

            });
        buttonsRow.append(deleteButton);
        entryToRender.append(buttonsRow);
        entryToRender.append(`<div class="divider"></div>`);

        $('.gallery-images').prepend(entryToRender);
        $('.materialboxed').materialbox();
    }
}

function deleteImage(image, button) {
    let storageRef = firebase.storage().ref();
    let dbRef = firebase.database().ref();
    let key = image.key;
    let uid = firebase.auth().currentUser.uid;

    dbRef.child("/images/" + uid + "/" + key).remove().then(removeImageFromDBSuccess).catch(removeImageError);
    storageRef.child('thumbnails/' + uid + "/" + key).delete().then(deleteThumbnailSuccess).catch(removeImageError);
    storageRef.child('images/' + uid + "/" + key).delete().then(deleteImageSuccess).catch(removeImageError);

    function removeImageFromDBSuccess(image) {
        showSuccessAlert("Successfully deleted image.");
        $(button).parent().parent().remove();
    }

    function deleteThumbnailSuccess(image) {
    }

    function deleteImageSuccess(image) {
    }

    function removeImageError(error) {
        console.log(error);
        showErrorAlert("Error deleting image.")
    }


}