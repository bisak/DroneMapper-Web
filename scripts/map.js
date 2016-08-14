/*JavaScript*/
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Streets'}),
    outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Outdoors'}),
    dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Dark'}),
    light = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Light'}),
    satelite = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Satelite'}),
    sateliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Satelite Streets'}),
    оpenStreetMap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://openstreetmap.org">оpenStreetMap</a> оpenStreetMap'});

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
    "OpenStreetMap": оpenStreetMap
};

L.control.layers(baseMaps).addTo(map);


$.get("/getimages.php", function (data) {
    let result = JSON.parse(data);
    loadImages(result);
});


function loadImages(images) {
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
                let imageName = this.src.split("/").reverse()[0];

                let realImageLat = imageLat[0].numerator + imageLat[1].numerator /
                    (60 * imageLat[1].denominator) + imageLat[2].numerator / (3600 * imageLat[2].denominator);
                let realImageLong = imageLong[0].numerator + imageLong[1].numerator /
                    (60 * imageLong[1].denominator) + imageLong[2].numerator / (3600 * imageLong[2].denominator);
                let realImageAlt = imageAlt.numerator / imageAlt.denominator;

                let imageDisplayString = '<h4>' + imageName + '&nbsp;&nbsp;&nbsp;Altitude: ' + imageAlt + 'm.' + '</h4>' + '<img src="' + this.src + '" alt="Cool Photo" style="border-radius: 5px;" height="360" width="640">';

                L.marker([realImageLat, realImageLong])
                    .bindPopup(imageDisplayString, {
                        maxWidth: 1920,
                        autoPanPadding: L.point(50, 50)
                    })
                    .addTo(map)
            });
        };
    });
}

