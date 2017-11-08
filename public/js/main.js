(function(){

    var _this = this;
    this.dsm = new datasetManager();
    this.currentRanking = {};


    // Event handler for dataset-select change
    var selectDatasetChanged = function(){
        $('.processing-message').show();
        var datasetId = $("#select-dataset").val();
        _this.urank.clear();
        setTimeout(function(){
            _this.dsm.getDataset(datasetId, function(dataset){
                //console.log(dataset)
               _this.urank.loadData(dataset);
                $('.processing-message').hide();
            });
        }, 10);
    };

    //  Event handler for "Download ranking" button
    var btnDownloadClicked = function(event) {

        var scriptURL = '../server/download.php',
            date = new Date(),
            timestamp = date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate() + '_' + date.getHours() + '.' + date.getMinutes() + '.' + date.getSeconds(),
            urankState = _this.urank.getCurrentState(),
            gf = $('#select-download').val() == '2files' ?
                [{ filename: 'urank_selected_keywords_' + timestamp + '.txt', content: JSON.stringify(urankState.selectedKeywords) },
                    { filename: 'urank_ranking_' + timestamp + '.txt', content:JSON.stringify(urankState.ranking) }] :
                [{ filename: 'urank_state_' + timestamp + '.txt', content: JSON.stringify(urankState) }];

        gf.forEach(function(f){
            $.generateFile({ filename: f.filename, content: f.content, script: scriptURL });
        });

        event.preventDefault();
    };

    /**
     * Created by Jorch
     * @type {Function}
     */
    var btnSaveLabeledClicked = function(event) {
        //var scriptURL = "http://localhost/riskID/server/download.php",
        var scriptURL = 'http://itic.uncu.edu.ar:8880/riskID/app/server/download.php',
            date = new Date(),
            timestamp = date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate() + '_' + date.getHours() + '.' + date.getMinutes() + '.' + date.getSeconds(),
            urankState = _this.urank.getCurrentData(),
            gf = [{ filename: 'urank_labeled_' + timestamp + '.txt', content: JSON.stringify(urankState) }];//JSON.stringify(urankState)

        $.generateFile({ filename: "connections.txt", content: urankState, script: scriptURL });

        _this.urank.enterLog('Save Labeling,0');

        event.preventDefault();
    };
     var changeUploadConnectionNumber = function(value){

    };

    //  uRank initialization options
    var urankOptions = {
        tagCloudRoot: '#tagcloud',
        tagBoxRoot: '#tagbox',
        contentListRoot: '#contentlist',
        visCanvasRoot: '#viscanvas',
        docViewerRoot: '#docviewer'
    };

    // uRank initialization function to be passed as callback
    this.urank = new Urank(urankOptions);

    // Fill dataset select options and bind event handler
    var datasetOptions = "";
    this.dsm.getIDsAndDescriptions().forEach(function(ds){
        datasetOptions += "<option value='" + ds.id + "'>" + ds.description + "</option>";
    });

    // Add dataset options and bind event handlers for dataset select
    $("#select-dataset").html(datasetOptions).change(selectDatasetChanged);

    // Bind event handlers for "download ranking" button
    //$('#btn-download').click(btnSaveLabeledClicked);
    $('#btn-save-labeled').click(btnSaveLabeledClicked);

    // Bind event handlers for urank specific buttons
    $('#btn-reset').off().on('click', this.urank.reset);
    /*$('#btn-show-sequence').off().on('click', this.urank.onShowSequence);*/
    $('#btn-sort-by-overall-score').off().on('click', this.urank.rankByOverallScore);
    $('#btn-sort-by-max-score').off().on('click', this.urank.rankByMaximumScore);


    //Filter by label
    $('input[type=radio][name=connection-label]').change(function() {
        _this.urank.findNotLabeled(this.value);
    });

    // Trigger change evt to load first dataset in select options
    $('#select-dataset').trigger('change');

    /************************************************************************************************************************************************
     * Modified by Jorch
     ************************************************************************************************************************************************/
    /*$('#urank-label-button').click(function(){
        alert('dio click');
    });*/
    /*$('#urank-label-button').click(btnDownloadClicked);*/


    $( "#slider-6" ).slider({
        //range:true,
        min: 0,
        max: 100,
        values: 5,
        slide: function( event, ui ) {
            $( "#stfValue" )
                .val(ui.value);
        },
        start: function( event, ui ) {
            /*$( "#startvalue" )
             .val( "$" + ui.value[ 0 ] + " - $" + ui.values[ 1 ] );*/
        },
        stop: function(event,ui){

            _this.urank.updateTagsCloud(ui.value,$( "#patternValue" ).val(),$( "#lengthValue" ).val())
        },
        change: function( event, ui ) {
            /*$( "#changevalue" )
             .val( "$" + ui.value );*/
        },
        formatter: function(value) {
            return 'Current value: ' + value;
        }

    });

    $( "#slider-pattern" ).slider({
        //range:true,
        min: 0,
        max: 100,
        values: 5,
        slide: function( event, ui ) {
            $( "#patternValue" )
                .val(ui.value);
        },
        start: function( event, ui ) {
            /*$( "#startvalue" )
             .val( "$" + ui.value[ 0 ] + " - $" + ui.values[ 1 ] );*/
        },
        stop: function(event,ui){
            _this.urank.updateTagsCloud($( "#stfValue" ).val(),ui.value,$( "#lengthValue" ).val())
        },
        change: function( event, ui ) {
            /*$( "#changevalue" )
             .val( "$" + ui.value );*/
        },
        formatter: function(value) {
            return 'Current value: ' + value;
        }

    });

    $( "#slider-length" ).slider({
        //range:true,
        min: 5,
        max: 15,
        step: 5,
        values: 5,
        slide: function( event, ui ) {
            $( "#lengthValue" )
                .val(ui.value);
        },
        start: function( event, ui ) {
            /*$( "#startvalue" )
             .val( "$" + ui.value[ 0 ] + " - $" + ui.values[ 1 ] );*/
        },
        stop: function(event,ui){
            _this.urank.updateTagsCloud($( "#stfValue" ).val(),$( "#patternValue" ).val(),ui.value)
        },
        change: function( event, ui ) {
            /*$( "#changevalue" )
             .val( "$" + ui.value );*/
        },
        formatter: function(value) {
            return 'Current value: ' + value;
        }

    });
    $('#btn-sort-by-periodicity').click(function(){
        $(this).css('border-color','black');
        _this.urank.updateTagsCloud($( "#stfValue" ).val(),$( "#patternValue" ).val(),$( "#lengthValue" ).val(),true);
    });
    $('#btn-tagCloud-reset').click(function(){
        $('#btn-sort-by-periodicity').css('border-color','transparent');
        _this.urank.updateTagsCloud($( "#stfValue" ).val(),$( "#patternValue" ).val(),$( "#lengthValue" ).val(),false);
    });

    window.onbeforeunload = function(){
        var user_name = $('#username').html();
        if(user_name !=null && user_name != ''){
            //_this.urank.saveLabeling();
            return "Are you sure you wanna leave the site? Remember save your labeling";
        }
        return null;
    }

})();

