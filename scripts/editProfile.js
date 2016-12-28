function reauthLoggedInUser() {
    let user = firebase.auth().currentUser;
    let currentPassword = $("#reauth-user-password").val();
    let credentials = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    user.reauthenticate(credentials).then(reauthSuccess).catch(reauthError);
    function reauthSuccess() {
        $("#reauth-user-password").val("");
        initEditProfileView();
    }

    function reauthError(error) {
        showErrorAlert("Authentication error. <br>" + error.code);
        console.log(error)
    }
}

function initEditProfileView() {
    let dbRef = firebase.database().ref();
    let userId = firebase.auth().currentUser.uid;
    let user = firebase.auth().currentUser;
    dbRef.child("users/" + userId).once('value', getDataSuccess);
    function getDataSuccess(data) {
        data = data.val();
        let userFirstName = data.name.split(" ")[0];
        let userLastName = data.name.split(" ")[1];
        $("#editProfileForm label").addClass("active");
        $("#edit-user-avatar").attr("src", data.avatar);
        $("#edit-user-email").val(user.email);
        $("#edit-user-firstName").val(userFirstName);
        $("#edit-user-lastName").val(userLastName);
        $("#edit-user-username").val(data.username);
        $("#edit-user-drone-select").val(data.drones).material_select()
        showEditProfileView();
    }
}

function editUserProfile() {
    let user = firebase.auth().currentUser;
    let userId = firebase.auth().currentUser.uid;
    let dbRef = firebase.database().ref();

    let newEmail = $("#edit-user-email").val().trim();
    let newPassword = $("#edit-user-password").val();
    let newPasswordConfirm = $("#edit-user-password-confirm").val();
    let newUsername = $("#edit-user-username").val().trim();
    let newFirstName = $("#edit-user-firstName").val().trim();
    let newLastName = $("#edit-user-lastName").val().trim();
    let newFullName = newFirstName + " " + newLastName;
    let newAvatar = $("#edit-user-avatar").attr("src");
    let newDrones = [];
    $('#edit-user-drone-select :selected').each(function (i, sel) {
        newDrones.push($(sel).text());
    });

    if(newDrones.length == 0) newDrones = ["No Drones"];

    if (user.email != newEmail) {
        user.updateEmail(newEmail).then(emailUpdateSuccess).catch(emailUpdateError);
        function emailUpdateSuccess() {
            showSuccessAlert("Email Updated Successfully.");
        }

        function emailUpdateError(error) {
            showErrorAlert("Email Update Error.");
            console.log(error);
        }
    }

    if (newPassword.length && newPasswordConfirm.length) {
        if (newPassword === newPasswordConfirm) {
            user.updatePassword(newPassword).then(passwordUpdateSuccess).catch(passwordUpdateError);
            function passwordUpdateSuccess() {
                showSuccessAlert("Password Updated Successfully.");
            }

            function passwordUpdateError(error) {
                showErrorAlert("Password Update Error.");
                console.log(error);
            }
        } else {
            showErrorAlert("Passwords didn't match.")
        }
    }

    let newUserData = {
        name: newFullName,
        username: newUsername,
        drones: newDrones,
        avatar: newAvatar,
        dateEdited: getTimeNow()
    };

    dbRef.child("users/" + userId).update(newUserData).then(registerDataSuccess).catch(registerDataError);
    function registerDataSuccess(data) {
        showSuccessAlert("Data Edit Success.")
        setUserGreeting();
    }

    function registerDataError(error) {
        showErrorAlert(error.message);
        console.log(error);
    }
}