let dbRef = firebase.database().ref();
let realtimeFlightsRef = dbRef.child("realtime-flights");
let savedFlightsRef = dbRef.child("saved-flights");

var myIcon = L.icon({
    iconUrl: '/img/drone-hdg.png',
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
    let mrkr = L.marker([], {icon: myIcon});
    realtimeFlightsRef.child(snapshotOne.key).on('child_added', function (snapshotTwo) {
        let droneLat = snapshotTwo.val().latitude;
        let droneLng = snapshotTwo.val().longitude;
        let droneHDG = snapshotTwo.val().heading;
        mrkr.setLatLng([droneLat, droneLng]);
        mrkr.setRotationAngle(droneHDG);
    });
    realtimeFlightsRef.child(snapshotOne.key).on('child_removed', function (snapshotSome) {
        mrkr.remove();
    });
    mrkr.addTo(map);
});



