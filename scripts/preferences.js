function loadUserPreferences() {
    let dbRef = firebase.database().ref();
    let userId = firebase.auth().currentUser.uid;
    dbRef.child("users/" + userId + "/preferences").once('value', getUserDataSuccess);
    function getUserDataSuccess(data) {
        data = data.val();
        console.log(data);
    }
}