
/**
 * parsing functions
 *
 * */

function parseDate( dateString ){

    if(dateString instanceof Date)
        return dateString;

	var yearFormat = d3.time.format("%Y");
	var date = yearFormat.parse(dateString);

	if(date != null) return date;

	var dateFormat = d3.time.format("%Y-%m");
	date = dateFormat.parse(dateString);

	if(date != null) return date;

	if( dateString.length == 8 )
		date = yearFormat.parse( dateString.substring(0, 4) );

	if(date != null) return date;

	if(dateString.contains("c "))
		date = yearFormat.parse( dateString.substring(2, 6) );

	if(date != null) return date;
	return yearFormat.parse('2014');
}



function toYear(date){

	var formatYear = d3.time.format("%Y");
	var year = formatYear(date);
	//if(year != null)
		return year;
	//return "0";
}


/////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * String prototype
 *
 * */

String.prototype.contains = function(it) {
	return this.indexOf(it) != -1;
};


String.prototype.toBool = function() {
    return (this == "true");
};

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.isAllUpperCase = function() {
    return this.valueOf().toUpperCase() === this.valueOf();
};

String.prototype.clean = function(){

    function decodeHTMLEntities (str) {
        var element = document.createElement('div');
        if(str && typeof str === 'string') {
            // strip script/html tags
            str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
            str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = '';
        }
        if(str.contains('LEGO'))
            console.log(str);
        return str;
    }

    var text = unescape(this.toString()),
        textArray = [],
        splitText = text.split(' ');

    for(var i = 0; i < splitText.length; ++i) {
        if(splitText[i].match(/\w+-$/)){
            textArray.push(splitText[i].replace('-', '') + splitText[i+1]);
            ++i;
        }
        else
            textArray.push(splitText[i]);
    }
    text = textArray.join(' ');
    return (text[text.length - 1] == ' ') ? text.substring(0, text.length-1) : text;
};


String.prototype.removeUnnecessaryChars = function() {
    return this.replace(/[-=’‘\']/g, ' ').replace(/[()\"“”]/g,'');
};


/////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Number prototype gunctionto parse milliseconds to minutes:seconds format
 *
 * */

Number.prototype.toTime = function(){
    var min = (this/1000/60) << 0;
    var sec = Math.floor((this/1000) % 60);
    if (min.toString().length == 1) min = '0' + min.toString();
    if (sec.toString().length == 1) sec = '0' + sec.toString();
    return min + ':' + sec;
};


Number.prototype.round = function(places) {
    return +(Math.round(this + "e+" + places)  + "e-" + places);
}




/////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * hex to RGB converter
 *
 * */

function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}


/////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * format gradient string
 *
 * */

function getGradientString(color, shadeDiff,periodicity) {

    if(periodicity != null && periodicity != 0){
        switch (periodicity) {
            case '1': return '-webkit-linear-gradient(top, rgb(132, 204, 247) 0%, rgb(132, 204, 247) 20%, rgb(204, 174, 151) 98%, rgb(199, 193, 179) 100%);'; break;
            case '2': return '-webkit-linear-gradient(top, rgb(94, 136, 247) 0%, rgb(94, 136, 247) 40%, rgb(204, 174, 151) 98%, rgb(199, 193, 179) 100%);'; break;
            case '3': return '-webkit-linear-gradient(top, rgb(63, 85, 247) 0%, rgb(63, 85, 247) 60%, rgb(204, 174, 151) 98%, rgb(199, 193, 179) 100%);'; break;
            case '4': return '-webkit-linear-gradient(top, rgba(0,33,247,1) 0%, rgba(12,24,245,1) 80%, rgb(204, 174, 151) 98%, rgb(199, 193, 179) 100%);'; break;
            case '5': return '-webkit-linear-gradient(top,  #009af9 100%,#b7deed 100%);'; break;
        }
    }

    shadeDiff = shadeDiff || 10;
    var r = parseInt(hexToR(color));
    var g = parseInt(hexToG(color));
    var b = parseInt(hexToB(color));

    var original = 'rgb('+r+','+g+','+b+')';
    var lighter = 'rgb('+(r+shadeDiff)+','+(g+shadeDiff)+','+(b+shadeDiff)+')';

    //return '-webkit-linear-gradient(top, ' + original + ', ' + lighter + ', ' + original + ')';
}




/////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *
 *
 * */

// NLP
var stemmer = natural.PorterStemmer;
var nounInflector = new natural.NounInflector();
stemmer.attach();
nounInflector.attach();


function getStyledText (text, stemmedKeywords, colorScale){
    var styledText = '',
        word = '';
    text.split('').forEach(function(c){
        if(c.match(/\w/)){
            word += c;
        }
        else if(c == '\n'){
            styledText += '<br/>'
        }
        else {
            if(word != '')
                word = getStyledWord(word,stemmedKeywords, colorScale);
            styledText += word + c;
            word = '';
        }
    });
    if(word != '')
        styledText += getStyledWord(word, stemmedKeywords, colorScale);
    return styledText;
}


function getStyledWord (word, stemmedKeywords, colorScale){

    var trickyWords = ['it', 'is', 'us', 'ar'],
        word = word.replace(/our$/, 'or'),
        wordStem = word.stem();
    // First clause solves words like 'IT', second clause that the stem of the doc term (or the singularized term) matches the keyword stem
    if(trickyWords.indexOf(wordStem) == -1 || word.isAllUpperCase()) {
        if(stemmedKeywords.indexOf(wordStem) > -1 )
            return "<strong style='color:" + colorScale(wordStem) + "'>" + word + "</strong>";
        if(stemmedKeywords.indexOf(word.singularizeNoun().stem()) > -1 )
            return "<strong style='color:" + colorScale(word.singularizeNoun().stem()) + "'>" + word + "</strong>";
    }
    return word;
}

/**
 * Created by Jorch
 * @param text
 * @param stemmedKeywords
 * @param colorScale
 * @returns {string}
 */
function getStyleWordSecuencie(text, stemmedKeywords, colorScale){
    var styledText = '';
    var keyWords = {};
    stemmedKeywords.forEach(function(key){
       keyWords[key] = colorScale(key);
    });

    text.split(' ').forEach(function(word){
        if(word in keyWords){
            styledText += "<strong style='color:" + keyWords[word] + "'>" + word + "</strong> ";
        }
        else{
            styledText += word + ' ';
        }
    });
    return styledText
}













