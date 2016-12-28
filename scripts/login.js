function loginUser() {
    let auth = firebase.auth();

    let email = ($("#login-email").val());
    let password = ($("#login-password").val());

    auth.signInWithEmailAndPassword(email, password).then(loginSuccess).catch(loginError);

    function loginSuccess(data) {
        showSuccessAlert("Logged in");
        showHomeView();
        $("#loginForm").trigger("reset");
    }

    function loginError(error) {
        console.log(error);
        showErrorAlert(error.message)
    }
}