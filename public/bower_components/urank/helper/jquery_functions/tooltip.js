
(function($) {

    $.fn.tooltip = function(options) {

        var tooltipClass = 'urank-tooltip';

        var $this = $(this);


        if(typeof options == 'string' && options == 'destroy'){


        } else if(typeof options == 'object') {
            var s = $.extend({
                title: null,
                message: '',
                position: 'right',      //  right | left | top | bottom
                type: 'default',        //  default | info |
                root: 'body'


            }, options);


            $tooltip = $('<div></div>', { class: tooltipClass }).appendTo($this);









        }


        return $this;
    };
}(jQuery));
