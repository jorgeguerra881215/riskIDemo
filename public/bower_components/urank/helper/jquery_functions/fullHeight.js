
(function($) {

    $.fn.fullHeight = function() {
        return $(this).height()
            + parseInt($(this).css('border-top-width').replace('px', ''))
            + parseInt($(this).css('padding-top').replace('px', ''))
            + parseInt($(this).css('border-bottom-width').replace('px', ''))
            + parseInt($(this).css('padding-bottom').replace('px', ''));
    };
}(jQuery));
