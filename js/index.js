/**
 * Created by Dan Bolivar on 5/18/15.
 */


(function($) {

    Parse.initialize("AxAhmixCD23l9oxpKc02kJewBmdDt5UQ159RB7ni", "Xoypi5WdNOe5V0xGALSUvvFlbAqwE8TeX89TkFeL");

    var currentUser = Parse.User.current();

    if (currentUser) {
        alert("should redirect");
        window.location.href = "../html/user.html";
    }
    else {
    }
        // show the signup or login page

        var $loginReg = $("#loginReg"),
            $loginBtn = $loginReg.find("#login > .button"),
            $regBtn = $loginReg.find("#register > .button");

        $loginBtn.on({
            click: function () {
                $("#login, #register").hide();
                $("#loginCreds").show();
            }
        });

        $regBtn.on({
            click: function () {
                $("#login, #register").hide();
                $("#regCreds").show();
            }
        });

        $("#regButton").on({
            click: function () {
                console.log("clicked register button");
                var uname = $("#r_uname").text(),
                    name = $("#r_name").text(),
                    pass = $("#r_pword").text(),
                    conf = $("#r_pword_conf").text();

                if (uname && uname !== "" && name && name !== "" && pass && conf && pass === conf) {
                    var user = new Parse.User();

                    user.set("username", uname);
                    user.set("password", pass);

                    user.signUp(null, {
                        success: function (user) {
                            alert("success");
                            window.location.href = "../html/user.html";
                        },
                        error: function (user, error) {
                            alert("ERROR " + error.code + " " + error.message);
                        }
                    });
                }
            }
        });

        $("#loginButton").on({
            click: function () {
                var uname = $("#l_uname").text(),
                    pass = $("#l_pword").text();

                Parse.User.logIn(uname, pass, {
                    success: function (user) {
                        alert("success");
                    },
                    error: function (user, error) {
                        alert("ERROR " + error.code + " " + error.message);
                    }
                });
            }
        });
    //}

}(jQuery));