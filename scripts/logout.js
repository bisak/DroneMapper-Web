function logoutUser() {
    let auth = firebase.auth();

    auth.signOut().then(logoutSuccess).catch(logoutError);

    function logoutSuccess () {
        showSuccessAlert("Logout success");
        sessionStorage.removeItem("currentUserUsername");
        showHomeView();
    }

    function logoutError(error) {
        showErrorAlert("Logout error");
    }
}