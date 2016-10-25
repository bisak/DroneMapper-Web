let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Streets'}),
    outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Outdoors'}),
    dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Dark'}),
    light = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Light'}),
    satelite = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Satelite'}),
    sateliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Satelite Streets'}),
    openStreetMap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://openstreetmap.org">оpenStreetMap</a> оpenStreetMap'});

let mapHeight= Math.round($(window).height() / 1.22);
$(window).resize(function() {
    mapHeight= Math.round($(window).height() / 1.22);
    $('#map').css("height", mapHeight+"px");
});
$('#map').css("height", mapHeight+"px");



let map = L.map('map', {
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
}).
addTo(map);


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

        let pictureWidth = Math.round($(window).width() / 5);

        let markerIcon = new L.Icon.Default();
        markerIcon.options.shadowSize = [0,0];

        //let imageDisplayString = `<h4>${imageName}&nbsp;&nbsp;&nbsp;Altitude: ${imageAlt}m.</h4><div class="link" style="min-height:${pictureHeight}px; width:${pictureWidth}px;"><a href="${imageUrl}"><img src=${imageUrl} style="/*height:${pictureHeight}px; */width:${pictureWidth}px;" ></a></div>`
        let imageDisplayString = `<img class='materialboxed' width="${pictureWidth}" src=${imageUrl}>`;
        L.marker([imageLat, imageLong], {icon : markerIcon})
            .bindPopup(imageDisplayString, {
                autoPanPadding: L.point(20, 20),
            })
            .addTo(map);

    });

$("#map").on('click', '.materialboxed', function (event) {
    $('.materialboxed').materialbox();
});