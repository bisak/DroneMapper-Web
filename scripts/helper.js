function showSuccessAlert(str) {
    alertify.success(str);
}

function showErrorAlert(str) {
    alertify.error(str);
}

function getTimeNow() {
    let d = new Date();
    return d.getFullYear() + ":" + ('0' + (d.getMonth() + 1)).slice(-2) + ":" + ('0' + d.getDate()).slice(-2) + " " + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2);
}

function escape(string) {
    let entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}

function getRealLatLng(data) {
    return data[0].numerator + data[1].numerator / (60 * data[1].denominator) + data[2].numerator / (3600 * data[2].denominator);
}

function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function makeShareImageURL(pictureId, userId) {
    let currentHref = window.location.href;
    return `${currentHref}?sharedImage=${userId}//${pictureId}`;
}

function getInfoCollectionElement(image, params = "") {
    return `<ul class="collection with-header ${params} infoCollection">
                <li class="collection-header"><h5>Picture Info</h5></li>
                <li class="collection-item">Name: <strong>${escape(image.val().name)}</strong></li>
                <li class="collection-item">Description: <strong>${escape(image.val().description)}</strong></li>
                <li class="collection-item">Date Taken: <strong>${escape(image.val().dateTaken)}</strong></li>
                <li class="collection-item">Date Edited: <strong>${escape(image.val().dateEdited)}</strong></li>
                <li class="collection-item">Date Uploaded: <strong>${escape(image.val().dateUploaded)}</strong></li>
                <li class="collection-item">Resolution: <strong>${escape(image.val().resolution)}</strong></li>
                <li class="collection-item">Drone: <strong>${escape(image.val().droneTaken)}</strong></li>
                <li class="collection-item">Camera: <strong>${escape(image.val().cameraModel)}</strong></li>
                <li class="collection-item">Altitude (a.s.l.): <strong>${escape(image.val().alt)}m</strong></li>
            </ul>`
}