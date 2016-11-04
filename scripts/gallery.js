let dbRef = firebase.database().ref();

dbRef.child("images/").on('child_added',
    function (snapshot) {
        $('.images').append(`<p>${snapshot.val().name}</p><img style="border-radius: 2px;" class="materialboxed responsive-img z-depth-2" width="650" src="${snapshot.val().thumbnailUrl}"><div class="divider"></div>`)
        $('.materialboxed').materialbox();
    });

$(document).ready(function () {
    $('.materialboxed').materialbox();
});

$('.images').css("min-height",  Math.round($(window).height() / 1.22)+"px");