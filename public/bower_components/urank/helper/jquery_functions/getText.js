
(function($) {

    $.fn.getText = function() {
        return $(this).clone().children().remove().end().text();
    };
}(jQuery));
