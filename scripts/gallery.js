function loadGalleryImages() {
    let dbRef = firebase.database().ref();
    let uid = firebase.auth().currentUser.uid;
    dbRef.child("images/" + uid).on('child_added', renderImages);
    function renderImages(image) {
        $('.gallery-images').prepend(`<div class="imageHolder"><p><strong><h5>${image.val().name}</h5></strong></p><img class="materialboxed responsive-img z-depth-1 gallery-image" src="${image.val().url}"><div class="divider"></div></div>`)
        $('.materialboxed').materialbox();
    }
}