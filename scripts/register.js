$('#registerButton').click(function () {
    let firstName = $("#first_name").val();
    let lastName = $("#last_name").val();
    let username = $("#username").val();
    let email = $("#email").val();
    let password = $("#password").val();
    let passwordConfirm = $("#password_confirm").val();
    let drones = [];
    $('#drone-select :selected').each(function (i, sel) {
        drones.push($(sel).text());
    });
    if (password === passwordConfirm && firstName != "" && lastName != "" && email != "") {
        auth.createUserWithEmailAndPassword(email, password).then(function (user) {
            dbRef.child("users/" + user.uid).set({
                name: firstName + " " + lastName,
                username: username,
                drones: drones
            }).then(function () {
                window.location.href = "/";
            }).catch(function (error) {
                alertify.error(error.message);
            });
        }).catch(function (error) {
            alertify.error(error.message);
        });
    }else{
        alertify.error("Invalid data.");
    }
});

