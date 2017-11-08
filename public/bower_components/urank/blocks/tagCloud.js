var TagCloud = (function(){

    var _this, $root = $('');
    // Settings
    var s = {};
    //  Classes
    var tagcloudClass = 'urank-tagcloud',
        tagClass = 'urank-tagcloud-tag';


    //  Constructor
    function TagCloud(arguments) {
        _this = this;
        s = $.extend({
            root: '',
            onTagInCloudMouseEnter: function(index){},
            onTagInCloudMouseLeave: function(index){},
            onTagInCloudClick: function(index){},
            onDocumentHintClick: function(index){},
            onKeywordHintMouseEnter : function(index){},
            onKeywordHintMouseLeave : function(index){},
            onKeywordHintClick : function(index){}
        }, arguments);
    }


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  Prototype methods

    /**
    * * @param {array of objects} keywords Description
    */
    var _build = function(keywords, data, colorScale, opt, keywordsDict){

        // Empty tag container and add appropriateclass
        $root = $(s.root).empty().addClass(tagcloudClass);

        var tagcloudModule = TAGCLOUD_MODULES[opt.module] || TAGCLOUD_MODULES.default;
        this.tagcloud = new tagcloudModule(s);
        this.tagcloud.clear();
        var options = $.extend(opt.misc, { draggableClass: tagClass })
        /**
         * Modified by Jorch
         */
        keywords = keywords.slice(0,10);
        //console.log(keywords);
        //console.log(keywordsDict);
        //*******************************//
        this.tagcloud.build(keywords, data, colorScale, options, keywordsDict);
    };

    var periodicity_filter = function(keywords){
        var dict_aux = {};
        var rep_sP = /[a-i]/;
        var rep_wP = /[A-I]/;
        keywords.forEach(function(item,index){
            var stem = item.stem;
            var i = stem.length;
            var letter = '';
            var count = 0;
            while(i--){
                letter = stem[i];
                if(rep_sP.test(letter)){
                    count +=1;
                }
                if(rep_wP.test(letter)){
                    count +=0.5;
                }
            }
            count in dict_aux ? dict_aux[count].push(item) : dict_aux[count] = [item];
        });
        var keys = Object.keys(dict_aux);
        keys.sort();
        var result = [];
        for (var i = keys.length-1; i >= 0; i--) {
            result = result.concat(dict_aux[keys[i]]);
        }
        return result;
    }

    /**
     * Modified by Jorch
     * @param keywords
     * @param data
     * @param colorScale
     * @param opt
     * @param keywordsDict
     * @private
     */
    var _build = function(keywords, data, colorScale, opt, keywordsDict, number_minDocFrequency,number_pattern,length_of_sequences,order_by_periodicity){

        // Empty tag container and add appropriateclass
        $root = $(s.root).empty().addClass(tagcloudClass);

        var tagcloudModule = TAGCLOUD_MODULES[opt.module] || TAGCLOUD_MODULES.default;
        this.tagcloud = new tagcloudModule(s);
        this.tagcloud.clear();
        var options = $.extend(opt.misc, { draggableClass: tagClass })
        /**
         * Modified by Jorch
         */
        var tagsClouds = [];
        if(typeof number_minDocFrequency !== "undefined"){
            //console.log('entro al nuevo !!!!!');
            keywords.forEach(function(item,index){
               if(item.inDocument.length >= number_minDocFrequency && item.repeated >= number_pattern && item.stem.length == length_of_sequences){
                   tagsClouds.push(item);
               }
            });
            tagsClouds = tagsClouds.slice(0,100);
            if(order_by_periodicity != undefined && order_by_periodicity){
                tagsClouds = periodicity_filter(tagsClouds);
            }
            //console.log('numeor de stf connections: '+number_minDocFrequency);
            //tagsClouds = periodicity_filter(tagsClouds);
            this.tagcloud.build(tagsClouds, data, colorScale, options, keywordsDict);
        }
        else{
            keywords = keywords.slice(0,100);
            /*console.log('entro al normal');
            console.log(keywords);*/
            //console.log(keywordsDict);
            //*******************************//
            this.tagcloud.build(keywords, data, colorScale, options, keywordsDict);
        }

    };



    var _reset = function() {
        if(this.tagcloud) this.tagcloud.reset();
    };


    var _restoreTag = function(index){
        if(this.tagcloud) this.tagcloud.restoreTag(index);
    };


    var _hoverTag = function(index) {
        if(this.tagcloud) this.tagcloud.hoverTag(index);
    };


    var _unhoverTag = function(index) {
        if(this.tagcloud) this.tagcloud.unhoverTag(index);
    };


    var _tagClicked = function(index) {
        if(this.tagcloud) this.tagcloud.tagClicked(index);
    };


    var _keywordHintMouseEntered = function(index) {
        if(this.tagcloud) this.tagcloud.keywordHintMouseEntered(index);
    };


    var _keywordHintMouseLeft = function(index) {
        if(this.tagcloud) this.tagcloud.keywordHintMouseLeft(index);
    };


    var _keywordHintClicked = function(index) {
        if(this.tagcloud) this.tagcloud.keywordHintClicked(index);
    };



    var _documentHintClicked = function(index) {
        if(this.tagcloud) this.tagcloud.documentHintClicked(index);
    };



    var _clearEffects = function() {
        if(this.tagcloud) this.tagcloud.clearEffects();
    };


    var _clear = function() {
        if(this.tagcloud) this.tagcloud.clear();
    };


    var _destroy = function() {
        if(this.tagcloud) this.tagcloud.destroy();
        $root.removeClass(tagcloudClass);
    };


    TagCloud.prototype = {
        build: _build,
        reset: _reset,
        restoreTag: _restoreTag,
        hoverTag: _hoverTag,
        tagClicked:_tagClicked,
        unhoverTag: _unhoverTag,
        keywordHintClicked: _keywordHintClicked,
        keywordHintMouseEntered: _keywordHintMouseEntered,
        keywordHintMouseLeft: _keywordHintMouseLeft,
        documentHintClicked: _documentHintClicked,
        clearEffects: _clearEffects,
        clear: _clear,
        destroy: _destroy
    };

    return TagCloud;
})();

