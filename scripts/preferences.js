function handleUserPreferences() {
    let dbRef = firebase.database().ref();
    let userId = firebase.auth().currentUser.uid;
    dbRef.child("users/" + userId + "/preferences").once('value', getUserDataSuccess);
    function getUserDataSuccess(data) {
        data = data.val();
        if (data.showGalleryImages) {
            loadGalleryImagesOnMap();
            checkCB("#gallery-pictures-checkbox");
        } else {
            unCheckCB("#gallery-pictures-checkbox");
        }

        if (data.showWallImages) {
            loadWallImagesOnMap();
            checkCB("#wall-pictures-checkbox")
        } else {
            unCheckCB("#wall-pictures-checkbox")
        }

        if (data.showRealtimeFlights) {
            handleRealtimeFlights();
            checkCB("#realtime-flights-checkbox")
        } else {
            unCheckCB("#realtime-flights-checkbox")
        }

        if (data.showSavedFlights) {
            handleSavedFlights();
            checkCB("#recorded-flights-checkbox");
        } else {
            unCheckCB("#recorded-flights-checkbox")
        }
    }
}

function confirmPreferences() {
    let dbRef = firebase.database().ref();
    let userId = firebase.auth().currentUser.uid;

    let newPreferences = {
        showGalleryImages: $("#gallery-pictures-checkbox").is(":checked"),
        showWallImages: $("#wall-pictures-checkbox").is(":checked"),
        showRealtimeFlights: $("#realtime-flights-checkbox").is(":checked"),
        showSavedFlights: $("#recorded-flights-checkbox").is(":checked")
    };

    dbRef.child("/users/" + userId + "/preferences").update(newPreferences).then(updatePreferencesSuccess).catch(updatePreferencesError);

    function updatePreferencesSuccess() {
        showSuccessAlert("Successfully updated preferences.");
        showHomeView()
    }

    function updatePreferencesError(error) {
        showErrorAlert("Error updating preferences.");
        console.log(error);
    }
}