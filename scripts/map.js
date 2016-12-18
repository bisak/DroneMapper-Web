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
        "OpenStreetMap": L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://openstreetmap.org">оpenStreetMap</a> оpenStreetMap'})
    };
    /*Make map responsive*/
    $('#homeMap').css("height", Math.round($(window).height() / 1.2) + "px");
    $(window).resize(function () {
        $('#homeMap').css("height", Math.round($(window).height() / 1.2) + "px");
    });
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
}

function loadImagesOnMap(user) {
    let dbRef = firebase.database().ref();
    let uid = user.uid;
    dbRef.child("images/" + uid).on('child_added', loadImagesSuccess);

    function loadImagesSuccess(data) {
        let imageUrl = data.val().url;
        let imageName = data.val().name;
        let imageLat = data.val().lat;
        let imageLong = data.val().longt;
        let imageAlt = Math.round(data.val().alt);
        let imageWidth = Math.round($(window).width() / 3);
        let markerIcon = new L.Icon.Default();
        markerIcon.options.shadowSize = [0, 0];

        let imageDisplayString = `<blockquote class="white-text center-align"><h5><strong>${escape(imageAlt)}m</strong> a.s.l.</h5></blockquote><img class='materialboxed mapImage' width="${imageWidth}" src=${imageUrl}>`;
        L.marker([imageLat, imageLong], {icon: markerIcon})
            .bindPopup(imageDisplayString, {
                autoPanPadding: L.point(20, 20),
            })
            .addTo(map);
    }
}

/*Fix this method */
function realtimeFlightsVisualize() {
    let dbRef = firebase.database().ref();
    let realtimeFlightsRef = dbRef.child("realtime-flights");
    let savedFlightsRef = dbRef.child("saved-flights");
    let droneIcon = L.icon({
        iconUrl: 'styles/images/drone-hdg.png',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });

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

function makeImageOnMapEnlargeable() {
    /*Added some delay to ensure stability*/
    setTimeout(function () {
        $('.materialboxed').materialbox();
    }, 10)
}

