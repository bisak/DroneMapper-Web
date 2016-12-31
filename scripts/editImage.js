function editImage() {
    let dbRef = firebase.database().ref();
    let uid = firebase.auth().currentUser.uid;
    let imageId = $("#editImage-id").val().trim();

    let newName = $("#editImage-name").val().trim();
    let newDrone = $("#editImage-drone-select").val() || " - ";
    let newDescription = $("#editImage-description").val().trim();

    let newData = {
        name: newName,
        droneTaken: newDrone,
        description: newDescription,
        dateEdited: getTimeNow()
    };

    dbRef.child("/images/" + uid + "/" + imageId).update(newData).then(editImageSuccess).catch(editImageError);

    dbRef.child("/sharedImagesOnWall/" + imageId).once("value", checkIfExists);
    function checkIfExists(data) {
        if (data.val()) {
            dbRef.child("/sharedImagesOnWall/" + imageId).update(newData);
        }
    }

    function editImageSuccess() {
        showSuccessAlert("Image edit success.");
        showGalleryView();
    }

    function editImageError(error) {
        showErrorAlert("Image edit error.");
        console.log(error);
    }
}

function setupEditImageView(image, id) {
    $("#editImageForm label").addClass("active");
    $("#editImage-id").val(id);
    $("#editImage-name").val(image.name);
    $("#editImage-image").attr("src", image.url);
    $("#editImage-description").val(image.description).trigger('autoresize');
    $("#editImage-drone-select").val(image.droneTaken).material_select();
    $("#editImage-dateTaken").val(image.dateTaken);
    $("#editImage-dateEdited").val(image.dateEdited);
    $("#editImage-dateUploaded").val(image.dateUploaded);
    showEditImageView();
}

