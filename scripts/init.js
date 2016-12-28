let isAppInitialized = false;

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

    let db = 1;
    var config;
    if (db == 1) {
        config = {
            apiKey: "AIzaSyCkH7eapxWelLQqYWZel8H2vlaaQ7wGkVU",
            authDomain: "dronemapper-83b1a.firebaseapp.com",
            databaseURL: "https://dronemapper-83b1a.firebaseio.com",
            storageBucket: "dronemapper-83b1a.appspot.com",
            messagingSenderId: "915987875489"
        };
    }
    if (db == 2) {
        config = {
            apiKey: "AIzaSyAOoo_aN9aGtzqsZeW-itQP3iOtZIs14Y0",
            authDomain: "dronemapper-2.firebaseapp.com",
            databaseURL: "https://dronemapper-2.firebaseio.com",
            storageBucket: "dronemapper-2.appspot.com",
            messagingSenderId: "439163309533"
        };
    }
    firebase.initializeApp(config);

    let auth = firebase.auth();
    auth.onAuthStateChanged(handleStateChanged);
    function handleStateChanged(user) {
        let sharedImageId = getParameterByName("sharedImage");
        if (sharedImageId && !isAppInitialized) {
            isAppInitialized = true;
            showSharedImageView(sharedImageId);
        } else if (!isAppInitialized) {
            isAppInitialized = true;
            showHomeView();
        }

        $("nav ul li a").hide();
        $(".homeViewButton").show();
        if (user) {
            $(".galleryViewButton").show();
            $(".wallViewButton").show();
            $(".uploadViewButton").show();
            $(".logoutButton").show();
            $(".loggedInUserAvatarContainer").show();
            $(".loggedInUserBadge").show();
            setUserGreeting();
        } else {
            $(".loginViewButton").show();
            $(".registerViewButton").show();
            $(".loggedInUserAvatarContainer").hide();
        }
    }
});