/**
 * Created by Dan Bolivar on 5/18/15.
 */

(function ($) {

    Parse.initialize("AxAhmixCD23l9oxpKc02kJewBmdDt5UQ159RB7ni", "Xoypi5WdNOe5V0xGALSUvvFlbAqwE8TeX89TkFeL");

    var currentUser = Parse.User.current();

    if (currentUser) {
        $.ajax({
            url: "../html/tpl/user.tpl",
            success: function (data) {
                var template = Handlebars.compile(data);

                $("#test").html(template(currentUser.attributes));
            }
        });
    }
    else {
        window.location.href = "../index.html";
    }

}(jQuery));