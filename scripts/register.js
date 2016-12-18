function registerUser() {

    let auth = firebase.auth();
    let dbRef = firebase.database().ref();

    let firstName = $("#register-firstName").val().trim();
    let lastName = $("#register-lastName").val().trim();
    let username = $("#register-username").val().trim();
    let email = $("#register-email").val().trim();
    let password = $("#register-password").val();
    let passwordConfirm = $("#register-password-confirm").val();
    let drones = [];
    $('#drone-select :selected').each(function (i, sel) {
        drones.push($(sel).text());
    });

    if (password === passwordConfirm && firstName != "" && lastName != "" && email != "") {
        auth.createUserWithEmailAndPassword(email, password)
            .then(registerSuccess)
            .catch(registerError);
    } else {
        showErrorAlert("Invalid data.");
    }

    function registerSuccess(user) {
        dbRef.child("users/" + user.uid).set({
            name: firstName + " " + lastName,
            username: username,
            drones: drones
        }).then(registerDataSuccess).catch(registerDataError);

        function registerDataSuccess(data) {
            $("#registerForm").trigger("reset")
            showSuccessAlert("Register success.")
        }

        function registerDataError(error) {
            showErrorAlert(error.message);
            console.log(error);
        }
    }

    function registerError(error) {
        showErrorAlert(error.message)
        console.log(error)
    }
}
