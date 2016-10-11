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
        $("#uploadButton").show();
        alertify.success("Logged In")

    } else {
        $("#uploadButton").hide();
        $("#signOutButton").hide();
        $("#signInLinkButton").show();
    }
});

$('#signOutButton').click(function () {
    firebase.auth().signOut().then(function() {
        window.location.href = "/";
        alertify.success("Logged Out Successfully")
    }, function(error) {
        alertify.success("Error loogging out")
    });

});