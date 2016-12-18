function uploadImages (evt) {
    let resize = new window.resize();
    let dbRef = firebase.database().ref();
    let storageRef = firebase.storage().ref();
    let uid = firebase.auth().currentUser.uid;

    let files = evt.target.files;
    for (let i = 0; i < files.length; i++) {
        let file = evt.target.files[i];
        uploadImage(file)


        EXIF.getData(file, function () {
            let key = dbRef.push().key;
            let lat = EXIF.getTag(file, 'GPSLatitude');
            let longt = EXIF.getTag(file, 'GPSLongitude');
            let alt = EXIF.getTag(file, 'GPSAltitude');
            let maker = EXIF.getTag(file, 'Make') || "INVALID";
            lat = lat[0].numerator + lat[1].numerator /
                (60 * lat[1].denominator) + lat[2].numerator / (3600 * lat[2].denominator);
            longt = longt[0].numerator + longt[1].numerator /
                (60 * longt[1].denominator) + longt[2].numerator / (3600 * longt[2].denominator);
            alt = alt.numerator / alt.denominator;
            if (maker.substring(0, 3) == "DJI") {
                $(".bars").append(`<div class="${key}"><p>${fileName}</p><div class="progress"><div class="determinate" id="${key}"></div></div><div class="divider"></div></div>`);
                let pictureUploadTask = storageRef.child('images/' + uid + "/" + key).put(file);
                pictureUploadTask.on('state_changed',
                    function (snapshot) {
                        var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        $(`#${key}`).css('width', progress + "%");
                    }, function () {
                        $('#upload-file-info').append("ERROR");
                    }, function () {
                        resize.photo(file, 500, function (thumbnail) {
                            let thumbnailUploadTask = storageRef.child('thumbnails/' + uid + "/" + key).put(thumbnail);
                            thumbnailUploadTask.on('state_changed',
                                function (snapshot) {
                                    var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                                }, function () {
                                    $('#upload-file-info').append("ERROR");
                                }, function () {
                                    let imageData = {};
                                    imageData.name = fileName;
                                    imageData.alt = alt;
                                    imageData.lat = lat;
                                    imageData.longt = longt;
                                    imageData.url = pictureUploadTask.snapshot.downloadURL;
                                    imageData.thumbnailUrl = thumbnailUploadTask.snapshot.downloadURL;
                                    dbRef.child("/images/" + uid + "/" + key).set(imageData)
                                        .then(function () {
                                            alertify.success('Sync success!');
                                            $(`.${key}`).remove();
                                        })
                                        .catch(function (error) {
                                            alertify.error('Synchronization failed');
                                        });
                                });
                        });

                    });
            } else {
                alertify.error('Only DJI Drone pictures allowed');
            }
        });
    }

    function uploadImage(image) {
        let fileName = image.name.split(".")[0];
        let fileExt = image.name.split(".")[1];

        /*TODO*/
    }
}