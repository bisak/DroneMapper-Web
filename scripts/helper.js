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
    return data[0].numerator + data[1].numerator / (60 * data[1].denominator) + data[2].numerator / (3600 * data[2].denominator)
}