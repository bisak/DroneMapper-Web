var map = new ol.Map({
    controls: ol.control.defaults().extend([
        new ol.control.FullScreen()
    ]),
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([37.41, 8.82]),
        zoom: 4
    })
});

$('.ol-zoom-in, .ol-zoom-out').tooltip({
    placement: 'right'
});