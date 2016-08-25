var storageRef = firebase.storage().ref();
var dbRef = firebase.database().ref();

var resize = new window.resize();
resize.init();


$("#uploadSlector").change(function (evt) {
    let files = evt.target.files;

    for (var i = 0; i < files.length; i++) {
        let file = evt.target.files[i];

        let pictureId = guid();
        let fileNumber = i + 1;
        $('#upload-file-info').append(" " + fileNumber + "." + file.name.split(".")[0]);
        let fileName = file.name.split(".")[0];
        let fileExt = file.name.split(".")[1];

        EXIF.getData(file, function () {
            let lat = EXIF.getTag(this, 'GPSLatitude');
            let long = EXIF.getTag(this, 'GPSLongitude');
            let alt = EXIF.getTag(this, 'GPSAltitude');

            lat = lat[0].numerator + lat[1].numerator /
                (60 * lat[1].denominator) + lat[2].numerator / (3600 * lat[2].denominator);
            long = long[0].numerator + long[1].numerator /
                (60 * long[1].denominator) + long[2].numerator / (3600 * long[2].denominator);
            alt = alt.numerator / alt.denominator;


            let pictureUploadTask = storageRef.child('images/' + fileName + "-" + pictureId).put(file);

            pictureUploadTask.on('state_changed',
                function (snapshot) {
                    var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    $("#progressBarContainer").css("visibility", "visible");
                    $("#uploadProgressBar").css("width", progress + "%");
                    $("#uploadProgressBar").html(progress + "%");
                }, function () {
                    $('#upload-file-info').append("ERROR");
                }, function () {
                    resize.photo(file, 150, 'file', function (thumbnail) {

                        let thumbnailUploadTask = storageRef.child('thumbnails/' + fileName + "-" + pictureId).put(thumbnail);

                        thumbnailUploadTask.on('state_changed',
                            function (snapshot) {
                                var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                                $("#progressBarContainer").css("visibility", "visible");
                                $("#uploadProgressBar").css("width", 100 + "%");
                                $("#uploadProgressBar").html(100 + "%");
                            }, function () {
                                $('#upload-file-info').append("ERROR");
                            }, function () {
                                let url = pictureUploadTask.snapshot.downloadURL;
                                let path = pictureUploadTask.snapshot.metadata.fullPath;
                                let thumbnailUrl = thumbnailUploadTask.snapshot.downloadURL;
                                let thumbnailPath = thumbnailUploadTask.snapshot.metadata.fullPath;
                                let imageData = {};
                                imageData.name = file.name;
                                imageData.alt = alt;
                                imageData.lat = lat;
                                imageData.long = long;
                                imageData.url = url;
                                imageData.path = path;
                                imageData.thumbnailUrl = thumbnailUrl;
                                imageData.thumbnailPath = thumbnailPath;

                                dbRef.child("images/" + fileName + "-" + pictureId).set(imageData);
                                $("#progressBarContainer").css("visibility", "hidden");
                            });
                    });

                });
        });

    }
});

firebase.database().ref().child("images/").on('child_added',
    function (snapshot) {
        $('#links').append("<a href=" + snapshot.val().url + " title=" + snapshot.val().name + ">" +
            "<img src=" + snapshot.val().thumbnailUrl + ">" +
            "</a>");
    });

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}