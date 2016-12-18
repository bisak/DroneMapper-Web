function uploadImages(evt) {
    let dbRef = firebase.database().ref();
    let storageRef = firebase.storage().ref();
    let uid = firebase.auth().currentUser.uid;

    let files = evt.target.files;
    for (let i = 0; i < files.length; i++) {
        let file = evt.target.files[i];
        getMetadata(file)
    }

    function getMetadata(image) {
        EXIF.getData(image, function () {
            let lat = EXIF.getTag(image, 'GPSLatitude');
            let lng = EXIF.getTag(image, 'GPSLongitude');
            let alt = EXIF.getTag(image, 'GPSAltitude');
            let maker = EXIF.getTag(image, 'Make') || "INVALID";

            let metadata = {
                lat: getRealLatLng(lat),
                longt: getRealLatLng(lng),
                alt: alt.numerator / alt.denominator,
                name: image.name.split(".")[0]
            };

            if (maker.substring(0, 3) == "DJI") {
                compressImage(image, metadata)
            } else {
                showErrorAlert('Only DJI Drone pictures allowed');
            }
        });
    }

    function compressImage(image, metadata) {
        let resize = new window.resize();
        resize.photo(image, 2500, 'file', imageCompressed);
        function imageCompressed(compressedImage) {
            resize.photo(image, 500, 'file', thumbnailCompressed);
            function thumbnailCompressed(thumbnail) {
                uploadImage(compressedImage, thumbnail, metadata);
            }
        }
    }

    function uploadImage(compressedImage, thumbnail, metadata) {
        let key = dbRef.push().key;

        let compressedImageUploadTask = storageRef.child('images/' + uid + "/" + key).put(compressedImage);
        compressedImageUploadTask.on('state_changed', pictureUploadProgress, pictureUploadError, pictureUploadSuccess);

        function pictureUploadProgress(snapshot) {
            if ($(`.${key}`).length == 0) {
                $(".bars").append(`<div class="${key}"><p>${metadata.name}</p><div class="progress"><div class="determinate" id="${key}"></div></div><div class="divider"></div></div>`);
            }
            let progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            $(`#${key}`).css('width', progress + "%");
        }

        function pictureUploadError(error) {
            showErrorAlert("Image Upload Error.");
            console.log(error)
        }

        function pictureUploadSuccess() {
            let thumbnailUploadTask = storageRef.child('thumbnails/' + uid + "/" + key).put(thumbnail);
            thumbnailUploadTask.on('state_changed', thumbnailUploadProgress, thumbnailUploadError, thumbnailUploadSuccess);

            function thumbnailUploadProgress(snapshot) {
                let thumbnailProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            }

            function thumbnailUploadError(error) {
                showErrorAlert("Thumbnail Upload Error.");
                console.log(error)
            }

            function thumbnailUploadSuccess() {
                metadata.url = compressedImageUploadTask.snapshot.downloadURL;
                metadata.thumbnailUrl = thumbnailUploadTask.snapshot.downloadURL;
                uploadMetadata(metadata);
            }

            function uploadMetadata(metadata) {
                dbRef.child("/images/" + uid + "/" + key).set(metadata).then(writeMetadataSuccess).catch(writeMetadataError);

                function writeMetadataSuccess() {
                    showSuccessAlert('Image uploaded successfully');
                    $(`.${key}`).remove();
                }

                function writeMetadataError(error) {
                    showErrorAlert("Image upload error")
                }
            }
        }
    }
}