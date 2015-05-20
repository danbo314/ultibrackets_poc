/**
 * Created by Dan Bolivar on 5/18/15.
 */

(function ($) {

    Parse.initialize("AxAhmixCD23l9oxpKc02kJewBmdDt5UQ159RB7ni", "Xoypi5WdNOe5V0xGALSUvvFlbAqwE8TeX89TkFeL");

    var currentUser = Parse.User.current();

    if (currentUser) {
        var PoolPlayGame = Parse.Object.extend("PoolPlayGame"),
            Prequarter = Parse.Object.extend("Prequarter"),
            Quarter = Parse.Object.extend("Quarter"),
            Semi = Parse.Object.extend("Semi"),
            Winner = Parse.Object.extend("Winner"),
            initDOMHandlers = function () {
                $("#logout").click(function() {
                    Parse.User.logOut();
                    window.location.href = "../index.html";
                });

                $("#brackets, #leaderboard").click(function () {
                    $(".tab.selected").removeClass("selected");
                    $(this).addClass("selected");

                    showContent();
                });
            },
            pools = [
                { label: "Pool A", pool: ["Pittsburgh (1)", "Georgia (8)", "Wisconsin (12)", "Texas (13)", "Auburn (17)"] },
                { label: "Pool B", pool: ["Texas A&M (2)", "UCF (7)", "Minnesota (11)", "W. Washington (14)", "Cincinnati (18)"] },
                { label: "Pool C", pool: ["UNC (3)", "Florida State (6)", "Maryland (10)", "Oregon (15)", "Illinois (19)"] },
                { label: "Pool D", pool: ["UNCW (4)", "Colorado (5)", "UMass (9)", "UCSB (13)", "Cornell (20)"] }
            ],
            loadPPGames = function () {

            },
            contentMap = {
                profile: function () {
                    var matchups = [];

                    if (!currentUser.get("hasMatchups")) {
                        var plen = pools.length,
                            i,
                            createdMatchups = currentUser.get("createdPPGames");

                        for (i = 0; i < plen; i++) {
                            createMatchups(currentUser, pools[i].pool, PoolPlayGame, loadPPGames, i === plen - 1);
                        }

                        console.log(createdMatchups);
                    }

                    //load from Parse
                    var ppQuery = new Parse.Query(PoolPlayGame);

                    ppQuery.equalTo("user", currentUser);
                    ppQuery.find({
                        success: function(userPPGames) {
                            console.log(userPPGames);
                            matchups = $.map(userPPGames, function (game) {
                                return {
                                    key: game.id,
                                    t1: game.get("t1"),
                                    t2: game.get("t2"),
                                    t1Selected: game.get("t1Selected"),
                                    t2Selected: game.get("t2Selected"),
                                }
                            });

                            $.ajax({
                                url: "../html/tpl/profile.tpl",
                                success: function (data) {
                                    var template = Handlebars.compile(data);

                                    $("#content").html(template({
                                        pools: pools,
                                        ppGames: matchups
                                    }));

                                    $(".ppGame").click(function () {
                                        $(this).siblings(".selected").removeClass("selected");
                                        $(this).addClass("selected");
                                        //TODO: SAVE THIS CHOICE TO PARSE
                                    });
                                }
                            });
                        }
                    });
                },
                leaderboard: function () {

                }
            },
            showContent = function () {
                var func = contentMap[$("#profile").find(".tab.selected").text().toLowerCase()];

                if (func) {
                    func();
                }
            };

        $.ajax({
            url: "../html/tpl/user.tpl",
            success: function (data) {
                var template = Handlebars.compile(data);

                $("#profile").html(template(currentUser.attributes));

                initDOMHandlers();

                showContent();
            }
        });
    }
    else {
        window.location.href = "../index.html";
    }

}(jQuery));

function createMatchups(user, pool, ParsePPGame) {
    var plen = pool.length,
        i, j,
        ParseGame;

    for (i = 0; i < plen; i++) {
        for (j = i+1; j < plen; j++) {
            //create new Parse object
            ParseGame = new ParsePPGame();
            ParseGame.save({
                user: user,
                t1: pool[i],
                t2: pool[j],
                t1Selected: false,
                t2Selected: false
            }, {
                success: function () {
                    user.increment("createdPPGames");
                    user.save();
                }
            });
        }
    }
}