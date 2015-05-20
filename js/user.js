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
            Final = Parse.Object.extend("Final"),
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
                { label: "Pool D", pool: ["UNCW (4)", "Colorado (5)", "UMass (9)", "UCSB (16)", "Cornell (20)"] }
            ],
            teams = ["Pittsburgh (1)","Texas A&M (2)","UNC (3)","UNCW (4)","Colorado (5)","Florida State (6)","UCF (7)","Georgia (8)",
                "UMass (9)","Maryland (10)","Minnesota (11)","Wisconsin (12)","Texas (13)","W. Washington (14)","Oregon (15)","UCSB (16)",
                "Auburn (17)","Cincinnati (18)","Illinois (19)","Cornell (20)"],
            poolToIdx = {
                A: 0,
                B: 1,
                C: 2,
                D: 3
            },
            contentMap = {
                profile: function () {
                    if (!currentUser.get("hasMatchups")) {
                        var plen = pools.length,
                            i;

                        for (i = 0; i < plen; i++) {
                            createMatchups(currentUser, pools[i].pool, pools[i].label.slice(-1), PoolPlayGame);
                        }

                        createCheckBoxes(currentUser, pools, Prequarter, Quarter, Semi, Final);

                        currentUser.save({
                           hasMatchups: true
                        });
                    }

                    //load from Parse
                    var ppQuery = new Parse.Query(PoolPlayGame),
                        ppMatches = [],
                        preqs = [],
                        qs = [],
                        ss = [],
                        fs = [];

                    ppQuery.equalTo("user", currentUser);
                    ppQuery.find({
                        success: function(userPPGames) {
                            var glen = userPPGames.length,
                                i, g,
                                pool;

                            for (i = 0; i < glen; i++) {
                                g = userPPGames[i];
                                pool = poolToIdx[g.get("pool")];

                                if (!ppMatches[pool]) {
                                    ppMatches[pool] = [];
                                }

                                ppMatches[pool].push({
                                    key: g.id,
                                    t1: g.get("t1"),
                                    t2: g.get("t2"),
                                    t1Selected: g.get("t1Selected"),
                                    t2Selected: g.get("t2Selected"),
                                });
                            }

                            var preQQuery = new Parse.Query(Prequarter);

                            preQQuery.equalTo("user", currentUser);
                            preQQuery.find({
                                success: function (userPreQs) {
                                    var pqlen = userPreQs.length,
                                        pq;

                                    for (i = 0; i < pqlen; i++) {
                                        pq = userPreQs[i];
                                        pool = poolToIdx[pq.get("pool")];

                                        if (!preqs[pool]) {
                                            preqs[pool] = [];
                                        }

                                        preqs[pool].push({
                                            key: pq.id,
                                            name: pq.get("name"),
                                            checked: pq.get("selected")
                                        });
                                    }

                                    var qQuery = new Parse.Query(Quarter);

                                    qQuery.equalTo("user", currentUser);
                                    qQuery.find({
                                        success: function (userQs) {
                                            var qlen = userQs.length,
                                                q;

                                            for (i = 0; i < qlen; i++) {
                                                q = userQs[i];
                                                pool = poolToIdx[q.get("pool")];

                                                if (!qs[pool]) {
                                                    qs[pool] = [];
                                                }

                                                qs[pool].push({
                                                    key: q.id,
                                                    name: q.get("name"),
                                                    checked: q.get("selected")
                                                });
                                            }

                                            var sQuery = new Parse.Query(Semi);

                                            sQuery.equalTo("user", currentUser);
                                            sQuery.find({
                                                success: function (userSs) {
                                                    var slen = userSs.length,
                                                        s;

                                                    for (i = 0; i < slen; i++) {
                                                        s = userSs[i];
                                                        pool = poolToIdx[s.get("pool")];

                                                        if (!ss[pool]) {
                                                            ss[pool] = [];
                                                        }

                                                        ss[pool].push({
                                                            key: s.id,
                                                            name: s.get("name"),
                                                            checked: s.get("selected")
                                                        });
                                                    }

                                                    var fQuery = new Parse.Query(Final);

                                                    fQuery.equalTo("user", currentUser);
                                                    fQuery.find({
                                                        success: function (userFs) {
                                                            var slen = userFs.length,
                                                                f;

                                                            for (i = 0; i < slen; i++) {
                                                                f = userFs[i];
                                                                pool = poolToIdx[f.get("pool")];

                                                                if (!fs[pool]) {
                                                                    fs[pool] = [];
                                                                }

                                                                fs[pool].push({
                                                                    key: f.id,
                                                                    name: f.get("name"),
                                                                    checked: f.get("selected")
                                                                });
                                                            }

                                                            $.ajax({
                                                                url: "../html/tpl/profile.tpl",
                                                                success: function (data) {
                                                                    var template = Handlebars.compile(data),
                                                                        ppGQuery,
                                                                        preqObjQuery,
                                                                        qObjQuery,
                                                                        sObjQuery,
                                                                        fObjQuery;

                                                                    $("#content").html(template({
                                                                        pools: pools,
                                                                        ppGames: ppMatches,
                                                                        prequarters: preqs,
                                                                        quarters: qs,
                                                                        semis: ss,
                                                                        finals: fs,
                                                                        list: teams
                                                                    }));

                                                                    if ($("#preq input:checkbox:checked").length === 8) {
                                                                        $("#preq input:checkbox:not(:checked)").attr("disabled", true);
                                                                    }
                                                                    if ($("#quart input:checkbox:checked").length === 8) {
                                                                        $("#quart input:checkbox:not(:checked)").attr("disabled", true);
                                                                    }
                                                                    if ($("#semis input:checkbox:checked").length === 4) {
                                                                        $("#semis input:checkbox:not(:checked)").attr("disabled", true);
                                                                    }
                                                                    if ($("#finals input:checkbox:checked").length === 2) {
                                                                        $("#finals input:checkbox:not(:checked)").attr("disabled", true);
                                                                    }

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

                                                                    $("#preq input:checkbox").change(function () {
                                                                        var $self = $(this),
                                                                            that = this;

                                                                        preqObjQuery = new Parse.Query(Prequarter);
                                                                        preqObjQuery.get($self.attr("id"), {
                                                                            success: function(preqGame) {
                                                                                preqGame.save({
                                                                                    selected: that.checked
                                                                                }, {
                                                                                    success: function () {
                                                                                        if ($("#preq input:checkbox:checked").length === 8) {
                                                                                            $("#preq input:checkbox:not(:checked)").attr("disabled", true);
                                                                                        }
                                                                                        else {
                                                                                            $("#preq input:checkbox:disabled").removeAttr("disabled");
                                                                                        }
                                                                                    }
                                                                                });
                                                                            }

                                                                        });
                                                                    });

                                                                    $("#quart input:checkbox").change(function () {
                                                                        var $self = $(this),
                                                                            that = this;

                                                                        qObjQuery = new Parse.Query(Quarter);
                                                                        qObjQuery.get($self.attr("id"), {
                                                                            success: function(quartGame) {
                                                                                quartGame.save({
                                                                                    selected: that.checked
                                                                                }, {
                                                                                    success: function () {
                                                                                        if ($("#quart input:checkbox:checked").length === 8) {
                                                                                            $("#quart input:checkbox:not(:checked)").attr("disabled", true);
                                                                                        }
                                                                                        else {
                                                                                            $("#quart input:checkbox:disabled").removeAttr("disabled");
                                                                                        }
                                                                                    }
                                                                                });
                                                                            }

                                                                        });
                                                                    });

                                                                    $("#semis input:checkbox").change(function () {
                                                                        var $self = $(this),
                                                                            that = this;

                                                                        sObjQuery = new Parse.Query(Semi);
                                                                        sObjQuery.get($self.attr("id"), {
                                                                            success: function(semiGame) {
                                                                                semiGame.save({
                                                                                    selected: that.checked
                                                                                }, {
                                                                                    success: function () {
                                                                                        if ($("#semis input:checkbox:checked").length === 4) {
                                                                                            $("#semis input:checkbox:not(:checked)").attr("disabled", true);
                                                                                        }
                                                                                        else {
                                                                                            $("#semis input:checkbox:disabled").removeAttr("disabled");
                                                                                        }
                                                                                    }
                                                                                });
                                                                            }

                                                                        });
                                                                    });

                                                                    $("#finals input:checkbox").change(function () {
                                                                        var $self = $(this),
                                                                            that = this;

                                                                        fObjQuery = new Parse.Query(Final);
                                                                        fObjQuery.get($self.attr("id"), {
                                                                            success: function(finalGame) {
                                                                                finalGame.save({
                                                                                    selected: that.checked
                                                                                }, {
                                                                                    success: function () {
                                                                                        if ($("#finals input:checkbox:checked").length === 2) {
                                                                                            $("#finals input:checkbox:not(:checked)").attr("disabled", true);
                                                                                        }
                                                                                        else {
                                                                                            $("#finals input:checkbox:disabled").removeAttr("disabled");
                                                                                        }
                                                                                    }
                                                                                });
                                                                            }

                                                                        });
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
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

function createCheckBoxes(user, pools, ParsePreQ, ParseQ, ParseSemi, ParseFinal) {
    var i, j,
        plen = pools.length,
        pplen,
        pool,
        team,
        pq, q, s, f,
        pool_key;

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

            pq.save({
                user: user,
                pool: pool_key,
                name: team,
                selected: false
            });

            q.save({
                user: user,
                pool: pool_key,
                name: team,
                selected: false
            });

            s.save({
                user: user,
                pool: pool_key,
                name: team,
                selected: false
            });

            f.save({
                user: user,
                pool: pool_key,
                name: team,
                selected: false
            });
        }
    }
}