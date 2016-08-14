/**
 * Created by Biser Atanasov on 11-Aug-16.
 */


$('#signInButton').click(function () {
    let email = ($("#inputEmail").val());
    let password = ($("#inputPassword").val());
    console.log(email);
    console.log(password);
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        alertify.error(error.message);
    });
});

$('#signUpButton').click(function () {
    let email = ($("#inputEmail").val());
    let password = ($("#inputPassword").val());
    console.log(email);
    console.log(password);
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        alertify.error(error.message);
    });
});