$('#loginButton').click(function () {
    let email = ($("#email-login").val());
    let password = ($("#password-login").val());
    auth.signInWithEmailAndPassword(email, password).then(function () {
        window.location.href = "/";
    }).catch(function (error) {
        alertify.error(error.message);
    });
});

$('#registerButton').click(function () {
    let email = ($("#inputEmail").val());
    let password = ($("#inputPassword").val());
    auth.createUserWithEmailAndPassword(email, password).then(function () {
        console.log("register success");
    }).catch(function (error) {
        alertify.error(error.message);
    });
});

//TODO Fix Registration! Not working AT ALL now.