
(function($) {

    $.fn.fullOffset = function() {
        return {
            top: $(this).offset().top + parseInt($(this).css('margin-top').replace('px', '')),
                //  parseInt($(this).css('border-top-width').replace('px', '')) +
                //parseInt($(this).css('padding-top').replace('px', '')) +
            left: $(this).offset().left + parseInt($(this).css('margin-left').replace('px', ''))
                //parseInt($(this).css('border-left-width').replace('px', '')) +
                //parseInt($(this).css('padding-left').replace('px', ''))
        };
    };
}(jQuery));
