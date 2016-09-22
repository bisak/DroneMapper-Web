var dbRef = firebase.database().ref();
var pointList = [];
var greenIcon = L.icon({
    iconUrl: '/dot.png',

    iconSize: [10, 10],
    iconAnchor: [5, 5],
    popupAnchor: [10, 10]
});



dbRef.child("realtime-flights").on('child_added', function (snapshot) {
    let droneLat = snapshot.val().latitude;
    let droneLong = snapshot.val().longitude;


    var point = new L.LatLng(droneLat, droneLong);
    pointList.push(point);

    var firstpolyline = new L.Polyline(pointList, {
        color: 'orange',
        weight: 2,
        opacity: 1,
        smoothFactor: 2
    });
    firstpolyline.addTo(map);
    //L.marker([droneLat, droneLong], {icon: greenIcon}).addTo(map);
});