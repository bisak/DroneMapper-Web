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

function makeShareImageURL(imageId, dbParentKey) {
    return `${window.location.origin + window.location.pathname}#?sharedImage=${dbParentKey}//${imageId}`;
}

function handleUnknownError(error) {
    showErrorAlert("Something happened.");
    console.log(error);
}

function getInfoCollectionElement(image, params = "") {
    return `<ul class="collection with-header ${params} infoCollection">
                <li class="collection-header"><h5>Picture Info</h5></li>
                <li class="collection-item">Name: <strong>${escape(image.name)}</strong></li>
                <li class="collection-item">Description: <strong>${escape(image.description)}</strong></li>
                <li class="collection-item">Date Taken: <strong>${escape(image.dateTaken)}</strong></li>
                <li class="collection-item">Date Edited: <strong>${escape(image.dateEdited)}</strong></li>
                <li class="collection-item">Date Uploaded: <strong>${escape(image.dateUploaded)}</strong></li>
                <li class="collection-item">Resolution: <strong>${escape(image.resolution)}</strong></li>
                <li class="collection-item">Drone: <strong>${escape(image.droneTaken)}</strong></li>
                <li class="collection-item">Camera: <strong>${escape(image.cameraModel)}</strong></li>
                <li class="collection-item">Altitude (a.s.l.): <strong>${escape(image.alt)}m</strong></li>
            </ul>`
}

function getDefaultAvatar() {
    return `data:image/png;base64,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`
}