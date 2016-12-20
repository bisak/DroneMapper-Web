function editImage() {
    let dbRef = firebase.database().ref();
    let uid = firebase.auth().currentUser.uid;
    let key = $("#editImage-id").val().trim();

    let newName = $("#editImage-name").val().trim();
    let newDrone = $("#editImage-drone-select").val();
    let newDescription = $("#editImage-description").val().trim();

    let newData = {
        name: newName,
        droneTaken: newDrone,
        description: newDescription,
        dateEdited: getTimeNow()
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
    $("#editImage-id").val(id);
    $("#editImage-name").val(image.val().name);
    $("#editImage-image").attr("src", image.val().url);
    $("#editImage-description").val(image.val().description).trigger('autoresize');
    $("#editImage-drone-select").val(image.val().droneTaken).material_select();
    $("#editImage-dateTaken").val(image.val().dateTaken);
    $("#editImage-dateEdited").val(image.val().dateEdited);
    $("#editImage-dateUploaded").val(image.val().dateUploaded);

}

