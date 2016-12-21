function initSharedImageView(id) {
    let tokens = id.split("\/\/");
    let uploader = tokens[0];
    let imageId = tokens[1];
    let dbRef = firebase.database().ref();

    dbRef.child("images/" + uploader + "/" + imageId).once('value', renderSharedImage);

    function renderSharedImage(image) {
        let lat = image.val().lat;
        let lng = image.val().longt;
        let entryToRender = $(`
            <div class="row">
                <div class="sharedImageHolder col s12">
                    <img class="materialboxed responsive-img z-depth-2" src="${image.val().url}">  
                    <br>
                    <div class="col s12 m6 l6">
                        ${getInfoCollectionElement(image)}
                    </div>
                    <div class="col s12 m6 l6 ">
                        <div id="sharedImageMap">

                        </div>
                    </div>
                </div>
            </div>`);


        $("#sharedImageForm").append(entryToRender);
        $('.materialboxed').materialbox();

        $(window).resize(function () {
            let infoSize = $(".sharedImageHolder .infoCollection").height();
            let infoMargin = $(".sharedImageHolder .infoCollection").css("margin");
            $("#sharedImageMap").height(infoSize);
            $("#sharedImageMap").css("margin", infoMargin);
        });
        $(window).trigger("resize");


        let baseMaps = {
            "Outdoors": L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlza2F6eiIsImEiOiJjaXJkOTFkb3owMDdxaTltZ21vemsxcGViIn0.70mwo4YYnbxY_BJoEsGYxw', {attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a> Outdoors'}),
            "OpenStreetMap": L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://openstreetmap.org">оpenStreetMap</a> оpenStreetMap'})
        };

        /*Create map and append it to body*/
        let newMap = L.map('sharedImageMap', {
            center: [lat, lng],
            zoom: 10,
            layers: baseMaps.Outdoors,
            minZoom: 3,
            zoomControl: false
        });
        let imageDisplayString = `<img class='materialboxed z-depth-2' width="${150}px" src=${image.val().url}>`;
        L.marker([lat, lng]).bindPopup(imageDisplayString).addTo(newMap);



    }

}