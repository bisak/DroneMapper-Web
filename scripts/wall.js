function loadWallImages() {
    let dbRef = firebase.database().ref();
    dbRef.child("/sharedImagesOnWall/").once('value', renderWallImages);
    function renderWallImages(imagesData) {
        let images = imagesData.val();
        $('.wall-images').empty();

        for (let image in images) {
            let entryToRender = getWallEntryToRender(images[image], image);
            $('.wall-images').prepend(entryToRender);
        }
    }
}

function getWallEntryToRender(currentImage, imageId) {
    let row = $(`<div class="row"></div>`);
    let galleryImageHolderDiv = $(`<div class="galleryImageHolder col s12 m9 l9"></div>`);
    let galleryImageInfoHolderDiv = $(`<div class="galleryImageInfoHolder col s12 m9 l9"></div>`);
    let imageElement = $(`<img class="responsive-img z-depth-2 gallery-image" src="${currentImage.url}"><br>`).click(function () {
        openImageInShare();
    });
    let imageShareUrl = $(getShareImageURLElement(currentImage));
    let imageInfo = $(getInfoCollectionElement(currentImage));

    galleryImageHolderDiv.append(imageElement);
    galleryImageInfoHolderDiv.append(imageShareUrl).append(imageInfo);

    let divider = $("<div class='row'><div class='col s12 m9 l9'><div class='divider'></div></div></div>");
    let buttonsHolder = $(`<div class="col s12 m3 l2"></div>`);

    let wallShareButton = $(`<a class="btnGalleryExtra btn-floating btn-large waves-effect waves-light blue">
                <i class="material-icons">share</i></a>`).click(function () {
        galleryImageInfoHolderDiv.find(".shareUrlHolder").fadeToggle("fast", "linear");
        galleryImageInfoHolderDiv.find(".shareUrl").val(makeShareImageURL(imageId, currentImage.uploaderId));
    });

    let showMoreButton = $(`<a class="btnGalleryExtra btn-floating btn-large waves-effect waves-light green accent-4">
                <i class="material-icons">view_list</i></a>`).click(function () {
        galleryImageInfoHolderDiv.find(".infoCollection").fadeToggle("fast", "linear");
    });

    buttonsHolder.append(wallShareButton).append(showMoreButton);
    row.append(galleryImageHolderDiv).append(buttonsHolder).append(galleryImageInfoHolderDiv).append(divider);
    return row;

    function openImageInShare() {
        window.location.href = makeShareImageURL(imageId, currentImage.uploaderId);
        let sharedImageId = getParameterByName("sharedImage");
        showSharedImageView(sharedImageId);
    }
}