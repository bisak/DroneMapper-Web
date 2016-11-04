let storageRef = firebase.storage().ref();
let dbRef = firebase.database().ref();
let resize = new window.resize();
resize.init();

$('.uploaded-images').css("min-height", Math.round($(window).height() / 2)+"px");

$("#uploadSlector").change(function (evt) {
    let files = evt.target.files;

    for (let i = 0; i < files.length; i++) {
        let file = evt.target.files[i];
        let src = URL.createObjectURL(file);
        let fileName = file.name.split(".")[0];
        let fileExt = file.name.split(".")[1];

        EXIF.getData(file, function () {
            let key = dbRef.push().key;

            let lat = EXIF.getTag(file, 'GPSLatitude');
            let longt = EXIF.getTag(file, 'GPSLongitude');
            let alt = EXIF.getTag(file, 'GPSAltitude');
            let maker = EXIF.getTag(file, 'Make') || "INVALID";
            if (maker.substring(0, 3) == "DJI") {

                lat = lat[0].numerator + lat[1].numerator /
                    (60 * lat[1].denominator) + lat[2].numerator / (3600 * lat[2].denominator);
                longt = longt[0].numerator + longt[1].numerator /
                    (60 * longt[1].denominator) + longt[2].numerator / (3600 * longt[2].denominator);
                alt = alt.numerator / alt.denominator;

                $(".bars").append(`<div class="${key}"><p>${fileName}</p><div class="progress"><div class="determinate" id="${key}"></div></div><div class="divider"></div></div>`);

                let pictureUploadTask = storageRef.child('images/' + key).put(file);
                pictureUploadTask.on('state_changed',
                    function (snapshot) {
                        var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        $(`#${key}`).css('width', progress + "%");
                    }, function () {
                        $('#upload-file-info').append("ERROR");
                    }, function () {

                        resize.photo(file, 500, function (thumbnail) {

                            let thumbnailUploadTask = storageRef.child('thumbnails/' + key).put(thumbnail);
                            thumbnailUploadTask.on('state_changed',
                                function (snapshot) {
                                    var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                                }, function () {
                                    $('#upload-file-info').append("ERROR");
                                }, function () {
                                    let url = pictureUploadTask.snapshot.downloadURL;
                                    let path = pictureUploadTask.snapshot.metadata.fullPath;
                                    let thumbnailUrl = thumbnailUploadTask.snapshot.downloadURL;
                                    let thumbnailPath = thumbnailUploadTask.snapshot.metadata.fullPath;

                                    let imageData = {};
                                    imageData.name = fileName;
                                    imageData.alt = alt;
                                    imageData.lat = lat;
                                    imageData.longt = longt;
                                    imageData.url = url;
                                    //imageData.path = path;
                                    imageData.thumbnailUrl = thumbnailUrl;
                                    //imageData.thumbnailPath = thumbnailPath;

                                    dbRef.child("/images/" + key).set(imageData)
                                        .then(function () {
                                            alertify.success('Sync success!')
                                            $(`.${key}`).hide();
                                            $('.uploaded-images').append(`<p>${fileName}</p><img style="border-radius: 2px;" class="materialboxed responsive-img z-depth-2" width="650" src="${src}"><div class="divider"></div>`);
                                            $('.materialboxed').materialbox();
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
});

//TODO FIX THE ENTIRE FUCKING FILE!!!!!!!!!!!!!!!!!