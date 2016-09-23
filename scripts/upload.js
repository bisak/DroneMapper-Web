let storageRef = firebase.storage().ref();
let dbRef = firebase.database().ref();

let resize = new window.resize();
resize.init();

$("#uploadSlector").change(function (evt) {
    let files = evt.target.files;

    for (let i = 0; i < files.length; i++) {
        let file = evt.target.files[i];

        let pictureId = UUID();
        let fileNumber = i + 1;
        let fileName = file.name.split(".")[0];
        let fileExt = file.name.split(".")[1];
        $('#upload-file-info').append(" " + fileNumber + "." + fileName);


        EXIF.getData(file, function () {
            let lat = EXIF.getTag(this, 'GPSLatitude');
            let longt = EXIF.getTag(this, 'GPSLongitude');
            let alt = EXIF.getTag(this, 'GPSAltitude');

            lat = lat[0].numerator + lat[1].numerator /
                (60 * lat[1].denominator) + lat[2].numerator / (3600 * lat[2].denominator);
            longt = longt[0].numerator + longt[1].numerator /
                (60 * longt[1].denominator) + longt[2].numerator / (3600 * longt[2].denominator);
            alt = alt.numerator / alt.denominator;

            let pictureUploadTask = storageRef.child('images/' + fileName + "-" + pictureId).put(file);

            pictureUploadTask.on('state_changed',
                function (snapshot) {
                    var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    $("#progressBarContainer").css("visibility", "visible");
                    $("#uploadProgressBar").css("width", progress + "%").html(progress + "%");
                }, function () {
                    $('#upload-file-info').append("ERROR");
                }, function () {
                    resize.photo(file, 500, function (thumbnail) {

                        let thumbnailUploadTask = storageRef.child('thumbnails/' + fileName + "-" + pictureId).put(thumbnail);

                        thumbnailUploadTask.on('state_changed',
                            function (snapshot) {
                                var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                                $("#progressBarContainer").css("visibility", "visible");
                                $("#uploadProgressBar").css("width", progress + "%").html(progress + "%");
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

                                dbRef.child("/images/").push().set(imageData);

                                $("#progressBarContainer").css("visibility", "hidden");
                                $('#upload-file-info').css("display", "none");
                            });
                    });

                });
        });

    }
});


dbRef.child("images/").on('child_added',
    function (snapshot) {
        $('#links').append("<a href=" + snapshot.val().url + " title=" + snapshot.val().name + ">" +
            "<img style='width: 150px; height: 84px; margin: 1px; border-radius: 3px; ' src=" + snapshot.val().thumbnailUrl + ">" +
            "</a>");
    });

function UUID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

$('#links').click(function (event) {
    event = event || window.event;
    var target = event.target || event.srcElement,
        link = target.src ? target.parentNode : target,
        options = {index: link, event: event},
        links = this.getElementsByTagName('a');
    blueimp.Gallery(links, options);
});