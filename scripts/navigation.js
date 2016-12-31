/*Add navigation here*/
function showHomeView() {
    showView("homeView");
    initMap();
    handleMapContent();
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

function showEditImageView() {
    showView("editImageView");
}

function showWallView() {
    showView("wallView");
    loadWallImages();
}

function showUserView() {
    showView("userProfileView");
    $("html, body").animate({scrollTop: 0}, "fast");
}

function showSharedImageView() {
    showView("sharedImageView");
    $("html, body").animate({scrollTop: 0}, "fast");
}

function showEditProfileView() {
    showView("editProfileView");
}

function showPreferencesView() {
    showView("preferencesView");
}


function showView(view) {
    $(window).unbind('scroll');
    $('main > section').hide();
    $(`#${view}`).show();
    /*Takes care of highligiting in menus and navs */
    $('nav div ul li.active').removeClass("active");
    $(`nav div ul li .${view}Button`).parent().addClass("active");
}