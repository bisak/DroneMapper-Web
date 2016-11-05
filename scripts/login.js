$('#loginButton').click(function () {
    let email = ($("#email-login").val());
    let password = ($("#password-login").val());
    auth.signInWithEmailAndPassword(email, password).then(function (data) {
        window.location.href = "/";
    }).catch(function (error) {
        alertify.error(error.message);
    });
});
