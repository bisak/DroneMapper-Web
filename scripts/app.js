/**
 * Created by Biser Atanasov on 10-Aug-16.
 */
var config = {
    apiKey: "AIzaSyCkH7eapxWelLQqYWZel8H2vlaaQ7wGkVU",
    authDomain: "dronemapper-83b1a.firebaseapp.com",
    databaseURL: "https://dronemapper-83b1a.firebaseio.com",
    storageBucket: "dronemapper-83b1a.appspot.com",
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        let url = window.location.href;
        if (url.includes("/signin.html")) {
            window.location.href = "/";
        }
        $("#signInLinkButton").hide();
        $("#signOutButton").show();
    } else {
        $("#signOutButton").hide();
        $("#signInLinkButton").show();
    }
});

$('#signOutButton').click(function () {
    firebase.auth().signOut();
    alertify.success("Logged Out")
});