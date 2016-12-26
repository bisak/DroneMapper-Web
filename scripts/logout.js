function logoutUser() {
    let auth = firebase.auth();

    auth.signOut().then(logoutSuccess).catch(logoutError);

    function logoutSuccess () {
        showSuccessAlert("Logout success");
        $("input").val("");
        isAppInitialized = false;
    }

    function logoutError(error) {
        showErrorAlert("Logout error");
    }
}