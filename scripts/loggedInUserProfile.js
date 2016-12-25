function setUserGreeting(user) {
    let dbRef = firebase.database().ref();
    let uid = user.uid;
    dbRef.child("users/" + uid).once('value', getAvatarSuccess);
    function getAvatarSuccess(data) {
        $("#loggedInUserAvatar").attr("src", data.val().avatar);
        $("#loggedInUserUsername").text(data.val().username);
    }
}

