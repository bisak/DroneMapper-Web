let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Streets'}),
    outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Outdoors'}),
    dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Dark'}),
    light = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Light'}),
    satelite = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Satelite'}),
    sateliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Satelite Streets'}),
    openStreetMap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://openstreetmap.org">оpenStreetMap</a> оpenStreetMap'});

let map = L.map('map', {
    center: [42.7339, 25.4858],
    zoom: 7,
    layers: outdoors,
    fullscreenControl: true,
    minZoom: 3,
    inertiaDeceleration: 10000
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

firebase.database().ref().child("images/").on('child_added',
    function (snapshot) {
        let imageUrl = snapshot.val().url;
        let imageName = snapshot.val().name;
        let imageLat = snapshot.val().lat;
        let imageLong = snapshot.val().longt;
        let imageAlt = snapshot.val().alt;

        let pictureWidth = Math.round($(document).width() / 2.2);
        let pictureHeight = Math.round($(document).height() / 2.2);

        if (pictureHeight > pictureWidth) {
            pictureHeight = Math.round($(document).width() / 2.2);
            pictureWidth = Math.round($(document).height() / 2.2);
        }
        //let imageDisplayString = '<h4>' + imageName + '&nbsp;&nbsp;&nbsp;Altitude: ' + imageAlt + 'm.' + '</h4>' + '<img src=' + imageUrl + ' style="height="' + pictureHeight + 'px;' + ' width=' + pictureWidth + 'px;' + '" >';

        let imageDisplayString = '<h4>' + imageName + '&nbsp;&nbsp;&nbsp;Altitude: ' + imageAlt + 'm.' + '</h4>' + '<div class="link" style="height:' + pictureHeight + 'px; width:' + pictureWidth + 'px;"><a href="' + imageUrl + '"><img src=' + imageUrl + ' style="height:' + pictureHeight + 'px;' + ' width:' + pictureWidth + 'px;' + '" ></a></div>';

        L.marker([imageLat, imageLong])
            .bindPopup(imageDisplayString, {
                maxWidth: 1920,
                autoPanPadding: L.point(50, 50),
                keepInView: true
            })
            .addTo(map);


    });

$("#map").on('click', '.link', function (event) {
    event = event || window.event;
    var target = event.target || event.srcElement,
        link = target.src ? target.parentNode : target,
        options = {index: link, event: event},
        links = this.getElementsByTagName('a');
    blueimp.Gallery(links, options);
});

