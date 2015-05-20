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
            poolToIdx = {
                A: 0,
                B: 1,
                C: 2,
                D: 3
            };
            contentMap = {
                profile: function () {
                    if (!currentUser.get("hasMatchups")) {
                        var plen = pools.length,
                            i;

                        for (i = 0; i < plen; i++) {
                            createMatchups(currentUser, pools[i].pool, pools[i].label.slice(-1), PoolPlayGame);
                        }
                    }

                    //load from Parse
                    var ppQuery = new Parse.Query(PoolPlayGame);

                    ppQuery.equalTo("user", currentUser);
                    ppQuery.find({
                        success: function(userPPGames) {
                            var matchups = [],
                                glen = userPPGames.length,
                                i, g,
                                pool;

                            for (i = 0; i < glen; i++) {
                                g = userPPGames[i];
                                pool = poolToIdx[g.get("pool")];

                                if (!matchups[pool]) {
                                    matchups[pool] = [];
                                }

                                matchups[pool].push({
                                    key: g.id,
                                    t1: g.get("t1"),
                                    t2: g.get("t2"),
                                    t1Selected: g.get("t1Selected"),
                                    t2Selected: g.get("t2Selected"),
                                });
                            }

                            $.ajax({
                                url: "../html/tpl/profile.tpl",
                                success: function (data) {
                                    var template = Handlebars.compile(data),
                                        ppGQuery;

                                    $("#content").html(template({
                                        pools: pools,
                                        ppGames: matchups
                                    }));

                                    $(".ppGame").click(function () {
                                        var $self = $(this);

                                        $self.siblings(".selected").removeClass("selected");
                                        $self.addClass("selected");

                                        var fieldT,
                                            fieldF;

                                        if ($self.hasClass("t1")) {
                                            fieldT = "t1Selected";
                                            fieldF = "t2Selected";
                                        }
                                        else {
                                            fieldT = "t2Selected";
                                            fieldF = "t1Selected";
                                        }

                                        // Save to Parse
                                        ppGQuery = new Parse.Query(PoolPlayGame);
                                        ppGQuery.get($self.parent().attr("id"), {
                                            success: function(ppGame) {
                                                // The object was retrieved successfully.
                                                ppGame.set(fieldT, true);
                                                ppGame.set(fieldF, false);
                                                ppGame.save();
                                            },
                                            error: function () {
                                                console.log("could not find game");
                                            }

                                        });
                                    });
                                }
                            });
                        }
                    });
                },
                leaderboard: function () {
                    $("#content").empty();
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

function createMatchups(user, pool, poolKey, ParsePPGame) {
    var plen = pool.length,
        i, j,
        ParseGame;

    for (i = 0; i < plen; i++) {
        for (j = i+1; j < plen; j++) {
            //create new Parse object
            ParseGame = new ParsePPGame();
            ParseGame.save({
                user: user,
                pool: poolKey,
                t1: pool[i],
                t2: pool[j],
                t1Selected: false,
                t2Selected: false
            }, {
                success: function () {}
            });
        }
    }
}