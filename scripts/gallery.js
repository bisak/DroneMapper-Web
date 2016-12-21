function loadGalleryImages() {
    let dbRef = firebase.database().ref();
    let uid = firebase.auth().currentUser.uid; //TODO fix firebase.auth() to seperate declaration
    $('.gallery-images').empty();

    dbRef.child("images/" + uid).on('child_added', renderImages); /*TODO fix with once value*/
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
        $(button).parent().parent().parent().fadeOut(500, function () {
            $(this).remove();
        });
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
                <div class="galleryImageHolder col s12 m10 l9">
                    <img class="materialboxed responsive-img z-depth-2 gallery-image" src="${image.val().url}">  
                    <br>
                    ${getShareImageURLElement(image)}
                    ${getInfoCollectionElement(image)}
                </div>
            </div>`);

    let buttonsRow = $(`<div class="row"></div>`);
    let fixerDiv = $(`<div class="col m1 l1"></div>`);
    let divider = $(`<div class="divider"></div>`);

    let deleteButton =
        $(`<a class="btnGalleryExtra btn-floating btn-large waves-effect waves-light red">
                <i class="material-icons">delete</i></a>`).click(function () {
            let button = this;
            alertify.confirm('Confirm', `Delete picture - <strong>${escape(image.val().name)}</strong>`, function () {
                deleteImage(image, button);
            }, function () {
                showErrorAlert('Canceled.');
            });
        });

    let editButton = $(`<a href="#" class="btnGalleryExtra btn-floating btn-large waves-effect waves-light orange">
                <i class="material-icons">edit</i></a>`).click(function () {
        let button = this;
        showEditImageView(image);
    });

    let shareButton = $(`<a class="btnGalleryExtra btn-floating btn-large waves-effect waves-light blue">
                <i class="material-icons">share</i></a>`).click(function () {
        entryToRender.find(".shareUrlHolder").fadeToggle("fast", "linear");
        entryToRender.find(".shareUrl").val(makeShareImageURL(image.key, firebase.auth().currentUser.uid)); //TODO fix this
    });

    let showMoreButton = $(`<a class="btnGalleryExtra btn-floating btn-large waves-effect waves-light green accent-4">
                <i class="material-icons">view_list</i></a>`).click(function () {
        entryToRender.find(".infoCollection").fadeToggle("fast", "linear");
    });

    fixerDiv.append(showMoreButton).append(shareButton).append(editButton).append(deleteButton);
    buttonsRow.append(fixerDiv);
    entryToRender.append(buttonsRow).append(divider);
    return entryToRender;
}

function getShareImageURLElement(image) {
    return`<div class="shareUrlHolder">
                <span>URL</span>
                <input disabled type="text" class="grey-text shareUrl active">
           </div>`;
}