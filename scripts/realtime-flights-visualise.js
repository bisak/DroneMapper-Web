let dbRef = firebase.database().ref();
let flightsRef = dbRef.child("realtime-flights");
let pointList = [];
let firstpolyline;

flightsRef.on('child_added', function (snapshotOne) {
    flightsRef.child(snapshotOne.key).on('child_added', function (snapshotOther) {
        let droneLat = snapshotOther.val().latitude;
        let droneLong = snapshotOther.val().longitude;
        let point = new L.LatLng(droneLat, droneLong);
        pointList.push(point);

        firstpolyline = new L.Polyline(pointList, {
            color: 'orange',
            weight: 2,
            opacity: 1,
            smoothFactor: 2
        });

        //L.marker([droneLat, droneLong], {icon: greenIcon}).addTo(map);
    });
    firstpolyline.addTo(map);

    pointList = [];

});


