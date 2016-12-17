$(document).ready(function () {
    /*Initialize Materialize framework responsiveness*/
    $('.button-collapse').sideNav();
    $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false, // Does not change width of dropdown to that of the activator
            hover: true, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: false, // Displays dropdown below the button
            alignment: 'left' // Displays dropdown with edge aligned to the left of button
        }
    );
    $('select').material_select();

    var config = {
        apiKey: "AIzaSyCkH7eapxWelLQqYWZel8H2vlaaQ7wGkVU",
        authDomain: "dronemapper-83b1a.firebaseapp.com",
        databaseURL: "https://dronemapper-83b1a.firebaseio.com",
        storageBucket: "dronemapper-83b1a.appspot.com",
        messagingSenderId: "915987875489"
    };
    firebase.initializeApp(config);

    let auth = firebase.auth();
    auth.onAuthStateChanged(function (user) {
        showHomeView(user);
        $("nav ul li a").hide();
        $(".homeViewButton").show();
        if (user) {
            $(".galleryViewButton").show();
            $(".uploadViewButton").show();
            $(".logoutButton").show();
        } else {
            $(".loginViewButton").show();
            $(".registerViewButton").show();
        }
    });

});