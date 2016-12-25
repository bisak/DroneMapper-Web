function loadUserProfile(userId) {
    let dbRef = firebase.database().ref();
    loadUserProfileInfo();
    loadUserProfileImages();


    function loadUserProfileInfo() {
        dbRef.child("users/" + userId).once("value", loadUserProfileSuccess);
        function loadUserProfileSuccess(data) {
            data = data.val();
            let avatar = data.avatar;
            let name = data.name;
            let username = data.username;
            let drones = data.drones.join(', ');
            $(".userProfileAvatar").attr("src", avatar || getDefaultAvatar());
            $(".userProfileUsername").text(`${name} (${username})`);
            $(".userProfileDrones").text(drones);
            $("#userProfileSharedPhotosText").text("Shared photos by " + username);
        }
    }

    function loadUserProfileImages() {
        $(".user-shared-images").empty();
        dbRef.child("images/" + userId).orderByChild("isSharedOnWall").equalTo(1).once('value', renderImages);
        function renderImages(imagesData) {
            let images = imagesData.val();
            let uploaderId = imagesData.key;
            for (let image in images) {
                let entryToRender = getUserSharedImageEntryToRender(images[image], image, uploaderId);
                $('.user-shared-images').append(entryToRender);
                $('.materialboxed').materialbox();
            }
        }

        function getUserSharedImageEntryToRender(currentImage, imageId, uploaderId) {
            let width = `col s11 m9 l9`;

            let row = $(`<div class="row"></div>`);
            let wallImageHolderDiv = $(`<div class="galleryImageHolder ${width}"></div>`);
            let wallImageInfoHolderDiv = $(`<div class="galleryImageInfoHolder ${width}"></div>`);
            let imageElement = $(`<img class="responsive-img z-depth-2 gallery-image" src="${currentImage.url}"><br>`).click(function () {
                openImageInShare(imageId, uploaderId);
            });

            let buttonsHolder = setButtons();

            wallImageHolderDiv.append(imageElement);
            wallImageInfoHolderDiv.append(getShareImageURLElement(currentImage)).append(getInfoCollectionElement(currentImage));

            row.append(wallImageHolderDiv).append(buttonsHolder).append(wallImageInfoHolderDiv);
            return row;

            function openImageInShare(imageId, uploaderId) {
                window.location.href = makeShareImageURL(imageId, uploaderId);
                let sharedImageId = getParameterByName("sharedImage");
                showSharedImageView(sharedImageId);
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

    }
}