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
        var $loginReg = $("#loginReg"),
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
                var pools = [
                        { label: "Pool A", pool: ["Pittsburgh (1)", "Georgia (8)", "Wisconsin (12)", "Texas (13)", "Auburn (17)"] },
                        { label: "Pool B", pool: ["Texas A&M (2)", "UCF (7)", "Minnesota (11)", "W. Washington (14)", "Cincinnati (18)"] },
                        { label: "Pool C", pool: ["UNC (3)", "Florida State (6)", "Maryland (10)", "Oregon (15)", "Illinois (19)"] },
                        { label: "Pool D", pool: ["UNCW (4)", "Colorado (5)", "UMass (9)", "UCSB (16)", "Cornell (20)"] }
                    ],
                    PoolPlayGame = Parse.Object.extend("PoolPlayGame"),
                    Prequarter = Parse.Object.extend("Prequarter"),
                    Quarter = Parse.Object.extend("Quarter"),
                    Semi = Parse.Object.extend("Semi"),
                    Final = Parse.Object.extend("Final"),
                    uname = $("#r_uname").val(),
                    name = $("#r_name").val(),
                    pass = $("#r_pword").val();

                if (uname && uname !== "" && name && name !== "" && pass && pass !== "") {
                    var user = new Parse.User();

                    user.set("username", uname);
                    user.set("password", pass);
                    user.set("name", name);

                    var plen = pools.length,
                        i;

                    for (i = 0; i < plen; i++) {
                        user.set("ppGames", createMatchups(user, pools[i].pool, pools[i].label.slice(-1), PoolPlayGame));
                    }

                    user = createCheckBoxes(user, pools, Prequarter, Quarter, Semi, Final);

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

function createMatchups(user, pool, poolKey, ParsePPGame) {
    var plen = pool.length,
        i, j,
        ParseGame,
        ParseGameArray = [];

    for (i = 0; i < plen; i++) {
        for (j = i+1; j < plen; j++) {
            //create new Parse object
            ParseGame = new ParsePPGame();
            ParseGame.set("user", user);
            ParseGame.set("pool", poolKey);
            ParseGame.set("t1", pool[i]);
            ParseGame.set("t2", pool[j]);
            ParseGame.set("t1Selected", false);
            ParseGame.set("t2Selected", false);

            ParseGameArray.push(ParseGame);
        }
    }

    return ParseGameArray;
}

function createCheckBoxes(user, pools, ParsePreQ, ParseQ, ParseSemi, ParseFinal) {
    var i, j,
        plen = pools.length,
        pplen,
        pool,
        team,
        pq, q, s, f,
        pool_key,
        pqArray = [],
        qArray = [],
        sArray = [],
        fArray = [];

    for (i = 0; i < plen; i++) {
        pool = pools[i];
        pplen = pool.pool.length;
        pool_key = pool.label.slice(-1);

        for (j = 0; j < pplen; j++) {
            team = pool.pool[j];

            pq = new ParsePreQ();
            q = new ParseQ();
            s = new ParseSemi();
            f = new ParseFinal();

            pq.set("user", user);
            pq.set("pool", pool_key);
            pq.set("name", team);
            pq.set("selected", false);
            pqArray.push(pq);

            q.set("user", user);
            q.set("pool", pool_key);
            q.set("name", team);
            q.set("selected", false);
            qArray.push(q);

            s.set("user", user);
            s.set("pool", pool_key);
            s.set("name", team);
            s.set("selected", false);
            sArray.push(s);

            f.set("user", user);
            f.set("pool", pool_key);
            f.set("name", team);
            f.set("selected", false);
            fArray.push(f);
        }
    }

    user.set("pqGames", pqArray);
    user.set("qGames", qArray);
    user.set("sGames", sArray);
    user.set("fGames", fArray);

    return user;
}