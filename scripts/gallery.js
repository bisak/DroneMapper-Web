function loadGalleryImages() {
    let dbRef = firebase.database().ref();
    let uid = firebase.auth().currentUser.uid;

    dbRef.child("images/" + uid).once('value', renderImages);
    function renderImages(imagesData) {
        let dbParentKey = imagesData.key;
        let images = imagesData.val();

        $('.gallery-images').empty();
        for (let image in images) {
            $(`.noPhotos`).hide();
            $("#topDividerGallery").removeClass("red").addClass("green");
            let entryToRender = getGalleryEntryToRender(images[image], image, dbParentKey);
            $('.gallery-images').prepend(entryToRender);
            $('.materialboxed').materialbox();
        }
    }
}

function getGalleryEntryToRender(currentImage, currentImageId, dbParentKey) {
    let row = $(`<div class="row"></div>`);
    let galleryImageHolderDiv = $(`<div class="galleryImageHolder col s12 m9 l9"></div>`);
    let galleryImageInfoHolderDiv = $(`<div class="galleryImageInfoHolder col s12 m9 l9"></div>`);
    let imageElement = $(`<img class="materialboxed responsive-img z-depth-2 gallery-image" src="${currentImage.url}">`);
    let imageShareUrl = $(getShareImageURLElement(currentImage));
    let imageInfo = $(getInfoCollectionElement(currentImage));

    galleryImageHolderDiv.append(imageElement);
    galleryImageInfoHolderDiv.append(imageShareUrl).append(imageInfo);

    let divider = $("<div class='row'><div class='col s12 m9 l9'><div class='divider'></div></div></div>");
    let buttonsHolder = $(`<div class="col s12 m1 l1"></div>`);

    let deleteButton =
        $(`<a class="btnGalleryExtra btn-floating btn-large waves-effect waves-light red">
                <i class="material-icons">delete</i></a>`).click(function () {
            let button = this;
            alertify.confirm('Confirm', `Delete picture - <strong>${escape(currentImage.name)}</strong>`, function () {
                deleteImage(currentImage, currentImageId, button);
            }, function () {
            });
        });

    let editButton = $(`<a href="#" class="btnGalleryExtra btn-floating btn-large waves-effect waves-light orange">
                <i class="material-icons">edit</i></a>`).click(function () {
        showEditImageView(currentImage, currentImageId);
    });

    let linkButton = $(`<a class="btnGalleryExtra btn-floating btn-large waves-effect waves-light blue">
                <i class="material-icons">web</i></a>`).click(function () {
        let button = this;
        alertify.confirm('Confirm', `Share picture to wall - <strong>${escape(currentImage.name)}</strong>`, function () {
            handleShareImageOnWall(currentImage, currentImageId, button);
        }, function () {
        });
    });

    let wallShareButton = $(`<a class="btnGalleryExtra btn-floating btn-large waves-effect waves-light blue">
                <i class="material-icons">share</i></a>`).click(function () {
        galleryImageInfoHolderDiv.find(".shareUrlHolder").fadeToggle("fast", "linear");
        galleryImageInfoHolderDiv.find(".shareUrl").val(makeShareImageURL(currentImageId, dbParentKey));
    });

    let showMoreButton = $(`<a class="btnGalleryExtra btn-floating btn-large waves-effect waves-light green accent-4">
                <i class="material-icons">view_list</i></a>`).click(function () {
        galleryImageInfoHolderDiv.find(".infoCollection").fadeToggle("fast", "linear");
    });

    if (currentImage.isSharedOnWall) {
        linkButton.addClass("lighten-4");
        linkButton.click(function () {
            let button = this;
            alertify.confirm('Confirm', `Remove picture from wall - <strong>${escape(currentImage.name)}</strong>`, function () {
                handleShareImageOnWall(currentImage, currentImageId, button);
            }, function () {
            });
        })
    }

    buttonsHolder.append(linkButton).append(wallShareButton).append(editButton).append(deleteButton).append(showMoreButton);
    row.append(galleryImageHolderDiv).append(buttonsHolder).append(galleryImageInfoHolderDiv).append(divider);
    return row;
}

function deleteImage(image, imageId, button) {
    let storageRef = firebase.storage().ref();
    let dbRef = firebase.database().ref();
    let uid = firebase.auth().currentUser.uid;

    dbRef.child("/images/" + uid + "/" + imageId).remove().then(removeImageFromDBSuccess).catch(removeImageError);
    dbRef.child("/sharedImagesOnWall/" + imageId).remove();
    storageRef.child('thumbnails/' + uid + "/" + imageId).delete().then(deleteThumbnailSuccess).catch(removeImageError);
    storageRef.child('images/' + uid + "/" + imageId).delete().then(deleteImageSuccess).catch(removeImageError);

    function removeImageFromDBSuccess(image) {
        showSuccessAlert("Successfully deleted image.");
        $(button).parent().parent().fadeOut(333, function () {
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

function getShareImageURLElement(image) {
    return `<div class="shareUrlHolder">
                <p>URL</p>
                <input disabled type="text" class="grey-text shareUrl active">
            </div>`;
}


function handleShareImageOnWall(image, imageId, button) {
    let dbRef = firebase.database().ref();
    let uid = firebase.auth().currentUser.uid;

    if (image.isSharedOnWall) {
        removeImageFromWall(image, imageId, button);
    } else {
        shareImageOnWall(image, imageId, button);
    }

    function shareImageOnWall(image, imageId, button) {
        image.uploaderId = firebase.auth().currentUser.uid;

        dbRef.child("/sharedImagesOnWall/" + imageId).set(image).then(imageShareSuccess).catch(handleImageShareError);
        dbRef.child("/images/" + uid + "/" + imageId).update({isSharedOnWall: 1}).catch(handleImageShareError);

        function imageShareSuccess() {
            image.isSharedOnWall = 1;
            $(button).addClass("lighten-4");
            console.log("here")
            $(button).click(function () {
                let button = this;
                alertify.confirm('Confirm', `Remove picture from wall - <strong>${escape(image.name)}</strong>`, function () {
                    handleShareImageOnWall(image, imageId, button);
                }, function () {
                });
            });

            showSuccessAlert('Image shared to wall.');
        }
    }

    function removeImageFromWall(image, imageId, button) {
        dbRef.child("/sharedImagesOnWall/" + imageId).remove().then(imageRemoveFromWallSuccess).catch(handleImageShareError);
        dbRef.child("/images/" + uid + "/" + imageId).update({isSharedOnWall: 0}).catch(handleImageShareError);

        function imageRemoveFromWallSuccess() {
            image.isSharedOnWall = 0;
            $(button).removeClass("lighten-4");
            $(button).click(function () {
                let button = this;
                alertify.confirm('Confirm', `Share picture to wall - <strong>${escape(image.name)}</strong>`, function () {
                    handleShareImageOnWall(image, imageId, button);
                }, function () {
                });
            });

            showSuccessAlert('Image removed from wall.');
        }
    }

    function handleImageShareError(error) {
        showErrorAlert("Image share error.");
        console.log(error)
    }
}