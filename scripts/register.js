var config = {
    apiKey: "AIzaSyCkH7eapxWelLQqYWZel8H2vlaaQ7wGkVU",
    authDomain: "dronemapper-83b1a.firebaseapp.com",
    databaseURL: "https://dronemapper-83b1a.firebaseio.com",
    storageBucket: "dronemapper-83b1a.appspot.com",
    messagingSenderId: "915987875489"
};
firebase.initializeApp(config);
let userId = 0;
let auth = firebase.auth();
let dbRef = firebase.database().ref();
let storageRef = firebase.storage().ref();
auth.onAuthStateChanged(function (user) {
    if (user) {
        console.log(user.uid);
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
$('.signOutLinkButton').click(function () {
    firebase.auth().signOut().then(function () {
        window.location.href = "/";
        alertify.success("Logged Out Successfully")
    }, function (error) {
        alertify.success("Error loogging out")
    });
});
$('#registerButton').click(function () {
    let firstName = $("#first_name").val();
    let lastName = $("#last_name").val();
    let username = $("#username").val();
    let email = $("#email").val();
    let password = $("#password").val();
    let passwordConfirm = $("#password_confirm").val();
    let drones = [];
    $('#drone-select :selected').each(function (i, sel) {
        drones.push($(sel).text());
    });
    if (password === passwordConfirm && firstName != "" && lastName != "" && email != "") {
        auth.createUserWithEmailAndPassword(email, password).then(function (user) {
            dbRef.child("users/" + user.uid).set({
                name: firstName + " " + lastName,
                username: username,
                drones: drones
            }).then(function () {
                window.location.href = "/";
            }).catch(function (error) {
                alertify.error(error.message);
            });
        }).catch(function (error) {
            alertify.error(error.message);
        });
    } else {
        alertify.error("Invalid data.");
    }
});

