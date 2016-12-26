function reauthLoggedInUser() {
    let user = firebase.auth().currentUser;
    let currentPassword = $("#reauth-user-password").val();
    let credentials = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    user.reauthenticate(credentials).then(reauthSuccess).catch(reauthError);

    function reauthSuccess() {
        console.log("Reauth success!");
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
        let userLastName = data.name.split(" ")[1]
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