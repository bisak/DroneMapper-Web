function editImage() {
    let dbRef = firebase.database().ref();
    let uid = firebase.auth().currentUser.uid;
    let key = $("#editImage-id").val().substr(4).trim();

    let newName = $("#editImage-name").val();
    let newLat = $("#editImage-lat").val();
    let newLongt = $("#editImage-lng").val();
    let newAlt = $("#editImage-alt").val();
    let newDrone = $("#editImage-drone-select").val();

    let newData = {
        name: newName,
        lat: newLat,
        longt: newLongt,
        alt: newAlt,
        droneTaken: newDrone
    };

    dbRef.child("/images/" + uid + "/" + key).update(newData).then(editImageSuccess).catch(editImageError);

    function editImageSuccess() {
        showSuccessAlert("Image edit success.");
        showGalleryView();
    }

    function editImageError(error) {
        showErrorAlert("Image edit error.");
        console.log(error);
    }
}

function setupEditImageView(image) {
    $("#editImageForm label").addClass("active");
    let id = image.key;
    $("#editImage-id").val("ID: " + id);
    $("#editImage-name").val(image.val().name);
    $("#editImage-lat").val(image.val().lat);
    $("#editImage-lng").val(image.val().longt);
    $("#editImage-alt").val(image.val().alt);
    $("#editImage-image").attr("src", image.val().url);
    $("#editImage-drone-select").val(image.val().droneTaken).material_select();
}