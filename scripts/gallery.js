//TODO FIX THE ENTIRE FUCKING FILE!!!!!!!!!!!!!!!!!
//Maalee tva e edin grozen,grozen, grozen JS. :/
var config = {
    apiKey: "AIzaSyCkH7eapxWelLQqYWZel8H2vlaaQ7wGkVU",
    authDomain: "dronemapper-83b1a.firebaseapp.com",
    databaseURL: "https://dronemapper-83b1a.firebaseio.com",
    storageBucket: "dronemapper-83b1a.appspot.com",
    messagingSenderId: "915987875489"
};
firebase.initializeApp(config);
let userId=0;
let auth = firebase.auth();
let dbRef = firebase.database().ref();
let storageRef = firebase.storage().ref();
auth.onAuthStateChanged(function (user) {
    if (user) {
        userId = user.uid;
        $(".signInLinkButton").hide();
        $(".signOutLinkButton").show();
        $(".galleryLinkButton").show();
        firebase.database().ref("users/" + userId).on('value', function (snapshot) {
            $("nav div ul").append(snapshot.val().username);
        });
        dbRef.child("images/" + userId).on('child_added',
            function (snapshot) {
                $('.images').prepend(`<p>${snapshot.val().name}</p><img style="border-radius: 2px;" class="materialboxed responsive-img z-depth-1" width="650" src="${snapshot.val().url}"><div class="divider"></div>`)
                $('.materialboxed').materialbox();
            });
    } else {
        $(".galleryLinkButton").hide();
        $(".signOutLinkButton").hide();
        $(".signInLinkButton").show();
    }
});
$('.signOutLinkButton').click(function () {
    firebase.auth().signOut().then(function () {
        window.location.href = "/";
        alertify.success("Logged Out Successfully")
    }, function (error) {
        alertify.success("Error loogging out")
    });
});
let resize = new window.resize();
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
            lat = lat[0].numerator + lat[1].numerator /
                (60 * lat[1].denominator) + lat[2].numerator / (3600 * lat[2].denominator);
            longt = longt[0].numerator + longt[1].numerator /
                (60 * longt[1].denominator) + longt[2].numerator / (3600 * longt[2].denominator);
            alt = alt.numerator / alt.denominator;
            if (maker.substring(0, 3) == "DJI") {
                $(".bars").append(`<div class="${key}"><p>${fileName}</p><div class="progress"><div class="determinate" id="${key}"></div></div><div class="divider"></div></div>`);
                let pictureUploadTask = storageRef.child('images/' + userId + "/" + key).put(file);
                pictureUploadTask.on('state_changed',
                    function (snapshot) {
                        var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        $(`#${key}`).css('width', progress + "%");
                    }, function () {
                        $('#upload-file-info').append("ERROR");
                    }, function () {
                        resize.photo(file, 500, function (thumbnail) {
                            let thumbnailUploadTask = storageRef.child('thumbnails/' + userId + "/" + key).put(thumbnail);
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
                                    dbRef.child("/images/" + userId + "/" + key).set(imageData)
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
});
$(document).ready(function () {
    $('.materialboxed').materialbox();
});

