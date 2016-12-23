/*Add navigation here*/
function showHomeView() {
    showView("homeView");
    initMap();
    realtimeFlightsVisualize();
    let user = firebase.auth().currentUser;
    if (user) {
        loadImagesOnMap()
    }
}

function showGalleryView() {
    showView("galleryView");
    loadGalleryImages();
}

function showUploadView() {
    showView("uploadView");
}

function showRegisterView() {
    showView("registerView");
}

function showLoginView() {
    showView("loginView");
}

function showFaqView() {
    showView("faqView");
}

function showEditImageView(image, id) {
    showView("editImageView");
    setupEditImageView(image, id);
}

function showWallView() {
    showView("wallView");
    loadWallImages();
}

function showSharedImageView(imageId) {
    showView("sharedImageView");
    initSharedImageView(imageId);
    $("html, body").animate({ scrollTop: 0 }, "slow");
}

function showView(view) {
    $('main > section').hide();
    $(`#${view}`).show();
    /*Takes care of highligiting in menus and navs */
    $('nav div ul li.active').removeAttr("class");
    $(`.${view}Button`).parent().addClass("active");
}