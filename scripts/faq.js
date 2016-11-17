var config = {
    apiKey: "AIzaSyCkH7eapxWelLQqYWZel8H2vlaaQ7wGkVU",
    authDomain: "dronemapper-83b1a.firebaseapp.com",
    databaseURL: "https://dronemapper-83b1a.firebaseio.com",
    storageBucket: "dronemapper-83b1a.appspot.com",
    messagingSenderId: "915987875489"
};
firebase.initializeApp(config);
let userId=0;
let auth = firebase.auth();
let dbRef = firebase.database().ref();
let storageRef = firebase.storage().ref();
auth.onAuthStateChanged(function (user) {
    if (user) {
        userId = user.uid;
        $(".signInLinkButton").hide();
        $(".signOutLinkButton").show();
        $(".galleryLinkButton").show();
        firebase.database().ref("users/" + userId).on('value', function (snapshot) {
            $("nav div ul").append(snapshot.val().username);
        });
    } else {
        $(".galleryLinkButton").hide();
        $(".signOutLinkButton").hide();
        $(".signInLinkButton").show();
    }
});