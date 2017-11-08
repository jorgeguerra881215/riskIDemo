
var KeywordExtractor = (function(){

    var _this,
        s = {},
        stemmer, tokenizer, nounInflector, tfidf, stopWords, pos, lexer, tagger,
        POS = {
            NN: 'NN',           // singular noun
            NNS: 'NNS',         // plural noun
            NNP: 'NNP',         // proper noun
            JJ: 'JJ'            // adjective
        };

    //  CONSTRUCTOR
    function KeywordExtractor(arguments) {
        s = $.extend({
            minDocFrequency: 5,
            minRepetitionsInDocument: 1,
            maxKeywordDistance: 5,
            minRepetitionsProxKeywords: 4
        }, arguments);

        _this = this;
        this.collection = [];
        this.documentKeywords = [];
        this.collectionKeywords = [];
        this.collectionKeywordsDict = {};

        stemmer = natural.PorterStemmer; //natural.LancasterStemmer;
        stemmer.attach();
        tokenizer = new natural.WordTokenizer;
        nounInflector = new natural.NounInflector();
        nounInflector.attach();
        //tfidf = new natural.TfIdf(),
        stopWords = natural.stopwords;
        pos = new Pos();
        lexer = new pos.Lexer();
        tagger = new pos.Tagger();
    }


/************************************************************************************************************************************
*
*   PRIVATE METHODS
*
************************************************************************************************************************************/

    var extractDocumentKeywords = function(collection) {

        //POS tagging
        collection.forEach(function(d, i) {
            d.taggedWords = tagger.tag(lexer.lex(d.text));
        });

        // Find out which adjectives are potentially important and worth keeping
        var keyAdjectives = getKeyAdjectives(collection);

        // Create each item's document to be processed by tf*idf
        collection.forEach(function(d) {
            d.tokens = getFilteredTokens(d.taggedWords, keyAdjectives);                                       // d.tokens contains raw nouns and important adjectives
            tfidf.addDocument(d.tokens.map(function(term){ return term.stem(); }).join(' '));                 // argument = string of stemmed terms in document array
        });

        // Save keywords for each document
        var documentKeywords = [];
        collection.forEach(function(d, i){
            documentKeywords.push(getDocumentKeywords(i));
        });

        return documentKeywords;
    };



    var getKeyAdjectives = function(_collection) {

        var candidateAdjectives = [],
            keyAdjectives = [];

        _collection.forEach(function(d, i) {
            // Find out which adjectives are potentially important and worth keeping
            d.taggedWords.forEach(function(tw){
                if(tw[1] == 'JJ'){
                    var adjIndex = _.findIndex(candidateAdjectives, function(ca){ return ca.adj === tw[0].toLowerCase() });
                    if(adjIndex == -1)
                        candidateAdjectives.push({ 'adj': tw[0].toLowerCase(), 'repeated': 1 });
                    else
                        candidateAdjectives[adjIndex].repeated++;
                }
            });
        });

        candidateAdjectives.forEach(function(ca){
            if(ca.repeated >= parseInt(_collection.length * 0.5))
                keyAdjectives.push(ca.adj);
        });
        return keyAdjectives;
    }


    // Filter out meaningless words, keeping only nouns (plurals are singularized) and key adjectives
    var getFilteredTokens = function(taggedWords, keyAdjectives) {
        var filteredTerms = [];
        taggedWords.forEach(function(tw){
            switch(tw[1]){
                case POS.NN:          // singular noun
                    tw[0] = (tw[0].isAllUpperCase()) ? tw[0] : tw[0].toLowerCase();
                    filteredTerms.push(tw[0]); break;
                case POS.NNS:         // plural noun
                    filteredTerms.push(tw[0].toLowerCase().singularizeNoun());
                    break;
                case POS.NNP:         // proper noun
                    tw[0] = (tagger.wordInLexicon(tw[0].toLowerCase())) ? tw[0].toLowerCase().singularizeNoun() : tw[0];
                    filteredTerms.push(tw[0]); break;
                case POS.JJ:
                    if(keyAdjectives.indexOf(tw[0]) > -1)
                        filteredTerms.push(tw[0]); break;
            }
        });
        return filteredTerms;
    }


    var getDocumentKeywords = function(dIndex) {
        var docKeywords = {};
        alert('index: '+dIndex);
        tfidf.listTerms(dIndex).forEach(function(item){
            alert('term: '+item.term);
            if(isNaN(item.term) && parseFloat(item.tfidf) > 0 )
            {
                alert('tfidf: '+item.tfidf);
                docKeywords[item.term] = item.tfidf;
            }

        });
        return docKeywords;
    }




    /////////////////////////////////////////////////////////////////////////////

    var extractCollectionKeywords = function(collection, documentKeywords, minDocFrequency) {

        minDocFrequency = minDocFrequency ? minDocFrequency : s.minDocFrequency;
        var keywordDict = getKeywordDictionary(collection, documentKeywords, minDocFrequency);  //Buscar que hace getKeywordDictionary()

        /**
         * Modified by Jorch
         * @type {*|stem|stem|stem|stem|stem}
         */
        // get keyword variations (actual terms that match the same stem)
        /*collection.forEach(function(d){
            d.tokens.forEach(function(token){
                *//**
                 * Modified by Jorch
                 * @type {*|stem|stem|stem|stem|stem}
                 *//*
                var stem = token;//token.stem();
                if(keywordDict[stem] && stopWords.indexOf(token.toLowerCase()) == -1)
                    keywordDict[stem].variations[token] =
                        keywordDict[stem].variations[token] ? keywordDict[stem].variations[token] + 1 : 1;
            });
        });*/

        // compute keywords in proximity
        keywordDict = computeKeywordsInProximity(collection, keywordDict);			//Buscar que hace computeKeywordsInProximity()
        var collectionKeywords = [];

        _.keys(keywordDict).forEach(function(keyword){
            // Put keywords in proximity in sorted array
            var proxKeywords = [];
            _.keys(keywordDict[keyword].keywordsInProximity).forEach(function(proxKeyword){
                var proxKeywordsRepetitions = keywordDict[keyword].keywordsInProximity[proxKeyword];
                if(proxKeywordsRepetitions >= s.minRepetitionsProxKeywords)
                    proxKeywords.push({ stem: proxKeyword, repeated: proxKeywordsRepetitions });
            });
            keywordDict[keyword].keywordsInProximity = proxKeywords.sort(function(proxK1, proxK2){
                if(proxK1.repeated < proxK2.repeated) return 1;
                if(proxK1.repeated > proxK2.repeated) return -1;
                return 0;
            });

            /**
             * Modified by Jorch
             * @type {stem|*}
             */
            // get human-readable term for each stem key in the dictionary
            keywordDict[keyword].term = getRepresentativeTerm2(keywordDict[keyword]);		//Buscar que hace getRepresentativeTerm()

            // store each key-value in an array
            collectionKeywords.push(keywordDict[keyword]);
        });

        // sort keywords in array by document frequency
        collectionKeywords = collectionKeywords
            //.filter(function(ck){ return ck.repeated >= minRepetitions })
            .sort(function(k1, k2){
                if(k1.repeated < k2.repeated) return 1;
                if(k1.repeated > k2.repeated) return -1;
                return 0;
            });

/*        collectionKeywords.forEach(function(k, i){
            if(_.keys(k.variations).length == 0) {
                console.log(k);
                var ii = _.findIndex(collection, function(d){ return d.id == k.inDocument[0]; });
                console.log(collection[ii]);
            }
            k.term = getRepresentativeTerm(k);
        });*/

/*        console.log('dictionary');
        console.log(keywordDict);
        console.log('array');
        console.log(collectionKeywords);*/

        return { array: collectionKeywords, dict: keywordDict };
    };



    var getKeywordDictionary = function(_collection, _documentKeywords, _minDocFrequency) {

        var keywordDict = {};
        _documentKeywords.forEach(function(docKeywords, i){

            _.keys(docKeywords).forEach(function(stemmedTerm){
                if(!keywordDict[stemmedTerm]) {
                    keywordDict[stemmedTerm] = {
                        stem: stemmedTerm,
                        term: '',
                        repeated: 1,
                        variations: {},
                        inDocument : [_collection[i].id],
                        keywordsInProximity: {}
                    };
                }
                else {
                    keywordDict[stemmedTerm].repeated++;
                    keywordDict[stemmedTerm].inDocument.push(_collection[i].id);
                }
            });
        });

        _.keys(keywordDict).forEach(function(keyword){
            if(keywordDict[keyword].repeated < _minDocFrequency)
                delete keywordDict[keyword];
        });
        return keywordDict;
    };


    var computeKeywordsInProximity = function(_collection, _keywordDict) {
        _collection.forEach(function(d){
            d.tokens.forEach(function(token, i, tokens){
                /**
                 * Modified by Jorch
                 * @type {*|stem|stem|stem|stem|stem}
                 */
                var current = token;//token.stem();
                if(_keywordDict[current]) {   // current word is keyword

                    for(var j=i-s.maxKeywordDistance; j <= i+s.maxKeywordDistance; j++){
                        /**
                         * Modified by Jorch
                         * @type {*|stem|stem|stem|stem|stem}
                         */
                        //var prox = tokens[j] ? tokens[j].stem() : STR_UNDEFINED; //original version
                        var prox = tokens[j];

                        if(_keywordDict[prox] && current != prox) {
                            //var proxStem = prox.stem();
                            _keywordDict[current].keywordsInProximity[prox] = _keywordDict[current].keywordsInProximity[prox] ? _keywordDict[current].keywordsInProximity[prox] + 1 : 1;
                        }
                    }
                }
            });
        });
        //console.log(_keywordDict)
        return _keywordDict;
    };

    var getRepresentativeTerm = function(k){

        var keys = _.keys(k.variations);

        if(keys.length == 0){
            //alert('este es el error')
            return 'jor';
        }


        // Only one variations
        if(keys.length == 1)
            return keys[0];

        // 2 variations, one in lower case and the other starting in uppercase --> return in lower case
        if(keys.length == 2 && !keys[0].isAllUpperCase() && !keys[1].isAllUpperCase() && keys[0].toLowerCase() === keys[1].toLowerCase())
            return keys[0].toLowerCase();

        // One variation is repeated >= 75%
        var repetitions = 0;
        for(var i = 0; i < keys.length; ++i)
            repetitions += k.variations[keys[i]];

        for(var i = 0; i < keys.length; ++i)
            if(k.variations[keys[i]] >= parseInt(repetitions * 0.75))
                return keys[i];

        // One variation end in 'ion', 'ment', 'ism' or 'ty'
        for(var i = 0; i < keys.length; ++i)
            if(keys[i].match(/ion$/) || keys[i].match(/ment$/) || keys[i].match(/ism$/) || keys[i].match(/ty$/))
                return keys[i].toLowerCase();

        // One variation matches keyword stem
        if(k.variations[k.stem])
            return k.stem;

        // Pick shortest variation
        var shortestTerm = keys[0];
        for(var i = 1; i < keys.length; i++){
            if(keys[i].length < shortestTerm.length)
                shortestTerm = keys[i];
        }
        return shortestTerm.toLowerCase();
    };


/************************************************************************************************************************************
 *
 *   URANK PRIVATE METHODS TO ADAPT TO THE PROBLEM OF LABELING CONNECTIONS
 *
 ************************************************************************************************************************************/

    /**
     * Created by Jorch
     * @param collection
     * @returns {Array}
     */
    var extractDocumentKeywords = function(collection) {

        // Create each item's document to be processed by tf*idf
        //console.log(collection)
        var documentKeywords = [];
        collection.forEach(function(d,i) {
            //alert(d.text)
            d.tokens = d.text.split(' ')
            tfidf.addDocument(d.text);

        });

        // Save keywords for each document
        collection.forEach(function(d, i){
            //alert(i)
            documentKeywords.push(getDocumentKeywords2(i));
        });
        //console.log(documentKeywords);
        return documentKeywords;

    };

    /**
     * Created by Jorch
     * @param collection
     * @param documentKeywords
     * @param minDocFrequency
     * @returns {{array: Array, dict: *}}
     */
    var getDocumentKeywords2 = function(dIndex) {
        var docKeywords = {};
        //alert('index: '+dIndex);
        tfidf.listTerms(dIndex).forEach(function(item){
            //alert('term: '+item.term + 'tfidf: '+ parseFloat(item.tfidf));
            if (parseFloat(item.tfidf) > 0 )
            {
                //alert('tfidf: '+item.tfidf);
                docKeywords[item.term] = item.tfidf;
            }

        });
        return docKeywords;
    }


    /**
     * Created by Jorch
     * @param k
     * @returns {stem|*}
     */
    var getRepresentativeTerm2 = function(k){
        return k.stem;
    };



/********************************************************************************************************************************************
*
*   PROTOTYPE
*
*********************************************************************************************************************************************/

    KeywordExtractor.prototype = {
        addDocument: function(document, id) {
            document = (!Array.isArray(document)) ? document : document.join(' ');
            id = id || this.collection.length;
            this.collection.push({ id: id, text: document });
        },
        processCollection: function() {
            tfidf = new natural.TfIdf();
            var timestamp = $.now();
            this.documentKeywords = extractDocumentKeywords(this.collection);
            var collectionKeywords = extractCollectionKeywords(this.collection, this.documentKeywords);
            this.collectionKeywords = collectionKeywords.array;
            this.collectionKeywordsDict = collectionKeywords.dict;

            var miliseconds = $.now() - timestamp;
            var seconds = parseInt(miliseconds / 1000);
            console.log('Keyword extraction finished in ' + seconds + ' seconds, ' + miliseconds%1000 + ' miliseconds (=' + miliseconds + ' ms)');
        },
        listDocumentKeywords: function(index) {
            return this.documentKeywords[index];
        },
        getCollectionKeywords: function() {
            return this.collectionKeywords;
        },
        getCollectionKeywordsDictionary: function() {
            return this.collectionKeywordsDict;
        },
        clear: function() {
            tfidf = null;
            this.collection = [];
            this.documentKeywords = [];
            this.collectionKeywords = [];
            this.collectionKeywordsDict = {};
        }
    };

    return KeywordExtractor;
})();












