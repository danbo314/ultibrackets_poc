/**
 * Created by Dan Bolivar on 5/18/15.
 */


(function($) {

    Parse.initialize("AxAhmixCD23l9oxpKc02kJewBmdDt5UQ159RB7ni", "Xoypi5WdNOe5V0xGALSUvvFlbAqwE8TeX89TkFeL");

    var currentUser = Parse.User.current();

    if (currentUser) {
        window.location.href = "html/user.html";
    }
    else {
        var pools = [
                ["Pittsburgh (1)", "Georgia (8)", "Wisconsin (12)", "Texas (13)", "Auburn (17)"],
                ["Texas A&M (2)", "Central Florida (7)", "Minnesota (11)", "Western Washington (14)", "Cincinnati (18)"],
                ["North Carolina (3)", "Florida State (6)", "Maryland (10)", "Oregon (15)", "Illinois (19)"],
                ["North Carolina-Wilmington (4)", "Colorado (5)", "Massachusetts (9)", "California-Santa Barbara (13)", "Cornell (20)"]
            ],
            $loginReg = $("#loginReg"),
            $loginBtn = $loginReg.find("#login > .button"),
            $regBtn = $loginReg.find("#register > .button");

        $loginBtn.on({
            click: function () {
                $("#login, #register, hr").hide();
                $("#loginCreds").show();
            }
        });

        $regBtn.on({
            click: function () {
                $("#login, #register, hr").hide();
                $("#regCreds").show();
            }
        });

        $("#regButton").on({
            click: function () {
                var uname = $("#r_uname").val(),
                    name = $("#r_name").val(),
                    pass = $("#r_pword").val();

                if (uname && uname !== "" && name && name !== "" && pass && pass !== "") {
                    var user = new Parse.User();

                    user.set("username", uname);
                    user.set("password", pass);
                    user.set("name", name);

                    user.signUp(null, {
                        success: function (user) {
                            window.location.href = "html/user.html";
                        },
                        error: function (user, error) {
                            alert("ERROR " + error.code + " " + error.message);
                        }
                    });
                }
                else {
                    console.log("error with vars");
                    console.log(uname);
                    console.log(name);
                    console.log(pass);
                }
            }
        });

        $("#loginButton").on({
            click: function () {
                var uname = $("#l_uname").val(),
                    pass = $("#l_pword").val();

                Parse.User.logIn(uname, pass, {
                    success: function (user) {
                        window.location.href = "html/user.html";
                    },
                    error: function (user, error) {
                        alert("ERROR " + error.code + " " + error.message);
                    }
                });
            }
        });

        $("#resetPassword").click(function () {
            var uname = $("#l_uname").val();

            if (uname && uname !== "") {
                Parse.User.requestPasswordReset(uname, {
                    success: function () {
                        // Password reset request was sent successfully
                        alert("Please check your email for password reset instructions.")
                    },
                    error: function (error) {
                        // Show the error message somewhere
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
            }
            else {
                alert("Please Enter Email, then Try Resetting Again");
            }
        });
    }

}(jQuery));