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
    $('.gallery-images').empty();
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
    $('.wall-images').empty();
    loadWallImages();
}

function showUserView(userId) {
    showView("userProfileView");
    loadUserProfile(userId);
    $("html, body").animate({scrollTop: 0}, "fast");
}

function showSharedImageView(imageId) {
    showView("sharedImageView");
    initSharedImageView(imageId);
    $("html, body").animate({scrollTop: 0}, "fast");
}

function showView(view) {
    $(window).unbind('scroll');
    $('main > section').hide();
    $(`#${view}`).show();
    /*Takes care of highligiting in menus and navs */
    $('nav div ul li.active').removeClass("active");
    $(`nav div ul li .${view}Button`).parent().addClass("active");
}