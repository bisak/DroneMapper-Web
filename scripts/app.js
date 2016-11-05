var config = {
    apiKey: "AIzaSyCkH7eapxWelLQqYWZel8H2vlaaQ7wGkVU",
    authDomain: "dronemapper-83b1a.firebaseapp.com",
    databaseURL: "https://dronemapper-83b1a.firebaseio.com",
    storageBucket: "dronemapper-83b1a.appspot.com",
    messagingSenderId: "915987875489"
};
firebase.initializeApp(config);
let auth = firebase.auth();
let dbRef = firebase.database().ref();
let storageRef = firebase.storage().ref();

auth.onAuthStateChanged(function (user) {
    if (user) {
        $(".signInLinkButton").hide();
        $(".signOutLinkButton").show();
        $(".galleryLinkButton").show();
        firebase.database().ref("users/" + user.uid).on('value', function (snapshot) {
            $("nav div ul").append(snapshot.val().username);
        });
    } else {
        $(".galleryLinkButton").hide();
        $(".signOutLinkButton").hide();
        $(".signInLinkButton").show();
    }
});
$('.signOutLinkButton').click(function () {
    firebase.auth().signOut().then(function () {
        window.location.href = "/";
        alertify.success("Logged Out Successfully")
    }, function (error) {
        alertify.success("Error loogging out")
    });
});