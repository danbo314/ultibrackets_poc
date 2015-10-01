/**
 * Created by Dan Bolivar on 5/18/15.
 */

(function ($) {

    Parse.initialize("AxAhmixCD23l9oxpKc02kJewBmdDt5UQ159RB7ni", "Xoypi5WdNOe5V0xGALSUvvFlbAqwE8TeX89TkFeL");

    Handlebars.registerHelper("place", function (index){
        return index + 1;
    });

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
                { label: "Pool A", pool: ["Revolver (1)", "Machine (8)", "Patrol (12)", "Madison Club (13)"] },
                { label: "Pool B", pool: ["Doublewide (2)", "Rhino (7)", "Ring of Fire (11)", "Sub Zero (14)"] },
                { label: "Pool C", pool: ["Sockeye (3)", "Truck Stop (6)", "Florida United (10)", "GOAT (15)"] },
                { label: "Pool D", pool: ["High Five (4)", "Johnny Bravo (5)", "Ironside (9)", "Prairie Fire (16)"] }
            ],
            teams = ["-- Select your winner --","Revolver (1)","Doublewide (2)","Sockeye (3)","High Five (4)","Johnny Bravo (5)","Truck Stop (6)","Rhino (7)","Machine (8)",
                "Ironside (9)","Florida United (10)","Ring of Fire (11)","Patrol (12)","Madison Club (13)","Sub Zero (14)","GOAT (15)","Prairie Fire (16)"],
            poolToIdx = {
                A: 0,
                B: 1,
                C: 2,
                D: 3
            },
            contentMap = {
                profile: function () {
                    $("#content").html("<img src='../img/loader.gif'/>");
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

                                                            var listArr = [],
                                                                currentWinner = currentUser.get("winner"),
                                                                tlen = teams.length,
                                                                i, t,
                                                                temp;

                                                            for (i = 0; i < tlen; i ++) {
                                                                t = teams[i];
                                                                temp = {};

                                                                if (i === 0) {
                                                                    temp.disabled = true;
                                                                    temp.selected = currentWinner ? false : true;
                                                                }
                                                                else {
                                                                    temp.disabled = false;
                                                                    temp.selected = currentWinner === t;
                                                                }
                                                                temp.val = t;

                                                                listArr.push(temp);
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
                                                                        list: listArr
                                                                    }));

                                                                    if (currentUser.get("disabled")) {
                                                                        $("#content input:checkbox").attr("disabled", true);
                                                                        $("#content input:checkbox + span").css("opacity", .4);
                                                                        $("#content select").attr("disabled", true);
                                                                        $(".ppGame").addClass("disabled");
                                                                    }
                                                                    else {
                                                                        if ($("#preq input:checkbox:checked").length === 8) {
                                                                            $("#preq input:checkbox:not(:checked)").attr("disabled", true);
                                                                            $("#preq input:checkbox:not(:checked) + span").css("opacity", .4);
                                                                        }
                                                                        if ($("#quart input:checkbox:checked").length === 8) {
                                                                            $("#quart input:checkbox:not(:checked)").attr("disabled", true);
                                                                            $("#quart input:checkbox:not(:checked) + span").css("opacity", .4);
                                                                        }
                                                                        if ($("#semis input:checkbox:checked").length === 4) {
                                                                            $("#semis input:checkbox:not(:checked)").attr("disabled", true);
                                                                            $("#semis input:checkbox:not(:checked) + span").css("opacity", .4);
                                                                        }
                                                                        if ($("#finals input:checkbox:checked").length === 2) {
                                                                            $("#finals input:checkbox:not(:checked)").attr("disabled", true);
                                                                            $("#finals input:checkbox:not(:checked) + span").css("opacity", .4);
                                                                        }
                                                                    }

                                                                    $(".ppGame:not(.disabled)").click(function () {
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
                                                                                ppGame.set(fieldT, true);
                                                                                ppGame.set(fieldF, false);
                                                                                ppGame.save();

                                                                                if (currentUser.get("name") === "results") {
                                                                                    var resPPGQuery = new Parse.Query(PoolPlayGame);

                                                                                    resPPGQuery.equalTo("ppgID", ppGame.get("ppgID"));
                                                                                    resPPGQuery.notEqualTo("name", "results");
                                                                                    resPPGQuery.find({
                                                                                        success: function (ppGames) {
                                                                                            var glen = ppGames.length,
                                                                                                i,
                                                                                                user,
                                                                                                game;

                                                                                            for (i = 0; i < glen; i++) {
                                                                                                game = ppGames[i];

                                                                                                if (game.get(fieldT)) {
                                                                                                    user = game.get("user");
                                                                                                    user.fetch({
                                                                                                        success: function (cUser) {
                                                                                                            Parse.Cloud.run('incrementUserScore', { userId: cUser.id, weight: 1 }, {
                                                                                                                success: function () {},
                                                                                                                error: function () {}
                                                                                                            });
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    });
                                                                                }
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
                                                                                            $("#preq input:checkbox:not(:checked) + span").css("opacity",.4);
                                                                                        }
                                                                                        else {
                                                                                            $("#preq input:checkbox:disabled + span").css("opacity", 1);
                                                                                            $("#preq input:checkbox:disabled").removeAttr("disabled");
                                                                                        }
                                                                                    }
                                                                                });

                                                                                if (currentUser.get("name") === "results" && that.checked) {
                                                                                    console.log("inside check");
                                                                                    var resPQQuery = new Parse.Query(Prequarter);

                                                                                    resPQQuery.equalTo("name", preqGame.get("name"));
                                                                                    resPQQuery.notEqualTo("name", "results");
                                                                                    resPQQuery.find({
                                                                                        success: function (pqGames) {
                                                                                            console.log(pqGames);
                                                                                            var glen = pqGames.length,
                                                                                                i,
                                                                                                user,
                                                                                                game;

                                                                                            for (i = 0; i < glen; i++) {
                                                                                                game = pqGames[i];

                                                                                                if (game.get("selected")) {
                                                                                                    user = game.get("user");
                                                                                                    user.fetch({
                                                                                                        success: function (cUser) {
                                                                                                            Parse.Cloud.run('incrementUserScore', { userId: cUser.id, weight: 2 }, {
                                                                                                                success: function () {},
                                                                                                                error: function () {}
                                                                                                            });
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    });
                                                                                }
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
                                                                                            $("#quart input:checkbox:not(:checked) + span").css("opacity", .4);
                                                                                        }
                                                                                        else {
                                                                                            $("#quart input:checkbox:disabled + span").css("opacity", 1);
                                                                                            $("#quart input:checkbox:disabled").removeAttr("disabled");
                                                                                        }
                                                                                    }
                                                                                });

                                                                                if (currentUser.get("name") === "results" && that.checked) {
                                                                                    var resQQuery = new Parse.Query(Quarter);

                                                                                    resQQuery.equalTo("name", quartGame.get("name"));
                                                                                    resQQuery.notEqualTo("name", "results");
                                                                                    resQQuery.find({
                                                                                        success: function (qGames) {
                                                                                            var glen = qGames.length,
                                                                                                i,
                                                                                                user,
                                                                                                game;

                                                                                            for (i = 0; i < glen; i++) {
                                                                                                game = qGames[i];

                                                                                                if (game.get("selected")) {
                                                                                                    user = game.get("user");
                                                                                                    user.fetch({
                                                                                                        success: function (cUser) {
                                                                                                            Parse.Cloud.run('incrementUserScore', { userId: cUser.id, weight: 3 }, {
                                                                                                                success: function () {},
                                                                                                                error: function () {}
                                                                                                            });
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    });
                                                                                }
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
                                                                                            $("#semis input:checkbox:not(:checked) + span").css("opacity",.4);
                                                                                        }
                                                                                        else {
                                                                                            $("#semis input:checkbox:disabled + span").css("opacity", 1);
                                                                                            $("#semis input:checkbox:disabled").removeAttr("disabled");
                                                                                        }
                                                                                    }
                                                                                });

                                                                                if (currentUser.get("name") === "results" && that.checked) {
                                                                                    var resSQuery = new Parse.Query(Semi);

                                                                                    resSQuery.equalTo("name", semiGame.get("name"));
                                                                                    resSQuery.notEqualTo("name", "results");
                                                                                    resSQuery.find({
                                                                                        success: function (sGames) {
                                                                                            var glen = sGames.length,
                                                                                                i,
                                                                                                user,
                                                                                                game;

                                                                                            for (i = 0; i < glen; i++) {
                                                                                                game = sGames[i];

                                                                                                if (game.get("selected")) {
                                                                                                    user = game.get("user");
                                                                                                    user.fetch({
                                                                                                        success: function (cUser) {
                                                                                                            Parse.Cloud.run('incrementUserScore', { userId: cUser.id, weight: 5 }, {
                                                                                                                success: function () {},
                                                                                                                error: function () {}
                                                                                                            });
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    });
                                                                                }
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
                                                                                            $("#finals input:checkbox:not(:checked) + span").css("opacity",.4);
                                                                                        }
                                                                                        else {
                                                                                            $("#finals input:checkbox:disabled + span").css("opacity", 1);
                                                                                            $("#finals input:checkbox:disabled").removeAttr("disabled");
                                                                                        }
                                                                                    }
                                                                                });

                                                                                if (currentUser.get("name") === "results" && that.checked) {
                                                                                    var resFQuery = new Parse.Query(Final);

                                                                                    resFQuery.equalTo("name", finalGame.get("name"));
                                                                                    resFQuery.notEqualTo("name", "results");
                                                                                    resFQuery.find({
                                                                                        success: function (fGames) {
                                                                                            var glen = fGames.length,
                                                                                                i,
                                                                                                user,
                                                                                                game;

                                                                                            for (i = 0; i < glen; i++) {
                                                                                                game = fGames[i];

                                                                                                if (game.get("selected")) {
                                                                                                    user = game.get("user");
                                                                                                    user.fetch({
                                                                                                        success: function (cUser) {
                                                                                                            Parse.Cloud.run('incrementUserScore', { userId: cUser.id, weight: 10 }, {
                                                                                                                success: function () {},
                                                                                                                error: function () {}
                                                                                                            });
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    });
                                                                                }
                                                                            }

                                                                        });
                                                                    });

                                                                    $("#winner select").change(function () {
                                                                        var winner = $(this).find(":selected").val();

                                                                        currentUser.save({
                                                                            winner: winner
                                                                        });

                                                                        if (currentUser.get("name") === "results") {
                                                                            var resWQuery = new Parse.Query(Parse.User);

                                                                            resWQuery.notEqualTo("name", "results");
                                                                            resWQuery.find({
                                                                                success: function (users) {
                                                                                    var ulen = users.length,
                                                                                        i, user;

                                                                                    for (i = 0; i < ulen; i++) {
                                                                                        user = users[i];

                                                                                        if (user.get("winner") === winner) {
                                                                                            Parse.Cloud.run('incrementUserScore', { userId: user.id, weight: 15 }, {
                                                                                                success: function () {},
                                                                                                error: function () {}
                                                                                            });
                                                                                        }
                                                                                    }
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
                                }
                            });
                        }
                    });
                },
                leaderboard: function () {
                    $("#content").html("<img src='../img/loader.gif'/>");
                    var userQuery = new Parse.Query(Parse.User);

                    userQuery.notEqualTo("name", "results");
                    userQuery.find({
                        success: function (users) {
                            var scoreArray = [],
                                ulen = users.length,
                                i, user;

                            for (i = 0; i < ulen; i++) {
                                user = users[i];

                                scoreArray.push({
                                    points: user.get("score"),
                                    name: user.get("name"),
                                    winner: user.get("winner")
                                });
                            }

                            scoreArray.sort(function (a,b) {
                                if (a.points > b.points) {
                                    return -1;
                                }
                                if (a.points < b.points) {
                                    return 1;
                                }
                                return 0;
                            });

                            $.ajax({
                                url: "../html/tpl/leaderboard.tpl",
                                success: function (data) {
                                    var template = Handlebars.compile(data);

                                    $("#content").html(template({
                                        users: scoreArray
                                    }));
                                }
                            });
                        }
                    });
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
        i, j, k = 0,
        ParseGame;

    for (i = 0; i < plen; i++) {
        for (j = i+1; j < plen; j++) {
            //create new Parse object
            ParseGame = new ParsePPGame();
            ParseGame.save({
                user: user,
                pool: poolKey,
                ppgID: poolKey+"_"+k,
                t1: pool[i],
                t2: pool[j],
                t1Selected: false,
                t2Selected: false,
                disabled: user.get("disabled")
            });

            k++;
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
