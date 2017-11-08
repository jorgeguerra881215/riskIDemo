/**
 * Created by root on 6/1/16.
 */

$(function(){
    var sliderOptions = {
        orientation: 'horizontal',
        animate: true,
        range: true,
        min: 1,
        max: 20,
        //step: 2,
        value: 1,
        start: function(event, ui) {},
        slide: function(event, ui) {},
        stop: function(event, ui) {

            console.log('value = '+ui.values[0]);
        }
    };
    //$('#doc-freq-slider').slider(sliderOptions)

    /*$( "#slider-6" ).slider({
        range:true,
        min: 0,
        max: 20,
        values: 5,
        slide: function( event, ui ) {
            $( "#slidevalue" )
                .val( "$" + ui.value);
        },
        start: function( event, ui ) {
            *//*$( "#startvalue" )
                .val( "$" + ui.value[ 0 ] + " - $" + ui.values[ 1 ] );*//*
        },
        stop: function( event, ui ) {
            *//*$( "#stopvalue" )
                .val( "$" + ui.value );
            console.log('value = '+ui.value);*//*
        },
        change: function( event, ui ) {
            *//*$( "#changevalue" )
                .val( "$" + ui.value );*//*
        }

    });*/
});