/**
 * Created by Dan Bolivar on 5/18/15.
 */

(function ($) {

    Parse.initialize("AxAhmixCD23l9oxpKc02kJewBmdDt5UQ159RB7ni", "Xoypi5WdNOe5V0xGALSUvvFlbAqwE8TeX89TkFeL");

    var currentUser = Parse.User.current();

    if (currentUser) {
        var initDOMHandlers = function () {
                $("#logout").click(function() {
                    Parse.User.logOut();
                    window.location.href = "../index.html";
                });
            },
            pools = [
                { label: "Pool A", pool: ["Pittsburgh (1)", "Georgia (8)", "Wisconsin (12)", "Texas (13)", "Auburn (17)"] },
                { label: "Pool B", pool: ["Texas A&M (2)", "Central Florida (7)", "Minnesota (11)", "Western Washington (14)", "Cincinnati (18)"] },
                { label: "Pool C", pool: ["North Carolina (3)", "Florida State (6)", "Maryland (10)", "Oregon (15)", "Illinois (19)"] },
                { label: "Pool D", pool: ["North Carolina-Wilmington (4)", "Colorado (5)", "Massachusetts (9)", "California-Santa Barbara (13)", "Cornell (20)"] }
            ],
            contentMap = {
                profile: function () {
                    var matchups = [],
                        plen = pools.length,
                        i,
                        matchMap;

                    for (i = 0; i < plen; i++) {
                        matchMap = getMatchups(pools[i].pool, pools[i].label.slice(-1));
                        //TODO: CHECK MAP AGAINST RETURN FROM PARSE DATA STORAGE HERE
                        matchups.push(convertMatchups(matchMap));
                    }

                    console.log(matchups);

                    $.ajax({
                        url: "../html/tpl/profile.tpl",
                        success: function (data) {
                            var template = Handlebars.compile(data);

                            $("#content").html(template({
                                pools: pools,
                                ppGames: matchups
                            }));
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

function getMatchups(pool, pool_key) {
    var plen = pool.length,
        i, j, k = 1,
        matchups = {},
        key;

    for (i = 0; i < plen; i++) {
        for (j = i+1; j < plen; j++) {
            key = pool_key+"_"+k;
            matchups[key] = {
                t1: pool[i],
                t2: pool[j]
            };
            k++;
        }
    }
}

function convertMatchups(matchups) {
    var temp = [],
        key;

    for (key in matchups) {
        temp.push(matchups[key]);
    }

    return temp;
}