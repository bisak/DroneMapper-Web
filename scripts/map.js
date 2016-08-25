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
});


let lc = L.control.locate({
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


/*function loadImages(images) {
    let imgArray = [];

    images.forEach((src, index) => {
        let img = new Image();
        img.src = src;
        imgArray.push(img);
    });

    imgArray.forEach((img) => {
        img.onload = function () {
            EXIF.getData(img, function () {
                let imageLat = EXIF.getTag(this, 'GPSLatitude');
                let imageLong = EXIF.getTag(this, 'GPSLongitude');
                let imageAlt = EXIF.getTag(this, 'GPSAltitude');
                let imageName = this.src.split("/").reverse()[0].split(".")[0];

                imageLat = imageLat[0].numerator + imageLat[1].numerator /
                    (60 * imageLat[1].denominator) + imageLat[2].numerator / (3600 * imageLat[2].denominator);
                imageLong = imageLong[0].numerator + imageLong[1].numerator /
                    (60 * imageLong[1].denominator) + imageLong[2].numerator / (3600 * imageLong[2].denominator);
                imageAlt = imageAlt.numerator / imageAlt.denominator;

                let imageDisplayString = '<h4>' + imageName + '&nbsp;&nbsp;&nbsp;Altitude: ' + imageAlt + 'm.' + '</h4>' + '<img src="' + this.src + '" alt="Cool Photo" style="border-radius: 5px;" height="360" width="640">';


                L.marker([imageLat, imageLong])
                    .bindPopup(imageDisplayString, {
                        maxWidth: 1920,
                        autoPanPadding: L.point(50, 50)
                    })
                    .addTo(map)
            });
        };
    });
}*/

firebase.database().ref().child("images/").on('child_added',
    function (snapshot) {
        let imageUrl = snapshot.val().url;
        let imageName = snapshot.val().name;
        let imageLat = snapshot.val().lat;
        let imageLong = snapshot.val().long;
        let imageAlt = snapshot.val().alt;

        let imageDisplayString = '<h4>' + imageName + '&nbsp;&nbsp;&nbsp;Altitude: ' + imageAlt + 'm.' + '</h4>' + '<img src="' + imageUrl + '" alt="Cool Photo" style="border-radius: 5px;" height="360" width="640">';

        L.marker([imageLat, imageLong])
            .bindPopup(imageDisplayString, {
                maxWidth: 1920,
                autoPanPadding: L.point(50, 50)
            })
            .addTo(map)
    });
