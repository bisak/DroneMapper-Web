let dbRef = firebase.database().ref();
let pointList = [];


dbRef.child("realtime-flights").on('child_added', function (snapshot) {
    let droneLat = snapshot.val().latitude;
    let droneLong = snapshot.val().longitude;


    let point = new L.LatLng(droneLat, droneLong);
    pointList.push(point);

    let firstpolyline = new L.Polyline(pointList, {
        color: 'orange',
        weight: 2,
        opacity: 1,
        smoothFactor: 2
    });
    firstpolyline.addTo(map);
    //L.marker([droneLat, droneLong], {icon: greenIcon}).addTo(map);
});