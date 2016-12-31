function loadGalleryImages() {
    let dbRef = firebase.database().ref();
    let uid = firebase.auth().currentUser.uid;
    let lastKnownGalleryImageKey = "";
    $('.gallery-images').empty();

    loadNextGalleryImages();

    $(window).scroll(handleGalleryScrolling);

    function handleGalleryScrolling() {
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            loadNextGalleryImages()
        }
    }

    function loadNextGalleryImages() {
        dbRef.child("images/" + uid).orderByKey().startAt(lastKnownGalleryImageKey).limitToFirst(5).once('value', renderImages);
        function renderImages(imagesData) {
            let uploaderId = imagesData.key;
            let images = imagesData.val();
            for (let image in images) {
                if (image != lastKnownGalleryImageKey) {
                    $(`.noPhotos`).hide();
                    let entryToRender = getGalleryEntryToRender(images[image], image, uploaderId);
                    lastKnownGalleryImageKey = image;
                    $('.gallery-images').append(entryToRender);
                    $('.materialboxed').materialbox();
                }
            }
        }
    }
}

function getGalleryEntryToRender(currentImage, currentImageId, uploaderId) {
    let row = $(`<div class="row"></div>`);
    let galleryImageHolderDiv = $(`<div class="galleryImageHolder col s12 m9 l9"></div>`);
    let galleryImageInfoHolderDiv = $(`<div class="galleryImageInfoHolder col s12 m9 l9"></div>`);
    let imageElement = $(`<img class="materialboxed responsive-img z-depth-2 gallery-image" src="${currentImage.url}">`);
    let imageShareUrl = $(getShareImageURLElement(currentImage));
    let imageInfo = $(getInfoCollectionElement(currentImage));

    galleryImageHolderDiv.append(imageElement);
    galleryImageInfoHolderDiv.append(imageShareUrl).append(imageInfo);

    let divider = $("<div class='row'><div class='col s12 m9 l9'><div class='divider'></div></div></div>");
    let buttonsHolder = $(`<div class="galleryButtonsHolder col s12 m2 l1"></div>`);

    let deleteButton =
        $(`<a class="btnGalleryExtra btn-floating waves-effect waves-light red">
                <i class="material-icons">delete</i></a>`).click(function () {
            let button = this;
            alertify.confirm('Confirm', `Delete picture - <strong>${escape(currentImage.name)}</strong>`, function () {
                deleteImage(currentImage, currentImageId, button);
            }, function () {
            });
        });

    let editButton = $(`<a href="#" class="btnGalleryExtra btn-floating waves-effect waves-light orange">
                <i class="material-icons">edit</i></a>`).click(function () {
        setupEditImageView(currentImage, currentImageId);
    });

    let linkButton = $(`<a class="btnGalleryExtra btn-floating waves-effect waves-light blue">
                <i class="material-icons">web</i></a>`).click(function () {
        let button = this;
        alertify.confirm('Confirm', `Share picture to wall - <strong>${escape(currentImage.name)}</strong>`, function () {
            handleShareImageOnWall(currentImage, currentImageId, button);
        }, function () {
        });
    });

    let wallShareButton = $(`<a class="btnGalleryExtra btn-floating waves-effect waves-light blue">
                <i class="material-icons">share</i></a>`).click(function () {
        galleryImageInfoHolderDiv.find(".shareUrlHolder").fadeToggle("fast", "linear");
        galleryImageInfoHolderDiv.find(".shareUrl").val(makeShareImageURL(currentImageId, uploaderId));
    });

    let showMoreButton = $(`<a class="btnGalleryExtra btn-floating waves-effect waves-light green accent-4">
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

    let removeImagePromise = dbRef.child("/images/" + uid + "/" + imageId).remove();
    let removeThumbnailPromise = dbRef.child("/sharedImagesOnWall/" + imageId).remove();
    let removeImageStoragePromise = storageRef.child('images/' + uid + "/" + imageId).delete();
    let removeThumbnailStoragePromise = storageRef.child('thumbnails/' + uid + "/" + imageId).delete();

    Promise.all([removeImagePromise, removeThumbnailPromise, removeImageStoragePromise, removeThumbnailStoragePromise])
        .then(removeImageFromDBSuccess).catch(removeImageError);

    function removeImageFromDBSuccess() {
        showSuccessAlert("Successfully deleted image.");
        $(button).parent().parent().fadeOut(333, function () {
            $(this).remove();
        });
    }

    function removeImageError(error) {
        console.log(error);
        showErrorAlert("Error deleting image.")
    }
}

function handleShareImageOnWall(image, imageId, button) {
    let dbRef = firebase.database().ref();
    let userId = firebase.auth().currentUser.uid;

    if (image.isSharedOnWall) {
        removeImageFromWall(image, imageId, button);
    } else {
        shareImageOnWall(image, imageId, button);
    }

    function shareImageOnWall(image, imageId, button) {
        image.uploaderId = firebase.auth().currentUser.uid;
        image.uploaderUsername = sessionStorage.getItem("currentUserUsername");

        let sharedOnWall = dbRef.child("/sharedImagesOnWall/" + imageId).set(image);
        let updatedInDir = dbRef.child("/images/" + userId + "/" + imageId).update({isSharedOnWall: 1});

        Promise.all([sharedOnWall, updatedInDir]).then(imageShareSuccess).catch(handleImageShareError);

        function imageShareSuccess() {
            image.isSharedOnWall = 1;
            $(button).addClass("lighten-4");
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
        let removedFromWall = dbRef.child("/sharedImagesOnWall/" + imageId).remove();
        let updatedInDir = dbRef.child("/images/" + userId + "/" + imageId).update({isSharedOnWall: 0});

        Promise.all([removedFromWall, updatedInDir]).then(imageRemoveFromWallSuccess).catch(handleImageShareError)

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