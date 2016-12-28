function registerUser() {
    let auth = firebase.auth();
    let dbRef = firebase.database().ref();

    let firstName = $("#register-firstName").val().trim();
    let lastName = $("#register-lastName").val().trim();
    let username = $("#register-username").val().trim();
    let email = $("#register-email").val().trim();
    let password = $("#register-password").val();
    let passwordConfirm = $("#register-password-confirm").val();
    let avatar = $("#register-avatar").attr("src");
    let drones = [];
    $('#register-drone-select :selected').each(function (i, sel) {
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
        setAdditionalData(user);
    }

    function registerError(error) {
        showErrorAlert(error.message)
        console.log(error)
    }

    function setAdditionalData(user) {
        let userId = user.uid;
        let userData = {
            name: firstName + " " + lastName,
            username: username,
            drones: drones,
            avatar: avatar,
            dateRegistered: getTimeNow(),
            preferences: {
                showGalleryImages: true,
                showRealtimeFlights: true,
                showSavedFlights: true,
                showWallImages: true
            }
        };
        dbRef.child("users/" + userId).set(userData).then(registerDataSuccess).catch(registerDataError);

        function registerDataSuccess(data) {
            $("#registerForm").trigger("reset");
            showSuccessAlert("Register success.");
            showHomeView();
        }

        function registerDataError(error) {
            showErrorAlert(error.message);
            console.log(error);
        }
    }
}

function setAvatar(evt) {
    let resize = new window.resize();
    let file = evt.target.files[0];
    resize.photo(file, 200, 'dataURL', avatarResizeSuccess);
    function avatarResizeSuccess(resizedImage) {
        $("#register-avatar").attr("src", resizedImage);
    }
}