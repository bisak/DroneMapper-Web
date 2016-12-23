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
    let dbRef = firebase.database().ref();
    let uploaderId = currentImage.uploaderId;
    let width = `col s12 m9 l9`;

    let row = $(`<div class="row"></div>`);
    let wallImageHolderDiv = $(`<div class="galleryImageHolder ${width}"></div>`);
    let wallImageInfoHolderDiv = $(`<div class="galleryImageInfoHolder ${width}"></div>`);
    let imageElement = $(`<img class="responsive-img z-depth-2 gallery-image" src="${currentImage.url}"><br>`).click(function () {
        openImageInShare(imageId, uploaderId);
    });
    let uploaderHolder = $(`<div class="wallUser chip blue darken-2 z-depth-1"></div>`).click(function () {
        console.log("CLICKED USER");
    });

    let divider = $(`<div class='row'><div class='${width}'><div class='divider'></div></div></div>`);

    let buttonsHolder = setButtons();
    setUploaderAvatarAndUsername(uploaderId, uploaderHolder);

    wallImageHolderDiv.append(imageElement);
    wallImageInfoHolderDiv.append(getShareImageURLElement(currentImage)).append(getInfoCollectionElement(currentImage));

    row.append(uploaderHolder).append(wallImageHolderDiv).append(buttonsHolder).append(wallImageInfoHolderDiv).append(divider);

    return row;

    function openImageInShare(imageId, uploaderId) {
        window.location.href = makeShareImageURL(imageId, uploaderId);
        let sharedImageId = getParameterByName("sharedImage");
        showSharedImageView(sharedImageId);
    }

    function setUploaderAvatarAndUsername(uploaderId, holder) {
        dbRef.child("users/" + uploaderId).once('value', getDataSuccess);
        function getDataSuccess(data) {
            data = data.val();
            let uploaderData =
                `<img class="wallAvatarImage" src="${data.avatar || getDefaultAvatar()}">
                 <span class="wallUsernameContainer">${escape(data.username)}</span>`;
            holder.append(uploaderData);
        }
    }

    function setButtons() {
        let buttonsHolder = $(`<div class="col s12 m3 l2"></div>`);

        let wallShareButton = $(`<a class="btnGalleryExtra btn-floating btn-large waves-effect waves-light blue">
                <i class="material-icons">share</i></a>`).click(function () {
            wallImageInfoHolderDiv.find(".shareUrlHolder").fadeToggle("fast", "linear");
            wallImageInfoHolderDiv.find(".shareUrl").val(makeShareImageURL(imageId, currentImage.uploaderId));
        });

        let showMoreButton = $(`<a class="btnGalleryExtra btn-floating btn-large waves-effect waves-light green accent-4">
                <i class="material-icons">view_list</i></a>`).click(function () {
            wallImageInfoHolderDiv.find(".infoCollection").fadeToggle("fast", "linear");
        });
        buttonsHolder.append(wallShareButton).append(showMoreButton);

        return buttonsHolder;
    }
}