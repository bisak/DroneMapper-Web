let map;
/*Map initialization happens here*/
function initMap() {
    if (map) {
        map.remove();
        $("#homeMap").empty();
    }
    /*Users can choose map*/
    let baseMaps = {
        "Outdoors": L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Outdoors'}),
        "Streets": L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Streets'}),
        "Dark": L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Dark'}),
        "Light": L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Light'}),
        "Satelite": L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Satelite'}),
        "Satelite Streets": L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Satelite Streets'}),
        "OpenStreetMap": L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>'})
    };
    /*Make map responsive*/

    let resizeMapContainer = debounce (function () {
        $('#homeMap').animate({height: Math.round($(window).height() / 1.3) + "px"}, 500);
        map.invalidateSize();
    }, 333);

    $(window).resize(resizeMapContainer);


    /*Create map and append it to body*/
    map = L.map('homeMap', {
        center: [42.7339, 25.4858],
        zoom: 7,
        layers: baseMaps.Outdoors,
        minZoom: 3,
    });
    /*Add controls and other components*/
    map.zoomControl.setPosition('bottomright');
    L.control.layers(baseMaps).addTo(map);
    map.setMaxBounds([[90, -180], [-90, 180]]);
    $(window).trigger("resize");
}

function loadGalleryImagesOnMap() {
    let dbRef = firebase.database().ref();
    let user = firebase.auth().currentUser;
    let uid = user.uid;
    dbRef.child("images/" + uid).once('value', loadImagesSuccess);

    function loadImagesSuccess(data) {
        let images = data.val();

        let markerIcon = new L.Icon.Default();
        markerIcon.options.shadowSize = [0, 0];

        for (let image in images) {
            let displayString = getStringToDisplay(images[image]);
            let imageLat = images[image].lat;
            let imageLong = images[image].longt;

            L.marker([imageLat, imageLong], {icon: markerIcon})
                .bindPopup(displayString)
                .addTo(map);
        }

        function getStringToDisplay(image) {
            let imageUrl = image.url;
            let imageWidth = Math.round($(window).width() / 2);

            let imageToDisplay = `<blockquote class="z-depth-1 blue-grey darken-2">
                                        <h5 class="white-text"><strong>Gallery Picture</strong></h5>
                                   </blockquote>
                                   <img class='materialboxed z-depth-2' width="${imageWidth}" src=${imageUrl}>`;

            return imageToDisplay;
        }
    }
}

function loadWallImagesOnMap() {
    let user = firebase.auth().currentUser;
    let dbRef = firebase.database().ref();

    dbRef.child("sharedImagesOnWall/").once('value', loadImagesSuccess);
    function loadImagesSuccess(data) {
        let images = data.val();
        let markerIcon = new L.Icon.Default();
        markerIcon.options.shadowSize = [0, 0];
        for (let image in images) {
            let displayString = getStringToDisplay(images[image]);
            let imageLat = images[image].lat;
            let imageLong = images[image].longt;

            L.marker([imageLat, imageLong], {icon: markerIcon})
                .bindPopup(displayString)
                .addTo(map);
        }
        function getStringToDisplay(image) {
            let imageUrl = image.url;
            let imageWidth = Math.round($(window).width() / 2);

            let imageToDisplay = `<blockquote class="z-depth-1 blue-grey darken-2">
                                        <h5 class="white-text"><strong>Shared Picture</strong></h5>
                                        <h6 class="white-text">by: <strong>${escape(image.uploaderUsername)}</strong></h6>
                                   </blockquote>
                                   <img class='materialboxed z-depth-2' width="${imageWidth}" src=${imageUrl}>`;

            return imageToDisplay;
        }
    }
}

/*TODO fix */
function handleRealtimeFlights() {
    let dbRef = firebase.database().ref();
    let realtimeFlightsRef = dbRef.child("realtime-flights");
    let droneIcon = L.icon({
        iconUrl: 'styles/images/drone-hdg.png',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });

    realtimeFlightsRef.on('child_added', function (snapshotOne) {
        let drone = L.marker([], {icon: droneIcon});
        realtimeFlightsRef.child(snapshotOne.key).on('child_added', function (snapshotTwo) {
            let droneLat = snapshotTwo.val().latitude;
            let droneLng = snapshotTwo.val().longitude;
            let droneHDG = snapshotTwo.val().heading;
            let droneSpeed = snapshotTwo.val().speed;
            let droneAltitude = snapshotTwo.val().altitude;
            let displayDiv = `<div class="telemetryData">Speed: ${escape(droneSpeed)}<br><hr>Altitude: ${escape(droneAltitude)}</div>`;
            drone.bindPopup(displayDiv);
            drone.setLatLng([droneLat, droneLng]);
            drone.setRotationAngle(droneHDG);
        });
        realtimeFlightsRef.child(snapshotOne.key).on('child_removed', function (snapshotSome) {
            drone.remove();
        });
        drone.addTo(map);
    });
}

function handleSavedFlights() {
    let dbRef = firebase.database().ref();
    let savedFlightsRef = dbRef.child("saved-flights");

    savedFlightsRef.on('child_added', function (snapshotOne) {
        let polyline = new L.Polyline([], {
            color: 'orange',
            weight: 3,
            opacity: 1,
            smoothFactor: 0,
        });
        savedFlightsRef.child(snapshotOne.key).on('child_added', function (snapshotTwo) {
            let droneLat = snapshotTwo.val().latitude;
            let droneLng = snapshotTwo.val().longitude;
            polyline.addLatLng([droneLat, droneLng]);
        });
        map.addLayer(polyline);
    });
}

function makeImageOnMapEnlargeable() {
    /*Added some delay to ensure stability*/
    setTimeout(function () {
        $('.materialboxed').materialbox();
    }, 10)
}

function handleMapContent() {
    let user = firebase.auth().currentUser;
    if (user) {
        handleUserPreferences();
    } else {
        handleRealtimeFlights();
        handleSavedFlights();
        loadWallImagesOnMap();
    }
}