function handleUserPreferences() {
    let dbRef = firebase.database().ref();
    let userId = firebase.auth().currentUser.uid;
    dbRef.child("users/" + userId + "/preferences").once('value', getUserDataSuccess);
    function getUserDataSuccess(data) {
        data = data.val();
        applyPreferences(data);
    }

    function applyPreferences(data) {
        if (data.showGalleryImages) {
            loadGalleryImagesOnMap();
            $("#gallery-pictures-checkbox").attr("checked", "checked");
        } else {
            $("#gallery-pictures-checkbox").removeAttr("checked");
        }

        if (data.showWallImages) {
            loadWallImagesOnMap();
            $("#wall-pictures-checkbox").attr("checked", "checked");
        } else {
            $("#wall-pictures-checkbox").removeAttr("checked");
        }

        if (data.showRealtimeFlights) {
            handleRealtimeFlights();
            $("#realtime-flights-checkbox").attr("checked", "checked");
        } else {
            $("#realtime-flights-checkbox").removeAttr("checked");
        }

        if (data.showSavedFlights) {
            handleSavedFlights();
            $("#recorded-flights-checkbox").attr("checked", "checked");
        } else {
            $("#recorded-flights-checkbox").removeAttr("checked");
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
    }

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