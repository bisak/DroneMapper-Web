let realtimeFlightsRef = dbRef.child("realtime-flights");
let savedFlightsRef = dbRef.child("saved-flights");

let myIcon = L.icon({
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
        let timeLast = snapshotTwo.val().time;
        mrkr.setLatLng([droneLat, droneLng]);
        mrkr.setRotationAngle(droneHDG);
    });
    realtimeFlightsRef.child(snapshotOne.key).on('child_removed', function (snapshotSome) {
        mrkr.remove();
    });
    mrkr.addTo(map);
});

realtimeFlightsRef.on('child_added', function (snapshotOne) {
    realtimeFlightsRef.child(snapshotOne.key).limitToLast(1).on('child_added', function (snapshotTwo) {
        let timeLast = snapshotTwo.val().time;
        console.log(timeLast);//TODO this is in order to remove data from the realtime flights node which is older than 1 minute. Not yet finished. v2. Fix from android side
    });
});





