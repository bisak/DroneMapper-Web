/*Add events handling here*/
$(document).ready(function () {
    $(".homeViewButton").click(showHomeView);
    $(".galleryViewButton").click(showGalleryView);
    $(".uploadViewButton").click(showUploadView);
    $(".registerViewButton").click(showRegisterView);
    $(".loginViewButton").click(showLoginView);
    $(".faqViewButton").click(showFaqView);
    $(".logoutButton").click(logoutUser);
    $(".loginButton").click(loginUser);
    $(".registerButton").click(registerUser);
    $("#uploadSlector").change(uploadImages);
    $("#uploadAvatarSlector").change(setAvatar)
    $("#homeMap").on('click', '.leaflet-marker-icon', makeImageOnMapEnlargeable);
});