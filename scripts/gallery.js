function loadGalleryImages() {
    let dbRef = firebase.database().ref();
    let uid = firebase.auth().currentUser.uid;
    $('.gallery-images').empty();

    dbRef.child("images/" + uid).on('child_added', renderImages);
    function renderImages(image) {
        $(`.noPhotos`).hide();
        $("#topDividerGallery").removeClass("red").addClass("green");

        let entryToRender = getEntryToRender(image);

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
        $(button).parent().parent().parent().remove();
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


function getEntryToRender(image) {
    let entryToRender = $(`
            <div class="row">
            <div class="galleryImageHolder col s12 m11 l11">
                <img class="materialboxed responsive-img z-depth-2 gallery-image" src="${image.val().url}">  
                <blockquote class="z-depth-2">
                    <span style="margin-right: 3%; font-size: 1.2em;">Name: <strong>${escape(image.val().name)}</strong></span>
                    <span style="margin-left: 3%; font-size: 1.2em;">Altitude: <strong>${escape(Math.round(image.val().alt))}m</strong> a.s.l.</span>
                </blockquote>
            </div>
            </div>`);

    let buttonsRow = $(`<div class="row"></div>`);
    let fixerDiv = $(`<div class="col m1 l1"></div>`);
    let divider = $(`<div class="divider"></div>`);

    let deleteButton =
        $(`<a style="margin: 5px;" class="btn-floating btn-large waves-effect waves-light red">
                <i class="material-icons">delete</i></a>`).click(function () {
            let button = this;
            alertify.confirm('Confirm', 'Delete image?', function () {
                deleteImage(image, button);
            }, function () {
                showErrorAlert('Canceled.');
            });

        });

    let editButton = $(`<a style="margin: 5px;" class="btn-floating btn-large waves-effect waves-light orange">
                <i class="material-icons">edit</i></a>`).click(function () {
        let button = this;
        showEditImageView(image, button);
    });

    let shareButton = $(`<a style="margin: 5px;" class="btn-floating btn-large waves-effect waves-light blue">
                <i class="material-icons">share</i></a>`).click(function () {

    });

    fixerDiv.append(shareButton).append(editButton).append(deleteButton);
    buttonsRow.append(fixerDiv);
    entryToRender.append(buttonsRow).append(divider);
    return entryToRender;
}