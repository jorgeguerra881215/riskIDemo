
(function($) {

    $.fn.fullWidth = function() {
        return $(this).width()
            + parseInt($(this).css('border-left-width').replace('px', ''))
            + parseInt($(this).css('padding-left').replace('px', ''))
            + parseInt($(this).css('border-right-width').replace('px', ''))
            + parseInt($(this).css('padding-right').replace('px', ''));
    };
}(jQuery));
