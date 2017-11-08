var VisCanvas = (function(){

    //  Settings
    var _this, s = {};
    // Classes
    var viscanvasClass = 'urank-viscanvas',
        viscanvasContainerClass = 'urank-viscanvas-container',
        visCanvasMessageClass = 'urank-viscanvas-message',
        hiddenScrollbarClass = 'urank-hidden-scrollbar',
        hiddenScrollbarInnerClass = 'urank-hidden-scrollbar-inner';
    // Helper
    var $root = $(''), $scrollable = $(''), $visContainer = $('');


    var onScroll = function(event) {
        event.stopPropagation();
        s.onScroll.call(this, _this, $(this).scrollTop());
    };


    function VisCanvas(arguments) {
        _this = this;
        s = $.extend({
            root: '',
            onItemClicked: function(id){},
            onItemMouseEnter: function(id){},
            onItemMouseLeave: function(id){},
            onScroll: function(scroll){}
        }, arguments);
    }


    var _build = function(height, opt) {
        this.height = height;
        $root = $(s.root).empty().addClass(viscanvasClass);

        //  Set scrolling
        if(opt.misc.hideScrollbar) {
            $root.addClass(hiddenScrollbarClass);
            $scrollable = $('<div></div>').appendTo($root).addClass(hiddenScrollbarInnerClass);
        }
        else {
            $scrollable = $root;
        }
        $scrollable.on('scroll', onScroll);
        $visContainer = $('<div></div>').appendTo($scrollable).addClass(viscanvasContainerClass).height(this.height);

        var visModule = VIS_MODULES[opt.module] || VIS_MODULES.ranking;
        this.vis = new visModule($.extend({}, s, { root: '.'+viscanvasContainerClass }, opt.customOpt));
        this.vis.build();

        return this;
    };


    var _update = function(rankingModel, colorScale, listHeight) {
        $scrollable.scrollTo('top');
        this.vis.update(rankingModel, colorScale, listHeight);
        $visContainer.height(this.vis.getHeight());

        return this;
    };

    var _resize = function(listHeight){
        if(this.vis) this.vis.resize(listHeight);
        return this;
    };

    var _clear = function(){
        if(this.vis) this.vis.clear();
    //    $root.append("<p class='" + visCanvasMessageClass + "'>" + STR_NO_VIS + "</p>");
        return this;
    };

    var _reset = function() {
        if(this.vis) this.vis.reset();
        $visContainer.height(this.height);
        return this;
    };

    var _selectItem =function(id) {
        if(this.vis) this.vis.selectItem(id);
        return this;
    };

    var _deselectAllItems =function() {
        if(this.vis) this.vis.deselectAllItems();
        return this;
    };

    var _hoverItem = function(id) {
        if(this.vis) this.vis.hoverItem(id);
        return this;
    };

    var _unhoverItem = function(id) {
        if(this.vis) this.vis.unhoverItem(id);
        return this;
    };

    var _highlightItems = function(idsArray) {
        if(this.vis) this.vis.highlightItems(idsArray);
        return this;
    };

    var _clearEffects = function() {
        if(this.vis) if(this.vis) this.vis.clearEffects();
        $visContainer.css('height', '');
        return this;
    };

    var _destroy = function() {
        if(this.vis) this.vis.clear();
        $root.removeClass(viscanvasClass+' '+hiddenScrollbarClass);
        return this;
    };

    var _scrollTo = function(offset) {
        $scrollable.off('scroll', onScroll)
            .scrollTop(offset)
            .on('scroll', onScroll);
    };


    VisCanvas.prototype = {
        build: _build,
        update: _update,
        clear: _clear,
        reset: _reset,
        resize: _resize,
        selectItem: _selectItem,
        deselectAllItems: _deselectAllItems,
        hoverItem: _hoverItem,
        unhoverItem: _unhoverItem,
        highlightItems: _highlightItems,
        clearEffects: _clearEffects,
        destroy: _destroy,
        scrollTo: _scrollTo
    };

    return VisCanvas;
})();
