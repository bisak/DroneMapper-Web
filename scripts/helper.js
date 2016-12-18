function showSuccessAlert(str) {
    alertify.success(str);
}

function showErrorAlert(str) {
    alertify.error(str);
}

function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response);
    if (response.readyState === 0)
        errorMsg = "Cannot connect due to network error.";
    if (response.responseJSON &&
        response.responseJSON.description)
        errorMsg = response.responseJSON.description;
    showErrorAlert(errorMsg);
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