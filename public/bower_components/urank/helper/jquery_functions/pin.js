
(function($){

    $.fn.pin = function(args){

        var options = $.extend({
            top: 0,
            left: 0,
            bottom: 0,                  // only if relativeTo != 'none'
            right: 0,                   // only if relativeTo != 'none'
            container: 'window',
            relativeTo: 'parent'        // parent | none | custom selector
        }, args);

/*        var $this = $(this);
        if($this.css('visibility') == 'visible') {

            if(options.relativeTo !== 'none') {
                var $parent = options.relativeTo == 'parent' ? $this.parent() : $(options.relativeTo);
                options.left = options.right ? options.left + $parent.fullOffset().left + $parent.fullWidth() + options.right : options.left + $parent.fullOffset().left;
                options.top = options.bottom ? options.top + $parent.fullOffset().top + $parent.fullHeight() + options.bottom : options.top + $parent.fullOffset().top;
            }

            $this.css({ position: 'fixed', top: options.top, left: options.left, 'z-index': 9999 });

            if(options.container !== 'window') {
                var $container = $(options.container),
                    containerOffset = $container.offset(),
                    containerHeight = $container.height(),
               //     containerWidth = $container.width(),
                    thisOffset = $this.fullOffset(),
                    thisHeight = $this.height();
                 //   thisWidth = $this.width();

                if(thisOffset.top < containerOffset.top || (thisOffset.top + thisHeight) > (containerOffset.top + containerHeight)
                   //|| thisOffset.left < containerOffset.left || (thisOffset.left + thisWidth) > containerOffset.left + containerWidth
                   )
                    $this.css('visibility', 'hidden');
            }
        }
        return $this;*/

        return this.each(function(){
            var $this = $(this);
            if($this.css('visibility') == 'visible') {

                if(options.relativeTo !== 'none') {
                    var $parent = options.relativeTo == 'parent' ? $this.parent() : $(options.relativeTo);
                    options.left = options.right ? options.left + $parent.fullOffset().left + $parent.fullWidth() + options.right : options.left + $parent.fullOffset().left;
                    options.top = options.bottom ? options.top + $parent.fullOffset().top + $parent.fullHeight() + options.bottom : options.top + $parent.fullOffset().top;
                }

                $this.css({ position: 'fixed', top: options.top, left: options.left, 'z-index': 9999 });

                if(options.container !== 'window') {
                    var $container = $(options.container),
                        containerOffset = $container.offset(),
                        containerHeight = $container.height(),
                        //     containerWidth = $container.width(),
                        thisOffset = $this.fullOffset(),
                        thisHeight = $this.height();
                    //   thisWidth = $this.width();

                    if(thisOffset.top < containerOffset.top || (thisOffset.top + thisHeight) > (containerOffset.top + containerHeight)
                       /*|| thisOffset.left < containerOffset.left || (thisOffset.left + thisWidth) > containerOffset.left + containerWidth */)
                        $this.css('visibility', 'hidden');
                }
            }
            return $this;
        });

    };

})(jQuery);
