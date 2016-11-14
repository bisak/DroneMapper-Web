let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Streets'}),
    outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Outdoors'}),
    dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Dark'}),
    light = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Light'}),
    satelite = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Satelite'}),
    sateliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Satelite Streets'}),
    openStreetMap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://openstreetmap.org">оpenStreetMap</a> оpenStreetMap'});

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
        userId = user.uid;
        $(".signInLinkButton").hide();
        $(".signOutLinkButton").show();
        $(".galleryLinkButton").show();
        firebase.database().ref("users/" + userId).on('value', function (snapshot) {
            $("nav div ul").append(snapshot.val().username);
        });
        dbRef.child("images/" + userId).on('child_added',
            function (snapshot) {
                let imageUrl = snapshot.val().url;
                let imageName = snapshot.val().name;
                let imageLat = snapshot.val().lat;
                let imageLong = snapshot.val().longt;
                let imageAlt = snapshot.val().alt;
                let pictureWidth = Math.round($(window).width() / 5);
                let markerIcon = new L.Icon.Default();
                markerIcon.options.shadowSize = [0, 0];
                let imageDisplayString = `<img class='materialboxed' width="${pictureWidth}" src=${imageUrl}>`;
                L.marker([imageLat, imageLong], {icon: markerIcon})
                    .bindPopup(imageDisplayString, {
                        autoPanPadding: L.point(20, 20),
                    })
                    .addTo(map);
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


let mapHeight = Math.round($(window).height() / 1.2);
$(window).resize(function () {
    mapHeight = Math.round($(window).height() / 1.2);
    $('#homeMap').css("height", mapHeight + "px");
});
$('#homeMap').css("height", mapHeight + "px");
let map = L.map('homeMap', {
    center: [42.7339, 25.4858],
    zoom: 7,
    layers: outdoors,
    fullscreenControl: true,
    minZoom: 3,
});
L.control.locate({
    strings: {
        title: "Locate",
    },
    keepCurrentZoomLevel: true
}).addTo(map);
map.zoomControl.setPosition('bottomright');
let baseMaps = {
    "Outdoors": outdoors,
    "Streets": streets,
    "Dark": dark,
    "Light": light,
    "Satelite": satelite,
    "Satelite Streets": sateliteStreets,
    "OpenStreetMap": openStreetMap
};
L.control.layers(baseMaps).addTo(map);
map.setMaxBounds([[90, -180], [-90, 180]]);
$("#homeMap").on('click', '.leaflet-marker-icon', function (event) {
    $('.materialboxed').materialbox();
});
