function loadWallImages() {
    let dbRef = firebase.database().ref();
    let lastKnownWallImageKey = "";
    $(".wall-images").empty()

    loadNextWallImages();

    $(window).scroll(handleWallScrolling);

    function handleWallScrolling() {
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            loadNextWallImages()
        }
    }

    function loadNextWallImages() {
        dbRef.child("/sharedImagesOnWall/").orderByKey().startAt(lastKnownWallImageKey).limitToFirst(5).once('value', renderWallImages);
        function renderWallImages(imagesData) {
            let images = imagesData.val();

            for (let image in images) {
                if (image != lastKnownWallImageKey) {
                    let entryToRender = getWallEntryToRender(images[image], image);
                    lastKnownWallImageKey = image;
                    $('.wall-images').append(entryToRender);
                }
            }
        }
    }

}

function getWallEntryToRender(currentImage, imageId) {
    let dbRef = firebase.database().ref();
    let uploaderId = currentImage.uploaderId;
    let width = `col s12 m9 l9`;

    let row = $(`<div class="row"></div>`);
    let wallImageHolderDiv = $(`<div class="galleryImageHolder ${width}"></div>`);
    let wallImageInfoHolderDiv = $(`<div class="galleryImageInfoHolder ${width}"></div>`);
    let imageElement = $(`<img class="responsive-img z-depth-2 gallery-image" src="${currentImage.url}"><br>`).click(function () {
        openImageInShare(imageId, uploaderId);
    });
    let uploaderHolder = $(`<div class="wallUser chip blue darken-3 z-depth-1"></div>`).click(function () {
        loadUserProfile(uploaderId);
    });

    let divider = $(`<div class='row'><div class='${width}'><div class='divider'></div></div></div>`);

    let buttonsHolder = setButtons();
    setUploaderAvatarAndUsername(uploaderId, uploaderHolder);

    wallImageHolderDiv.append(imageElement);
    wallImageInfoHolderDiv.append(getShareImageURLElement(currentImage)).append(getInfoCollectionElement(currentImage));

    row.append(uploaderHolder).append(wallImageHolderDiv).append(buttonsHolder).append(wallImageInfoHolderDiv).append(divider);

    return row;

    function setUploaderAvatarAndUsername(uploaderId, holder) {
        dbRef.child("users/" + uploaderId).once('value', getDataSuccess);
        function getDataSuccess(data) {
            data = data.val();
            let uploaderData =
                `<img class="wallAvatarImage" src="${data.avatar || getDefaultAvatar()}">
                 <span class="wallUsernameContainer white-text">${escape(data.username)}</span>`;
            holder.append(uploaderData);
        }
    }

    function setButtons() {
        let buttonsHolder = $(`<div class="col s12 m3 l2"></div>`);

        let wallShareButton = $(`<a class="btnGalleryExtra btn-floating waves-effect waves-light blue">
                <i class="material-icons">share</i></a>`).click(function () {
            wallImageInfoHolderDiv.find(".shareUrlHolder").fadeToggle("fast", "linear");
            wallImageInfoHolderDiv.find(".shareUrl").val(makeShareImageURL(imageId, uploaderId));
        });

        let showMoreButton = $(`<a class="btnGalleryExtra btn-floating waves-effect waves-light green accent-4">
                <i class="material-icons">view_list</i></a>`).click(function () {
            wallImageInfoHolderDiv.find(".infoCollection").fadeToggle("fast", "linear");
        });
        buttonsHolder.append(wallShareButton).append(showMoreButton);

        return buttonsHolder;
    }
}