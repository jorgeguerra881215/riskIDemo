var DocViewer = (function(){

    var _this;
    // Settings
    var s = {};
    // Classes
    var docViewerContainerClass = 'urank-docviewer-container',
        defaultDocViewerContainerClass = 'urank-docviewer-container-default',
        detailsSectionClass = 'urank-docviewer-details-section',
        contentSectionOuterClass = 'urank-docviewer-content-section-outer',
        contentSectionClass = 'urank-docviewer-content-section';
    // Id prefix
    var detailItemIdPrefix = '#urank-docviewer-details-';
    // Selectors
    var $root = $(''),
        $detailsSection = $(''),
        $contentSection = $('');
    // Helper
    var customScrollOptions = {
        axis: 'y',
        theme: 'light',
        //scrollbarPosition: 'outside',
        autoHideScrollbar: true,
        scrollEasing: 'linear',
        mouseWheel: {
            enable: true,
            axis: 'y'
        },
        keyboard: {
            enable: true
        },
        advanced: {
            updateOnContentResize: true
        }
    };

    /**
     * Modified by Jorch
     */
    var _document,_keywords,_colorScale = '';
    var _list  = new ContentList();
    var _selectedKeywords = [];
    var counter = 0;
    var _selectedConnection = [];
    var _periodicity_color = ['#9d5600', '#ff8c00', '#ffaf4e', '#ffe4c4'];
    //var fs = require("fs");

    function DocViewer(arguments) {
        s = $.extend({
            root: ''
        }, arguments);
    }
    /**
     * Modified by Jorch
     */
    var saveLabel = function saveLabelBton(document_id,event){
        var label = $('#label-text').val();
        var observation = $('#urank-docviewer-labeling-text').val();
        _document = urank.getDocumentById(document_id);
        if(_document != '' != label != ''){

            var terms = '';
            _selectedKeywords.map(function(sk){ terms = terms+'  ' + sk.term + '('+sk.weight+')' });
            _document.terms = terms;

            _document.title = label;
            _document.keyword = terms;
            _document.observation = observation;
            _showDocument(_document,_keywords,_colorScale);
            $('#label-text').val(label);
            var label_list = $("#contentlist ul li[urank-id='"+_document.id+"'] h3");
            //label_list.html(_document.title);
            label_list.attr('title',_document.title+'\n'+_document.description);




            //list.build(_keywords,null);
            /*s.readFile('test.json', 'utf8', function(err,data){
             console.log(data);
             });*/
            //Write info in data.txt file using php script
            /*var scriptURL = 'http://localhost/loginapp/server/save.php',
                date = new Date(),
                timestamp = date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate() + '_' + date.getHours() + '.' + date.getMinutes() + '.' + date.getSeconds(),
                urankState = urank.getCurrentState(),
                gf = [{ filename: 'urank_labeled_' + timestamp + '.txt', content: JSON.stringify(urankState) }];//JSON.stringify(urankState)

            $.generateFile({ filename: "bookmarks.json", content: JSON.stringify(urankState), script: scriptURL });*/

            //Saving logs register
            urank.enterLog('Label '+label+','+_document.id);

            urank.selectMultipleListItem();

            return false;
        }
    }


    /**
     * Created by Jorch
     * Labeling connections like Botnet
     */
    var saveBotnetLabel = function saveLabelBton(event,document_id){
        console.log('Etiquetando como botnet la connection '+document_id);
        var documentId = document_id != null ? document_id : _document.id;
        $('#label-text').val("Botnet");
        //changing a color
        $("[urank-span-id='"+documentId+"']").removeClass('yellow-circle');
        $("[urank-span-id='"+documentId+"']").removeClass('green-circle');
        $("[urank-span-id='"+documentId+"']").addClass('red-circle');

        $("#index-label-"+document_id).removeClass('unlabelled');
        $("#index-label-"+document_id).removeClass('normal');
        $("#index-label-"+document_id).addClass('botnet');

        $('#urank-label-button-botnet-'+document_id).prop('disabled', true);
        $('#urank-label-button-botnet-'+document_id).removeClass('non-opacity');
        $('#urank-label-button-botnet-'+document_id).addClass('opacity');

        $('#urank-label-button-normal-'+document_id).prop('disabled', false);
        $('#urank-label-button-normal-'+document_id).removeClass('opacity');
        $('#urank-label-button-normal-'+document_id).addClass('non-opacity');

        $('span#label-'+document_id).html('Botnet');

        keepElementFocus();
        urank.updateLabelDictionary(document_id, label = 'Botnet');
        saveLabel(document_id,event);

    }

    /**
     * Created by Jorch
     * Labeling connections like Normal
     */
    var saveNormalLabel = function saveLabelBton(event,document_id){
        console.log('Etiquetando como normal la connection '+document_id);
        var documentId = document_id != null ? document_id : _document.id;
        $('#label-text').val("Normal");
        //changing a color

        $("[urank-span-id='"+documentId+"']").removeClass('yellow-circle');
        $("[urank-span-id='"+documentId+"']").removeClass('red-circle');
        $("[urank-span-id='"+documentId+"']").addClass('green-circle');

        $("#index-label-"+document_id).removeClass('unlabelled');
        $("#index-label-"+document_id).removeClass('botnet');
        $("#index-label-"+document_id).addClass('normal');

        $('#urank-label-button-normal-'+document_id).prop('disabled', true);
        $('#urank-label-button-normal-'+document_id).removeClass('non-opacity');
        $('#urank-label-button-normal-'+document_id).addClass('opacity');

        $('#urank-label-button-botnet-'+document_id).prop('disabled', false);
        $('#urank-label-button-botnet-'+document_id).removeClass('opacity');
        $('#urank-label-button-botnet-'+document_id).addClass('non-opacity');

        $('span#label-'+document_id).html('Normal');

        keepElementFocus();
        urank.updateLabelDictionary(document_id, label = 'Normal');
        saveLabel(document_id,event);
    }

    var keepElementFocus = function(){
        _list.selectListItem(_document.id);
        event.stopPropagation();
    }

    /**
     * Created by Jorch
     * Labeling connections like Normal
     */
    var hideUnrankedListItems = function() {

        if(_this.status !== RANKING_STATUS.no_ranking) {
            _this.data.forEach(function(d){
                var display = d.rankingPos > 0 ? '' : 'none';
                //$(liItem + '' + d.id).css('display', display);
                $('.'+liClass+'['+urankIdAttr+'="'+d.id+'"]').css('display', display);
            });
            $ul.addClass(ulPaddingBottomclass);
        }
        _this.multipleHighlightMode = false;
    };

    var _build = function(opt) {

        this.opt = opt.misc;

        var containerClasses = (this.opt.defaultBlockStyle) ? docViewerContainerClass +' '+ defaultDocViewerContainerClass : docViewerContainerClass;
        $root = $(s.root).empty().addClass(containerClasses);

        // Append details section, label and connection details
        $detailsSection = $("<div id='doc-viewer-detail' style='display: none' class='" + detailsSectionClass + "'></div>").appendTo($root);
        var $infoSection = $("<div id='doc-viewer-info'></div>").appendTo($detailsSection);

        //user section
        var $userSection = $('<div id="doc-user-section"></div>').appendTo($infoSection);
        $("<div id='doc-user-section-logo'></div>").appendTo($userSection);

        //Label section
        var $labelContainer = $('<div id="doc-label-section"></div>').appendTo($infoSection);
        $("<div id='doc-label-container'><label id='urank-docviewer-details-label' class='urank-docviewer-attributes'></label></div>").appendTo($labelContainer);
        $('<div id="doc-word-container"></div>').appendTo($infoSection);
        //$("<div id='urank-docviewer-details-title'></div>").appendTo($titleContainer);
        //$("<label id='urank-docviewer-details-label' class='urank-docviewer-attributes'></label>").appendTo($labelContainer);
        $("<div style='clear: both'></div>").appendTo($infoSection);

        /**
         * Modified by Jorch
         */
        //Section to show connection info
        var $titleContainer = $('<div class="doc-attributes-sontainer"></div>').appendTo($infoSection);
        $("<input type='checkbox' id='filter-initial-port' name='connection-attribute' value='initial-ip'><label>Ip Origin:</label>").appendTo($titleContainer);
        $("<label id='urank-docviewer-details-initport' class='urank-docviewer-attributes'></label>").appendTo($titleContainer);
        var $titleContainer = $('<div class="doc-attributes-sontainer"></div>').appendTo($infoSection);
        $("<input type='checkbox' id='filter-end-port' name='connection-attribute' value='end-ip'><label>Ip Dest:</label>").appendTo($titleContainer);
        $("<label id='urank-docviewer-details-destport' class='urank-docviewer-attributes'></label>").appendTo($titleContainer);
        var $titleContainer = $('<div class="doc-attributes-sontainer"></div>').appendTo($infoSection);
        $("<input type='checkbox' id='filter-port' name='connection-attribute' value='port'><label>Port:</label>").appendTo($titleContainer);
        $("<label id='urank-docviewer-details-port' class='urank-docviewer-attributes'></label>").appendTo($titleContainer);
        var $titleContainer = $('<div class="doc-attributes-sontainer"></div>').appendTo($infoSection);
        $("<input type='checkbox' id='filter-protocol' name='connection-attribute' value='protocol'><label>Protocol:</label>").appendTo($titleContainer);
        $("<label id='urank-docviewer-details-protocol' class='urank-docviewer-attributes'></label>").appendTo($titleContainer);

        //Dividing section
        $("<div class='urank-docviewer-divisor'></div>").appendTo($infoSection);

        var $titleContainer = $('<div></div>').appendTo($detailsSection);
        $("<div id='urank-docviewer-labeling'>" +
            "<input type='text' placeholder='Add new label...' id='label-text' style='display: none'>" +
            "<label>Tell us why you select this label:</label>"+
            "<textarea id='urank-docviewer-labeling-text' rows='5'></textarea>"+
            "<button id='urank-label-button-botnet'>Botnet</button>" +
            "<button id='urank-label-button-normal' style='float: right'>Normal</button>" +
            "</div>").appendTo($titleContainer);
        $('#urank-label-button-botnet').click(saveBotnetLabel);
        $('#urank-label-button-normal').click(saveNormalLabel);
        $('#urank-docviewer-labeling-text').click(keepElementFocus);

        //Dividing section
        $("<div class='urank-docviewer-divisor'></div>").appendTo($titleContainer);

        $('input[type=checkbox][name=connection-attribute]').change(function() {
            urank.findNotLabeled(this.value,this.filter);
            console.log('vemos cuanto demora !!!! :)');
        });

        this.opt.facetsToShow.forEach(function(facetName){
            var $facetContainer = $('<div></div>').appendTo($detailsSection);
            $("<label>" + facetName.capitalizeFirstLetter() + ":</label>").appendTo($facetContainer);
            $("<span id='urank-docviewer-details-" + facetName + "'></span>").appendTo($facetContainer);
        });

        // Append content section for snippet placeholder
        //var $contentSectionOuter = $('<div style="height: 200px"></div>').appendTo($root).addClass(contentSectionOuterClass);
        $contentSection = $('<div id="tabs" style="height: 160px; display: none"></div>').appendTo($root).addClass(contentSectionOuterClass); //$('<div></div>').appendTo($contentSectionOuter).addClass(contentSectionClass);

        $('<ul><li><a href="#tabs-1">Letter</a></li><li><a href="#tabs-2">Connection Sequence</a></li></ul>').appendTo($contentSection);
        var $contentTab1 = $('<div id="tabs-1"></div>').appendTo($contentSection);
        var $p = $('<p id="contentTabs-1"></p>').appendTo($contentTab1);
        var $contentTab2 = $('<div id="tabs-2"></div>').appendTo($contentSection);
        $('<p id="contentTabs-2"></p>').appendTo($contentTab2);
        $( "#tabs" ).tabs();

        //$('<p></p>').appendTo($contentSection);

        //Statistic section
        var $statisticSection = $("<div id='doc-viewer-statistic' style='display: none'></div>").appendTo($root);
        $("<div id='doc-viewer-top'></div>").appendTo($statisticSection);
        $("<div id='doc-viewer-left'></div>").appendTo($statisticSection);


        $root.on('mousedown', function(event){ event.stopPropagation(); });

        /*if(this.opt.customScrollBars)
            $contentSectionOuter.css('overflowY', 'hidden').mCustomScrollbar(customScrollOptions);*/




    };




    /**
     * @private
     * Description
     * @param {type} document Description
     * @param {Array} keywords (only stems)
     */
    var _showDocument = function(document, keywords, colorScale, connection_unlabelled, heatmap){
        /**
         * Modified by Jorch
         */
        _document = document;
        _keywords = keywords;
        _colorScale = colorScale;
        //$('#doc-viewer-detail').css('display','block');
        var port_info = document.connection_id.split("-");
        var init_port = port_info[0];
        var dest_port = port_info[1];
        var port = port_info[2];
        var protocol = port_info[3];
        $('#label-text').val('');
        $('#urank-docviewer-labeling-text').val(_document.observation);
        $(detailItemIdPrefix + 'initport').html(getStyledText(init_port, keywords, colorScale));
        $(detailItemIdPrefix + 'destport').html(getStyledText(dest_port, keywords, colorScale));
        $(detailItemIdPrefix + 'port').html(getStyledText(port, keywords, colorScale));
        $(detailItemIdPrefix + 'protocol').html(getStyledText(protocol, keywords, colorScale));
        $('#filter-initial-port').attr('value',init_port);
        $('#filter-end-port').attr('value',dest_port);
        $('#filter-port').attr('value',port);
        $('#filter-protocol').attr('value',protocol);
        //$('#urank-label-button-normal').prop('disabled', true);
        var bton_bot = $('#urank-label-button-botnet');
        var bton_norm = $('#urank-label-button-normal');
        switch (document.title){
            case 'Botnet':
                bton_bot.css('opacity',0.5);
                bton_bot.prop('disabled', true);
                bton_norm.css('opacity',1);
                bton_norm.prop('disabled', false);
                $('#urank-docviewer-details-label').removeClass('normal');
                $('#urank-docviewer-details-label').removeClass('unlabelled');
                $('#urank-docviewer-details-label').addClass('botnet');
                break;
            case 'Normal':
                bton_norm.css('opacity',0.5);
                bton_norm.prop('disabled', true);
                bton_bot.css('opacity',1);
                bton_bot.prop('disabled', false);
                $('#urank-docviewer-details-label').removeClass('botnet');
                $('#urank-docviewer-details-label').removeClass('unlabelled');
                $('#urank-docviewer-details-label').addClass('normal');
                break;
            default:
                bton_bot.css('opacity',1);
                bton_bot.prop('disabled', false);
                bton_norm.css('opacity',1);
                bton_norm.prop('disabled', false);
                $('#urank-docviewer-details-label').removeClass('botnet');
                $('#urank-docviewer-details-label').removeClass('normal');
                $('#urank-docviewer-details-label').addClass('unlabelled');
        }


        $(detailItemIdPrefix + 'label').html(document.title); //class='urank-tagcloud-tag ui-draggable ui-draggable-handle dragging active'
        /*"<div style='width: 100%; height: 30px'>"+
         document.keyword+
         "</div>");*/
        $('#doc-word-container').html('');
        document.keyword.split(' ').forEach(function(item){
            item != '' && item != ' ' ? $('#doc-word-container').append('<label class="doc-word">'+' '+ item+'</label>') : null;
        });

        //show statistic
        $('#doc-viewer-top').html('');
        $('#doc-viewer-left').html('');
        var letters = [];
        var description = document.description;
        var i = description.length;
        while (i--) {
            var characterReg = /[a-zA-Z]/;
            var item = description[i];
            if(characterReg.test(item)) {
                letters.push(item);
            }
        }

        var count_letters = letters.length;
        var initial_porcent = 100/count_letters;
        var letter_porcent = {};
        var characteristic_porcent = {
            SP:0,
            WP:0,
            SNP:0,
            WNP:0
        };
        var all_letters = ['a','b','c','d','e','f','g','h','i','A','B','C','D','E'
            ,'F','G','H','I','r','s','t','u','v','w','x','y','z','R','S','T','U','V','W','X','Y','Z'];
        letters.forEach(function(item){
            letter_porcent[item] = item in letter_porcent ? letter_porcent[item] + initial_porcent : initial_porcent;
            var strong_periodicReg = /[a-i]/;
            var weak_periodicReg = /[A-I]/;
            var strong_nonperiodicReg = /[R-Z]/;
            var weak_nonperiodicReg = /[r-z]/;

            strong_periodicReg.test(item) ? characteristic_porcent['SP'] += 1 : null;
            weak_periodicReg.test(item) ? characteristic_porcent['WP'] += 1 : null;
            strong_nonperiodicReg.test(item) ? characteristic_porcent['SNP'] += 1 : null;
            weak_nonperiodicReg.test(item) ? characteristic_porcent['WNP'] += 1 : null;
        });

        var letter_data = [];
        all_letters.forEach(function(item){
            if(item in letter_porcent){
                var element = {
                    date: item,
                    value: letter_porcent[item]
                }
                letter_data.push(element)
            }else{
                var element = {
                    date: item,
                    value: 0
                }
                letter_data.push(element)
            }
        });
        /*$.each(letter_porcent , function(index, value) {
            var element = {
                date: index,
                value: value
            }
            letter_data.push(element)
        });*/

        var periodic_data = [];
        $.each(characteristic_porcent, function(index,value){
            var element = {
                age: index,
                population: value
            }
            periodic_data.push(element);
        })
        /*_showBarChart('doc-viewer-top',letter_data);
        _showPieChart('doc-viewer-left',periodic_data);*/

        var getFacet = function(facetName, facetValue){
            return facetName == 'year' ? parseDate(facetValue) : facetValue;
        };

        var facets = (this.opt && this.opt.facetsToShow) ? this.opt.facetsToShow : [];
        facets.forEach(function(facet){
            //console.log(getFacet(facet, document.facets[facet]));
            //$(detailItemIdPrefix + '' + facet).html(getFacet(facet, document.facets[facet]));
            $(detailItemIdPrefix + '' + facet).html(document.facets[facet]);
        });

        // Descomentar si en la secuencia de letras viene dividida por palabras.
        /*var sequence = '';
        var words = document.description.split(' ');
        for(var i = 0; i < words.length; i++){
            if(words[i].length != words[i+1].length){
                sequence += words[i];
                break;
            }
            sequence += words[i][0];
        }*/
        var sequence = document.description

        //$( "#tabs" ).css('display','block');
        $('#contentTabs-1').html(getStyleWordSecuencie(document.description, keywords, colorScale));
        $('#contentTabs-2').html(sequence);

        //var $p = $('<p></p>').appendTo($contentSection).html(getStyleWordSecuencie(document.description, keywords, colorScale));
        //$p.hide().fadeIn('slow').scrollTo('top');

        //Saving logs register



        /**
         * Showing the list of connections
         */
        $('div.urank-docviewer-container-default').removeClass('selected');
        var id = "urank-docviewer-"+document.id;
        if(_selectedConnection.indexOf(document.id) == -1){
            urank.enterLog('Connection,'+ _document.id);

            var connection_list = ''//show_list_document(document, init_port, dest_port, port, protocol,sequence,letter_data,periodic_data,counter,heatmap);

            if(connection_unlabelled != null){
                connection_list = show_list_document_with_similar_botnet_and_normal(document, init_port, dest_port, port, protocol,sequence,letter_data,periodic_data,counter, connection_unlabelled, heatmap);
            }
            else{
                connection_list = show_list_document(document, init_port, dest_port, port, protocol,sequence,letter_data,periodic_data,counter,heatmap);
            }


            $('#viscanvas > div.urank-hidden-scrollbar-inner > div').append(connection_list);
            $("#btn-show-connection-sequence-"+document.id).on( "click", function() {
                var connection = $(this).attr('sequence');
                var index = $(this).attr('index');
                var title = $(this).attr('title');
                var id_connection = $(this).attr('idC');
                var sequence_template = '<div class="doc-label-container">' +
                    '<label class="urank-docviewer-attributes urank-docviewer-details-label '+title.toLowerCase()+'">'+index+' | '+'<span id="label-'+id_connection+'">'+title+'</span></label>' +
                    '</div>'
                $("#dialog-seguence").html('<p>'+connection+'</p>');
                $("#dialog-seguence").dialog( "open" );

                urank.enterLog('Sequence Connection,'+id_connection);
            });
            $("#btn-close-connection-"+document.id).on( "click", function() {
                var btn = $(this);//$('#'+id);
                var id_connection = btn.attr('idC');
                var counter = btn.attr('counter');
                //urank.onWatchiconClicked(id_connection)

                //Desmarcar las conexiones en la lista
                var $li = $('.'+'urank-list-li'+'['+'urank-id'+'="'+id_connection+'"]');
                var watchIcon = $li.find(' .' + 'urank-list-li-button-watchicon');
                watchIcon.removeClass("urank-list-li-button-watchicon-on")
                watchIcon.addClass("urank-list-li-button-watchicon-off")
                $li.removeClass('watched');


                //Caso donde cierro una conexion botnet o normal
                // que se abrio automaticamente para comparar una sin etiquetar.
                if(btn.attr('comparative') == 'true'){
                    $('#urank-docviewer-'+id_connection).replaceWith('');//css('display','none');
                    var index = _selectedConnection.indexOf(id_connection)

                    if(index != -1){
                        _selectedConnection.splice(index,1);
                        urank.enterLog('Close Comparative Connection,'+id_connection);
                    }
                    urank.onDeselectItem(id_connection);
                    return false; //Termino aca la ejecucion del evento
                }

                //Clear all filters in this connection  $('#filter-initial-port-'+index+':checked').length > 0
                var change = false;
                var initialPort = $('#filter-initial-port-'+id_connection);
                var endPort = $('#filter-end-port-'+id_connection);
                var filterPort = $('#filter-port-'+id_connection);
                var filterProtocol = $('#filter-protocol-'+id_connection);
                if($('#filter-initial-port-'+id_connection+':checked').length > 0 ){
                    initialPort.prop('checked', false);
                    change = true;
                }
                if($('#filter-end-port-'+id_connection+':checked').length > 0 ){
                    endPort.prop('checked', false);
                    change = true;
                }
                if($('#filter-port-'+id_connection+':checked').length > 0 ){
                    filterPort.prop('checked', false);
                    change = true;
                }
                if($('#filter-protocol-'+id_connection+':checked').length > 0 ){
                    filterProtocol.prop('checked', false);
                    change = true;
                }
               if(change){
                   urank.findNotLabeled(this.value,null);
               }


                $('#urank-docviewer-'+id_connection).replaceWith('');//css('display','none');
                var index = _selectedConnection.indexOf(id_connection)

                //Remove connection from connection list
                var li = $('ul#connection-list li[urank-id='+id_connection+']');
                li[0].removeAttribute("style");
                urank.onDeselectItem(id_connection);

                if(index != -1){
                    _selectedConnection.splice(index,1);
                    urank.enterLog('Close Connection,'+id_connection);
                }

            });
            //$('input[type=checkbox][name=connection-attribute]').change(function() {
            $('#filter-initial-port-'+document.id).change(function() {
                console.log('filtrando');
                /*$(this).prop('checked', true);*/
                urank.findNotLabeled(this.value,null);
            });
            $('#filter-end-port-'+document.id).change(function() {
                console.log('filtrando');
                /*$(this).prop('checked', true);*/
                urank.findNotLabeled(this.value,null);
            });
            $('#filter-port-'+document.id).change(function() {
                console.log('filtrando');
                /*$(this).prop('checked', true);*/
                urank.findNotLabeled(this.value,null);
            });
            $('#filter-protocol-'+document.id).change(function() {
                console.log('filtrando');
                /*$(this).prop('checked', true);*/
                urank.findNotLabeled(this.value,null);
            });
            $('#urank-label-button-botnet-'+document.id).on("click",function(){
                var btn = $(this);//$('#'+id);
                var id_connection = btn.attr('idC');
                saveBotnetLabel(this,id_connection);
            });
            $('#urank-label-button-normal-'+document.id).on("click",function(){
                var btn = $(this);//$('#'+id);
                var id_connection = btn.attr('idC');
                saveNormalLabel(this,id_connection);
            });

            _showBarChart('bar-graph-'+document.id,letter_data);
            _showPieChart('pie-graph-'+document.id,periodic_data);

            counter ++;
            _selectedConnection.push(document.id);
        }
        else{
            $('#'+id).addClass('selected');
        }

    };

    var show_list_document = function (document, init_port, dest_port, port, protocol, sequence, letter_data, periodic_data,counter,heatmap){
        var title = document.title;
        var opacity_botnet_class = document.title == "Botnet" ? "opacity" : "non-opacity";
        var opacity_normal_class = document.title == "Normal" ? "opacity" : "non-opacity";
        var disable_botnet = document.title == "Botnet" ? "disable=''" : "";
        var disable_normal = document.title == "Normal" ? "disable=''" : "";
        var index = $('label#label-'+document.id).attr('value');
        var bot_probability =   document.botprob != 'NA' ? parseFloat(document.botprob.replace(",", ".")) : ''
        var bot_style = bot_probability != '' ? 'background: linear-gradient(to right,  red 0%, red ' + bot_probability*100 +'%,green ' + bot_probability*100 + '%,green 100%)' : ''
        var botnet_left = bot_probability != '' ? 'Botnet' : ''
        var normal_rigth = bot_probability != '' ? 'Normal' : ''
        var element =
            '<div id="urank-docviewer-'+document.id+'" class="urank-docviewer-container-default selected" style="margin-top: -3px;background: white">' +
                '<div style="display: block;" class="urank-docviewer-details-section">' +
                    '<div>' +
                        '<div class="left" style="margin-right: 25px; margin-top: 6px">' +
                            '<div class="doc-label-container">' +
                                '<label id="index-label-'+document.id+'" class="urank-docviewer-attributes urank-docviewer-details-label '+title.toLowerCase()+'">'+index+' | '+'<span id="label-'+document.id+'">'+title+'</span></label>' +
                            '</div>' +
                        '</div>' +
                        '<div class="doc-attributes-sontainer left">' +
                        '<input type="checkbox" id="filter-initial-port-'+document.id+'" class="filter-initial-port" name="connection-attribute" value="'+init_port+'"><label>Ip Origin:</label><label id="urank-docviewer-details-initport'+document.id+'" class="urank-docviewer-attributes">'+init_port+'</label>' +
                        '</div>' +
                        '<div class="doc-attributes-sontainer left">' +
                        '<input type="checkbox" id="filter-end-port-'+document.id+'" class="filter-end-port" name="connection-attribute" value="'+dest_port+'"><label>Ip Dest:</label><label id="urank-docviewer-details-destport'+document.id+'" class="urank-docviewer-attributes">'+dest_port+'</label>' +
                        '</div>' +
                        '<div class="doc-attributes-sontainer left">' +
                        '<input type="checkbox" id="filter-port-'+document.id+'" class="filter-port" name="connection-attribute" value="'+port+'"><label>Port:</label><label id="urank-docviewer-details-port'+document.id+'" class="urank-docviewer-attributes">'+port+'</label>' +
                        '</div>' +
                        '<div class="doc-attributes-sontainer left">' +
                        '<input type="checkbox" id="filter-protocol-'+document.id+'" class="filter-protocol" name="connection-attribute" value="'+protocol+'"><label>Protocol:</label><label id="urank-docviewer-details-protocol'+document.id+'" class="urank-docviewer-attributes">'+protocol+'</label>' +
                        '</div>' +
                        '<div class="rigth" style="margin: 3px">' +
                            '<button id="btn-close-connection-'+document.id+'" class="btn-close-connection" idC="'+document.id+'" comparative="false" counter="'+counter+'">X</button>'+
                        '</div>'+
                        '<div style="clear: both"></div>' +

                        /*'<div class="urank-docviewer-divisor"></div>' +*/
                    '</div>' +
                    '<div style="width: 100%; margin: 5px">' +
                        '<label><span>'+ botnet_left +' </span><span style="' + bot_style + '" urank-span-prediction-id="'+ document.id+'" class="document_view-botnet-bar"></span> <span>' + normal_rigth + '</span></label>' +
                        '<div  style="margin: 5px">' +
                        heatmap[0].outerHTML() + heatmap[1].outerHTML() + heatmap[2].outerHTML() +heatmap[3].outerHTML() +heatmap[4].outerHTML() +heatmap[5].outerHTML() +heatmap[6].outerHTML() +heatmap[7].outerHTML() +heatmap[8].outerHTML() +heatmap[9].outerHTML() +
                        '</div>'+
                    '</div>' +

                    '<div style=" margin-bottom: -30px">' +
                        '<div id="bar-graph-'+document.id+'" class="left">' +
                        '</div>' +
                        '<div style="width: 25%" id="pie-graph-'+document.id+'" class="pie-graph left">' +
                        '</div>' +
                        '<div id="legend-pie-graph'+document.id+'" class="left" style="width: 10%;margin-top: 30px">' +
                            '<label xmlns="http://www.w3.org/1999/html"><span style="color: transparent; background:' + _periodicity_color[0] +'; padding: 2px">M</span> SP </br></label>'+
                            '<label><span style="color: transparent; background: ' + _periodicity_color[1] +'; padding: 2px">M</span> WP</br></label>'+
                            '<label><span style="color: transparent; background: ' + _periodicity_color[2] +'; padding: 2px">M</span> SNP</br></label>'+
                            '<label><span style="color: transparent; background: ' + _periodicity_color[3] +'; padding: 2px">M</span> WNP</br></label>'+
                        '</div>'+
                        '<div style="clear: both"></div>' +
                    '</div>' +
                    '<div>' +
                        '<div>' +
                            /*'<input type="text" placeholder="Add new label..." id="label-text" style="display: none"><label>Tell us why you select this label:</label><textarea id="urank-docviewer-labeling-text" rows="5"></textarea>' +*/
                            '<button id="btn-show-connection-sequence-'+document.id+'" class="btn-show-connection-sequence" idC="'+document.id+'" sequence="'+sequence+'" index="'+index+'" title="'+document.title+'" style="margin:2px; float: right;">Show Sequence</button>'+
                            '<button style="background: red; color: black; text-shadow: none; box-shadow: none" id="urank-label-button-botnet-'+document.id+'" class="btn-botnet-label-connection rigth '+opacity_botnet_class+'" style="margin: 2px" idC="'+document.id+'"'+disable_botnet+'>Botnet</button>' +
                            '<button style="background: #008000; color: black; text-shadow: none; box-shadow: none" id="urank-label-button-normal-'+document.id+'" class="btn-normal-label-connection rigth '+opacity_normal_class+'" style="margin: 2px" idC="'+document.id+'"'+disable_normal+'>Normal</button>' +
                            '<div style="clear: both"></div>'+
                        '</div>' +
                        /*'<div class="urank-docviewer-divisor"></div>' +*/
                    '</div>' +
                '</div>' +
                /*'<div style="height: 160px; display: block;" class="urank-docviewer-content-section-outer ui-tabs ui-widget ui-widget-content ui-corner-all">' +
                    *//*'<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" role="tablist">' +
                        '<li class="ui-state-default ui-corner-top ui-tabs-active ui-state-active" role="tab" tabindex="0" aria-controls="tabs-1" aria-labelledby="ui-id-2" aria-selected="true" aria-expanded="true">' +
                            '<a href="#tabs-1" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-2">Letter</a>' +
                        '</li>' +
                        '<li class="ui-state-default ui-corner-top" role="tab" tabindex="-1" aria-controls="tabs-2" aria-labelledby="ui-id-3" aria-selected="false" aria-expanded="false">' +
                            '<a href="#tabs-2" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-3">Connection Sequence</a>' +
                        '</li>' +
                    '</ul>' +
                    '<div aria-labelledby="ui-id-2" class="ui-tabs-panel ui-widget-content ui-corner-bottom" role="tabpanel" aria-hidden="false">' +
                        '<p></p>' +
                    '</div>' +*//*
                    *//*'<div aria-labelledby="ui-id-3" class="ui-tabs-panel ui-widget-content ui-corner-bottom" role="tabpanel" aria-hidden="true" style="display: none;">' +
                        '<p>'+sequence+'</p>' +
                    '</div>' +*//*
                '</div>' +*/
            '</div>';
//Para mostrar los filtros encima de las listas, en el panel de arriba en la app
        //show_filter(document,init_port,dest_port,port,protocol);

        return element;
    }

    var show_list_document_with_similar_botnet_and_normal = function (document, init_port, dest_port, port, protocol, sequence, letter_data, periodic_data,counter, connection_unlabelled, heatmap){
        var title = document.title;
        var connection_unlabelled_info = connection_unlabelled.connection_id.split("-");
        var init_port_unlabelled = connection_unlabelled_info[0];
        var dest_port_unlabelled = connection_unlabelled_info[1];
        var port_unlabelled = connection_unlabelled_info[2];
        var protocol_unlabelled = connection_unlabelled_info[3];
        var class_similar_init_port = init_port_unlabelled == init_port ? 'similar-connection-feature' : ''
        var class_similar_dest_port = dest_port_unlabelled == dest_port ? 'similar-connection-feature' : ''
        var class_similar_port = port_unlabelled == port ? 'similar-connection-feature' : ''
        var class_similar_protocol = protocol_unlabelled == protocol ? 'similar-connection-feature' : ''

        var index = $('label#label-'+document.id).attr('value');
        var bot_probability =   document.botprob != 'NA' ? parseFloat(document.botprob.replace(",", ".")) : ''
        var bot_style = bot_probability != '' ? 'background: linear-gradient(to right,  red 0%, red ' + bot_probability*100 +'%,green ' + bot_probability*100 + '%,green 100%)' : ''
        var botnet_left = bot_probability != '' ? 'Botnet' : ''
        var normal_rigth = bot_probability != '' ? 'Normal' : ''
        var element =
            '<div id="urank-docviewer-'+document.id+'" class="urank-docviewer-container-default selected" style="margin-top: -3px;background: white">' +
                '<div style="display: block;" class="urank-docviewer-details-section">' +
                    '<div>' +
                        '<div class="left" style="margin-right: 25px; margin-top: 6px">' +
                            '<div class="doc-label-container">' +
                                '<label id="index-label-'+document.id+'" class="urank-docviewer-attributes urank-docviewer-details-label '+title.toLowerCase()+'">'+index+' | '+'<span id="label-'+document.id+'">'+title+'</span></label>' +
                            '</div>' +
                        '</div>' +
                        '<div class="' + class_similar_init_port + ' doc-attributes-sontainer left doc-attributes-container-comparative">' +
                            '<label>Ip Origin:</label><label id="urank-docviewer-details-initport'+document.id+'" class="urank-docviewer-attributes">'+init_port+'</label>' +
                        '</div>' +
                        '<div class="' + class_similar_dest_port + ' doc-attributes-sontainer left doc-attributes-container-comparative">' +
                            '<label>Ip Dest:</label><label id="urank-docviewer-details-destport'+document.id+'" class="urank-docviewer-attributes">'+dest_port+'</label>' +
                        '</div>' +
                        '<div class="' + class_similar_port + ' doc-attributes-sontainer left doc-attributes-container-comparative">' +
                            '<label>Port:</label><label id="urank-docviewer-details-port'+document.id+'" class="urank-docviewer-attributes">'+port+'</label>' +
                        '</div>' +
                        '<div class="' + class_similar_protocol + ' doc-attributes-sontainer left doc-attributes-container-comparative">' +
                            '<label>Protocol:</label><label id="urank-docviewer-details-protocol'+document.id+'" class="urank-docviewer-attributes">'+protocol+'</label>' +
                        '</div>' +
                        '<div class="rigth" style="margin: 3px">' +
                            '<button id="btn-close-connection-'+document.id+'" class="btn-close-connection" idC="'+document.id+'" comparative="true" counter="'+counter+'">X</button>'+
                        '</div>'+
                        '<div style="clear: both"></div>' +
                        /*'<div class="urank-docviewer-divisor"></div>' +*/
                    '</div>' +
                    '<div style="width: 100%; margin: 5px">' +
                       '<label><span>'+ botnet_left +' </span><span style="' + bot_style + '" urank-span-prediction-id="'+ document.id+'" class="document_view-botnet-bar"></span> <span>' + normal_rigth + '</span></label>' +
                        '<div style="margin: 5px">' +
                            heatmap[0].outerHTML() + heatmap[1].outerHTML() + heatmap[2].outerHTML() +heatmap[3].outerHTML() +heatmap[4].outerHTML() +heatmap[5].outerHTML() +heatmap[6].outerHTML() +heatmap[7].outerHTML() +heatmap[8].outerHTML() +heatmap[9].outerHTML() +
                        '</div>'+
                    '</div>' +

                    '<div style=" margin-bottom: -30px">' +
                        '<div id="bar-graph-'+document.id+'" class="left">' +
                        '</div>' +
                        '<div style="width: 25%" id="pie-graph-'+document.id+'" class="pie-graph left">' +
                        '</div>' +
                        '<div id="legend-pie-graph'+document.id+'" class="left" style="width: 10%;margin-top: 30px">' +
                            '<label xmlns="http://www.w3.org/1999/html"><span style="color: transparent; background:' + _periodicity_color[0] +'; padding: 2px">M</span> SP </br></label>'+
                            '<label><span style="color: transparent; background: ' + _periodicity_color[1] +'; padding: 2px">M</span> WP</br></label>'+
                            '<label><span style="color: transparent; background: ' + _periodicity_color[2] +'; padding: 2px">M</span> SNP</br></label>'+
                            '<label><span style="color: transparent; background: ' + _periodicity_color[3] +'; padding: 2px">M</span> WNP</br></label>'+
                        '</div>'+
                        '<div style="clear: both"></div>' +
                    '</div>' +
                    '<div>' +
                        '<div>' +
                        '<button id="btn-show-connection-sequence-'+document.id+'" class="btn-show-connection-sequence" idC="'+document.id+'" sequence="'+sequence+'" index="'+index+'" title="'+document.title+'" style="margin:2px; float: right;">Show Sequence</button>'+
                            /*'<button style="background: red; color: black; text-shadow: none; box-shadow: none" id="urank-label-button-botnet-'+document.id+'" class="btn-botnet-label-connection rigth '+opacity_botnet_class+'" style="margin: 2px" idC="'+document.id+'"'+disable_botnet+'>Botnet</button>' +
                            '<button style="background: #008000; color: black; text-shadow: none; box-shadow: none" id="urank-label-button-normal-'+document.id+'" class="btn-normal-label-connection rigth '+opacity_normal_class+'" style="margin: 2px" idC="'+document.id+'"'+disable_normal+'>Normal</button>' +
                            */'<div style="clear: both"></div>'+
                        '</div>' +
                    '</div>' +
                /*//Normal Document
                    '<div>'+
                        '<div style=" margin-bottom: -30px">' +
                            '<div id="bar-graph-'+normal_document.id+'" class="left">' +
                            '</div>' +
                            '<div style="width: 25%" id="pie-graph-'+normal_document.id+'" class="pie-graph left">' +
                            '</div>' +
                            '<div id="legend-pie-graph'+normal_document.id+'" class="rigth" style="width: 24%;margin-top: 30px">' +
                                '<label xmlns="http://www.w3.org/1999/html"><span style="color: transparent; background:' + _periodicity_color[0] +'; padding: 2px">M</span> SP </br></label>'+
                                '<label><span style="color: transparent; background: ' + _periodicity_color[1] +'; padding: 2px">M</span> WP</br></label>'+
                                '<label><span style="color: transparent; background: ' + _periodicity_color[2] +'; padding: 2px">M</span> SNP</br></label>'+
                                '<label><span style="color: transparent; background: ' + _periodicity_color[3] +'; padding: 2px">M</span> WNP</br></label>'+
                            '</div>'+
                            '<div style="clear: both"></div>' +
                        '</div>' +
                    '</div>'+
                //Botnet Document
                    '<div>'+
                        '<div style=" margin-bottom: -30px">' +
                        '<div id="bar-graph-'+bot_document.id+'" class="left">' +
                        '</div>' +
                        '<div style="width: 25%" id="pie-graph-'+bot_document.id+'" class="pie-graph left">' +
                        '</div>' +
                        '<div id="legend-pie-graph'+bot_document.id+'" class="rigth" style="width: 24%;margin-top: 30px">' +
                            '<label xmlns="http://www.w3.org/1999/html"><span style="color: transparent; background:' + _periodicity_color[0] +'; padding: 2px">M</span> SP </br></label>'+
                            '<label><span style="color: transparent; background: ' + _periodicity_color[1] +'; padding: 2px">M</span> WP</br></label>'+
                            '<label><span style="color: transparent; background: ' + _periodicity_color[2] +'; padding: 2px">M</span> SNP</br></label>'+
                            '<label><span style="color: transparent; background: ' + _periodicity_color[3] +'; padding: 2px">M</span> WNP</br></label>'+
                        '</div>'+
                        '<div style="clear: both"></div>' +
                    '</div>' +*/
            '</div>'+
                '</div>' +
            '</div>';
        return element;
    }


    var show_filter = function(document, init_port, dest_port, port, protocol){
        var ipOrigen = '<input type="checkbox" id="filter-initial-port-'+document.id+'" class="filter-initial-port" name="connection-attribute" value="'+init_port+'"><label>Ip Origin:</label><label id="urank-docviewer-details-initport'+document.id+'" class="urank-docviewer-attributes">'+init_port+'</label>';
        var ipDest = '<input type="checkbox" id="filter-end-port-'+document.id+'" class="filter-end-port" name="connection-attribute" value="'+dest_port+'"><label>Ip Dest:</label><label id="urank-docviewer-details-destport'+document.id+'" class="urank-docviewer-attributes">'+dest_port+'</label>';
        var port = '<input type="checkbox" id="filter-port-'+document.id+'" class="filter-port" name="connection-attribute" value="'+port+'"><label>Port:</label><label id="urank-docviewer-details-port'+document.id+'" class="urank-docviewer-attributes">'+port+'</label>';
        var protocol = '<input type="checkbox" id="filter-protocol-'+document.id+'" class="filter-protocol" name="connection-attribute" value="'+protocol+'"><label>Protocol:</label><label id="urank-docviewer-details-protocol'+document.id+'" class="urank-docviewer-attributes">'+protocol+'</label>';
        $('#header-filter-ip-origin').append(ipOrigen);
    }

    /**
     * Created by Jorch
     * @private
     */
    var _updateSelectedKeys = function(selectedKeyWords){
        _selectedKeywords = selectedKeyWords
    };

    var _clear = function(){
        /**
         * Modified by Jorch
         */
        // Clear details section
        /*$(detailItemIdPrefix + 'title').empty();
         var facets = (this.opt && this.opt.facetsToShow) ? this.opt.facetsToShow : [];
         facets.forEach(function(facet){
         $(detailItemIdPrefix + '' + facet).empty();
         });
         // Clear content section
         $contentSection.empty();*/
        //_selectedConnection = [];
    };

    var _reset = function(){
        _selectedConnection = [];
    }


    var _destroy = function() {
        $root.empty().removeClass(docViewerContainerClass)
    };

    var _showBarChart = function(idElement,data){

        var margin = {top: 20, right: 20, bottom: 70, left: 40},
            width = 400 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;

        var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

        var y = d3.scale.linear().range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(10);
        //.tickFormat(d3.time.format("%Y-%m"));

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);

        var svg = d3.select('#'+idElement).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        data.forEach(function(d) {
            d.date = d.date;
            d.value = +d.value;
        });

        //x.domain(data.map(function(d) { return d.keys; }));
        x.domain(data.map(function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.value; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-90)" );

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Letter (%)");

        svg.selectAll("bar")
            .data(data)
            .enter().append("rect")
            .style("fill", "steelblue")
            .attr("x", function(d) { return x(d.date); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); });

    }

    var _showPieChart = function(idElement,data){
        var _data = data;
        var width = 320,
            height = 160,
            radius = Math.min(width, height) / 2;

        var color = d3.scale.ordinal()
            .range(_periodicity_color);
            //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        var arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        var labelArc = d3.svg.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.population; });

        var svg = d3.select('#'+idElement).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + 90 + "," + 80 + ")");

        d3.csv("data.csv", type, function(error, data) {
            //if (error) throw error;

            data = _data;

            var g = svg.selectAll(".arc")
                .data(pie(data))
                .enter().append("g")
                .attr("class", "arc");

            g.append("path")
                .attr("d", arc)
                .style("fill", function(d) { return color(d.data.age); });

            g.append("text")
                .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
                .attr("dy", ".35em")
                .text(function(d) { return d.data.age; });
        });
        function type(d) {
            d.population = +d.population;
            return d;
        }
    }

    var _showDonutChart = function(idElement,data){
        var _data = data;
        var width = 320,
            height = 160,
            radius = Math.min(width, height) / 2;

        var color = d3.scale.ordinal()
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        var arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 40);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.population; });

        var svg = d3.select('#'+idElement).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + 90 + "," + 80 + ")");

        d3.csv("data.csv", type, function(error, data) {
            //if (error) throw error;

            data = _data;

            var g = svg.selectAll(".arc")
                .data(pie(data))
                .enter().append("g")
                .attr("class", "arc");

            g.append("path")
                .attr("d", arc)
                .style("fill", function(d) { return color(d.data.age); });

            g.append("text")
                .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                .attr("dy", ".35em")
                .text(function(d) { return d.data.age; });
        });

        function type(d) {
            d.population = +d.population;
            return d;
        }
    }

    // Prototype
    DocViewer.prototype = {
        build: _build,
        clear: _clear,
        reset: _reset,
        showDocument: _showDocument,
        destroy: _destroy,
        /**
         * Modified by Jorch
         */
        updateSelectedKeys: _updateSelectedKeys
    };

    return DocViewer;
})();