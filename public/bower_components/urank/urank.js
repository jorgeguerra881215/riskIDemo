
var Urank = (function(){

    var _this, s = {},
        contentList, tagCloud, tagBox, visCanvas, docViewer;
    // Color scales
    var tagColorRange = colorbrewer.Blues[TAG_CATEGORIES + 1].slice(1, TAG_CATEGORIES+1);
  //  tagColorRange.splice(tagColorRange.indexOf("#08519c"), 1, "#2171b5");
    var queryTermColorRange = colorbrewer.Set2[8];
    queryTermColorRange.splice(queryTermColorRange.indexOf("#ffff33"), 1, "#ffd700");

    var connectionList = [];
    var connection_id = [];

    //Cuatro HashTable para almacenar las conexiones y optimizar las busquedas.
    var ipInitial = {}, ipEnd = {}, connectionPort = {}, connectionProtocol = {}, labels_id = {}, ids_label = {}, list_ids = [];
    //Cantidad de elementos seleccionados
    var count_selected = 0;
    // Estructura para almacenar datos para testing
    var testing_data = []

    //   defaults
    var defaultInitOptions = {
        root: 'body',
        tagCloudRoot: '',
        tagBoxRoot: '',
        contentListRoot: '',
        visCanvasRoot: '',
        docViewerRoot: '',
        onLoad: function(keywords){},
        onChange: function(rankingData, selecedKeywords){},
        onItemClicked: function(documentId){},
        onDeselectItem: function(documentId){},
        onItemMouseEnter: function(documentId){},
        onItemMouseLeave: function(documentId){},
        onFaviconClicked: function(documentId){},
        onWatchiconClicked: function(documentId){},
        onTagInCloudMouseEnter: function(index){},
        onTagInCloudMouseLeave: function(index){},
        onTagInCloudClick: function(index){},
        onDocumentHintClick: function(index){},
        onKeywordHintMouseEnter: function(index){},
        onKeywordHintMouseLeave: function(index){},
        onKeywordHintClick: function(index){},
        onTagDeleted: function(index){},
        onTagDropped: function(index, queryTermColor){},
        onTagInBoxMouseEnter: function(index){},
        onTagInBoxMouseLeave: function(index){},
        onTagInBoxClick: function(index){},
        onReset: function(){},
        onRankByOverallScore: function(){},
        onRankByMaximumScore: function(){},
        onShowSequence: function(){}
    };

    var defaultLoadOptions = {
        tagCloud : {
            module: 'default',      // default || landscape
            misc: {
                defaultBlockStyle: true,
                customScrollBars: true
            }
        },
        contentList: {
            custom: false,
            customOptions: {     //  only used when contentListType.custom = true
                selectors: {
                    root: '',
                    ul: '',
                    liClass: '',
                    liTitle: '',
                    liRankingContainer: '',  // will be formatted
                    watchicon: '',           // adds watchicon in placeholder
                    favicon: ''              // adds favicon in placeholder
                },
                classes: {
                    liHoverClass: '',
                    liLightBackgroundClass: '',
                    liDarkBackgroundClass: ''
                },
                misc: {
                    hideScrollbar: false
                }
            }
        },
        visCanvas : {
            module: 'ranking',
            customOptions: {               // use only if contentList.custom = true and background in the ranking should match different light and dark background colors
                lightBackgroundColor: '',
                darkBackgroundColor: ''
            },
            misc: {
                hideScrollbar: true
            }
        },
        tagBox: {
            misc: {
                defaultBlockStyle: true
            }
        },
        docViewer: {
            misc: {
                defaultBlockStyle: true,
                customScrollBars: true,
                facetsToShow: []
            }
        },
        misc: {
            tagColorArray: tagColorRange,
            queryTermColorArray: queryTermColorRange
        }
    };


var enterLog = function(value){
    //var scriptURL = "http://localhost/loginapp/server/log.php",
    var scriptURL = "http://itic.uncu.edu.ar:8880/riskIDemo/server/log.php",
        date = new Date(),
        timestamp = date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate() + '_' + date.getHours() + '.' + date.getMinutes() + '.' + date.getSeconds(),
        userName = $('#username').html(),
        userToken = $('#usertoken').html(),
        sessionId = $('#sessionid').html(),
        urankState = sessionId + ',' + userName +',' + userToken + ',' + timestamp+','+value + ', full app',
        gf = [{ filename: 'urank_labeled_' + timestamp + '.txt', content: urankState }];//JSON.stringify(urankState)

    $.generateFile({ filename: "bookmarks.json", content: urankState, script: scriptURL });

    return false;
}
    var calculateCharacteristicVector = function(value){
        var rep_sNP = /[R-Z]/, count_sNP = 0;
        var rep_wNP = /[r-z]/, count_wNP = 0;
        var rep_wP = /[A-I]/, count_wP = 0;
        var rep_sP = /[a-i]/, count_sP = 0;
        //Duration feature
        var rep_dS = {a:1,A:1,r:1,R:1,d:1,D:1,u:1,U:1,g:1,G:1,x:1,X:1/*,1:1,4:1,7:1*/}, count_dS = 0;
        var rep_dM = {b:1,B:1,s:1,S:1,e:1,E:1,v:1,V:1,h:1,H:1,y:1,Y:1/*,2:1,5:1,8:1*/}, count_dM = 0;
        var rep_dL = {c:1,C:1,t:1,T:1,f:1,F:1,w:1,W:1,i:1,I:1,z:1,Z:1/*,3:1,6:1,9:1*/}, count_dL = 0;
        //Size feature
        var rep_sS = {a:1,A:1,b:1,B:1,c:1,C:1,r:1,R:1,s:1,S:1,t:1,T:1/*,1:1,2:1,3:1*/}, count_sS = 0;
        var rep_sM = {d:1,D:1,e:1,E:1,f:1,F:1,u:1,U:1,v:1,V:1,w:1,W:1/*,4:1,5:1,6:1*/}, count_sM = 0;
        var rep_sL = {g:1,G:1,h:1,H:1,i:1,I:1,x:1,X:1,y:1,Y:1,z:1,Z:1/*,7:1,8:1,9:1*/}, count_sL = 0;

        var description = value;
        var count  = description.length;
        var i = count
        while(i--){
            var letter = description[i];
            //Count periodicity feature
            if(rep_sNP.test(letter)){
                count_sNP ++;
            }
            else if(rep_wNP.test(letter)){
                count_wNP++;
            }
            else if(rep_wP.test(letter)){
                count_wP++;
            }
            else if(rep_sP.test(letter)){
                count_sP++;
            }

            //Count duration feature
            if(letter in rep_dS){
                count_dS++;
            }
            else if(letter in rep_dM){
                count_dM++;
            }
            else if(letter in rep_dL){
                count_dL++;
            }

            //Count size feature
            if(letter in rep_sS){
                count_sS++;
            }
            else if(letter in rep_sM){
                count_sM++;
            }
            else if(letter in rep_sL){
                count_sL++;
            }
        }

        var count_of_letter = count_sNP + count_wNP + count_wP + count_sP;

        //Count periodicity feature
        var porcent_count_sNP = ((count_sNP * 100)/ count_of_letter)/100;
        var porcent_count_wNP = ((count_wNP * 100)/ count_of_letter)/100;
        var porcent_count_wP = ((count_wP * 100)/ count_of_letter)/100;
        var porcent_count_sP = ((count_sP * 100)/ count_of_letter)/100;

        //Count duration feature
        var porcent_count_dS = ((count_dS * 100)/ count_of_letter)/100;
        var porcent_count_dM = ((count_dM * 100)/ count_of_letter)/100;
        var porcent_count_dL = ((count_dL * 100)/ count_of_letter)/100;

        //Count size feature
        var porcent_count_sS = ((count_sS * 100)/ count_of_letter)/100;
        var porcent_count_sM = ((count_sM * 100)/ count_of_letter)/100;
        var porcent_count_sL = ((count_sL * 100)/ count_of_letter)/100;

        return  porcent_count_sNP.toString() +','+
            porcent_count_wNP.toString() +','+
            porcent_count_wP.toString() +','+
            porcent_count_sP.toString() +','+
            porcent_count_dS.toString() +','+
            porcent_count_dM.toString() +','+
            porcent_count_dL.toString() +','+
            porcent_count_sS.toString() +','+
            porcent_count_sM.toString() +','+
            porcent_count_sL.toString();
    }

    var getLetterSequences = function(data){
        return data
        //Usar el resto del codigo si estamos trabajando con secuencia de letras como palabras.
        /*var sequence = '';
        var words = data.split(' ');
        for(var i = 0; i < words.length; i++){
            if(words[i].length != words[i+1].length){
                sequence += words[i];
                break;
            }
            sequence += words[i][0];
        }
        return sequence;*/
    }


    /**
     * Computing L1 distance between vectors
     * @param v1
     * @param v2
     * @returns {number}
     */
    var vectorDistance = function(v1,v2){
        var vector1 = v1.split(','), vector2 = v2.split(',');
        var result = 0;
        vector1.forEach(function(d,i){
            result += Math.abs(parseFloat(d) - parseFloat(vector2[i]));
        });
        return result;
    }

    var getCluster = function(data){
        var result = {};
        result[1] = [];
        result[2] = [];
        result[3] = [];
        data.forEach(function(item,index){
            var cluster = item.cluster;
            result[cluster].push(item);
            var characteristicVector = calculateCharacteristicVector(item.description);
            item.characteristicVector = characteristicVector;
        });
        return result;
    }

    var cosineSimilarity = function(v1,v2){
        var vector1 = v1.split(','), vector2 = v2.split(',');
        var AxB = 0;
        var scalarA = 0;
        var scalarB = 0;
        vector1.forEach(function(d,i){
            AxB += parseFloat(d) * parseFloat(vector2[i]);
            scalarA += parseFloat(d) * parseFloat(d);
            scalarB += parseFloat(vector2[i]) * parseFloat(vector2[i]);
            //result += Math.abs(parseFloat(d) - parseFloat(vector2[i]));
        });
        var similarity = AxB / (Math.sqrt(scalarA) * Math.sqrt(scalarB));
        return similarity;
    }

    var sortBySimilarityToTheFirstConnection = function(data){
        var documentReference = null;
        var conexionSimilarity = {};
        var conexionid = {};
        var result = [];
        data.forEach(function(item,index){
            var letterSequences = getLetterSequences(item.description);
            var characteristicVector = item.characteristicVector//calculateCharacteristicVector(letterSequences);
            var list_num = characteristicVector.split(',')
            var feature_vector_list = [
                parseInt(list_num[0]),
                parseInt(list_num[1]),
                parseInt(list_num[2]),
                parseInt(list_num[3]),
                parseInt(list_num[4]),
                parseInt(list_num[5]),
                parseInt(list_num[6]),
                parseInt(list_num[7]),
                parseInt(list_num[8]),
                parseInt(list_num[9])
            ]

            item.letterSequence = letterSequences;
            //item.characteristicVector = characteristicVector;
            item.feature_vector_list = feature_vector_list;
            if(documentReference == null){
                documentReference = characteristicVector;
            }
            //var diference = vectorDistance(documentReference, characteristicVector);
            var diference = cosineSimilarity(documentReference, characteristicVector);
            //conexionSimilarity[diference] = item;
            conexionSimilarity[item.id] = diference;
            conexionid[item.id] = item
            //This code is to create characteristic vector data set using urank_logs.txt file
            //enterText(characteristicVector + ',' +letterSequences.length+','+item.title+','+item.label);
        });
        /*Object.keys(conexionSimilarity).sort(function(a,b){return b-a}).forEach(function(key,i){
            result.push(conexionSimilarity[key]);
        });*/
        var items = Object.keys(conexionSimilarity).map(function(key) {
            return [key, conexionSimilarity[key]];
        });
        items.sort(function(first, second) {
            return second[1] - first[1];
        });
        //console.log(items.slice(0, 5));
        items.forEach(function(item){
            result.push(conexionid[item[0]]);
        })
        return result;
    }

    var sortBySimilarityToTheEnterConnection = function(data,connection){
        var documentReference = null;
        var letterSequences = getLetterSequences(connection.description);
        //var characteristicVector = calculateCharacteristicVector(letterSequences);
        documentReference = calculateCharacteristicVector(letterSequences);
        var conexionSimilarity = {};
        var conexionid = {};
        var result = [];
        data.forEach(function(item){
            var letterSequences = getLetterSequences(item.description);
            var characteristicVector = item.characteristicVector //calculateCharacteristicVector(letterSequences);
            item.letterSequence = letterSequences;
            //item.characteristicVector = characteristicVector;
            //var diference = vectorDistance(documentReference, characteristicVector);
            var diference = cosineSimilarity(documentReference, characteristicVector);
            conexionSimilarity[item.id] = diference;
            conexionid[item.id] = item
        });
        /*Object.values(conexionSimilarity).sort(function(a,b){return b-a}).forEach(function(key,i){
            result.push(key);
        });*/

        var items = Object.keys(conexionSimilarity).map(function(key) {
            return [key, conexionSimilarity[key]];
        });
        items.sort(function(first, second) {
            return second[1] - first[1];
        });
        //console.log(items.slice(0, 5));
        items.forEach(function(item){
            result.push(conexionid[item[0]]);
        })
        return result;
    }

    var processingData = function(data){
        var clusters = getCluster(data);
        var cluster1 = sortBySimilarityToTheFirstConnection(clusters[1]);//clusters[1];
        var cluster2 = sortBySimilarityToTheFirstConnection(clusters[2]);//clusters[2];
        var cluster3 = sortBySimilarityToTheFirstConnection(clusters[3]);//clusters[3];
        return cluster1.concat(cluster2).concat(cluster3);
        //return sortBySimilarityToTheFirstConnection(data);
    }

    var getDataOrdered = function(data,connection){
        var clusters = getCluster(data);
        var cluster1 = [];
        var cluster2 = [];
        var cluster3 = [];

        switch(connection.cluster){
            case '1':
                cluster1 = sortBySimilarityToTheEnterConnection(clusters[1],connection);
                cluster2 = sortBySimilarityToTheFirstConnection(clusters[2]);
                cluster3 = sortBySimilarityToTheFirstConnection(clusters[3]);
                break;
            case '2':
                cluster1 = sortBySimilarityToTheFirstConnection(clusters[1]);
                cluster2 = sortBySimilarityToTheEnterConnection(clusters[2],connection);
                cluster3 = sortBySimilarityToTheFirstConnection(clusters[3]);
                break;
            case '3':
                cluster1 = sortBySimilarityToTheFirstConnection(clusters[1]);
                cluster2 = sortBySimilarityToTheFirstConnection(clusters[2]);
                cluster3 = sortBySimilarityToTheEnterConnection(clusters[3],connection);
                break;
        }

        return cluster1.concat(cluster2).concat(cluster3);
    }

    var climbUpConnection = function(data, connection){
        connectionList.push(connection);
        connection_id.indexOf(connection.id) == -1 ? connection_id.push(connection.id):null;
        var aux = [];
        if(connection.title == 'Unlabelled'){ //Si seleccionamos una conexion sin etiquetar entonces ordeno por los mas similares
            var similar_data = _this.getSimilarConnectionsById(connection.id)
            var first_similar_botnet = true, first_similar_normal = true //Variable para quedarme con la conexion botnet/normal mas similar a la seleccionada
            similar_data.forEach(function(item){
                item.id != connection.id && connection_id.indexOf(item.id) == -1 ? aux.push(item) : null;
                if(item.title == 'Botnet' && first_similar_botnet){
                    first_similar_botnet = false
                    _this.moreSimilarBotnet = item
                    _this.firstSimilar = _this.firstSimilar == ''? 'botnet' : _this.firstSimilar
                }
                if(item.title == 'Normal' && first_similar_normal){
                    first_similar_normal = false
                    _this.moreSimilarNormal = item
                    _this.firstSimilar = _this.firstSimilar == ''? 'normal' : _this.firstSimilar
                }
                if(!first_similar_botnet  && !first_similar_normal){
                    return false
                }
            });
        }
        else{//En caso contrario dejo el listado como esta sacando la nueva conexion seleccionada
            data.forEach(function(item){
             item.id != connection.id && connection_id.indexOf(item.id) == -1 ? aux.push(item) : null;
             });
        }
        return connectionList.concat(aux);
    }

    var climbDownConnection = function(data, connection){
        var element_index = connection_id.indexOf(connection.id);
        if(element_index != -1){
            connection_id.splice(element_index,1);
        }
        connectionList.forEach(function(item,index){
            if(item.id == connection.id){
                connectionList.splice(index,1);
                return;
            }
        });
        var aux = [];
        data.forEach(function(item){
            connection_id.indexOf(item.id) == -1 ? aux.push(item) : null;
        });

        return connectionList.concat(aux);
    }

    var enterText = function(value){
        var scriptURL = '/server/log.php',
            urankState = value;

        $.generateFile({ filename: "bookmarks.json", content: urankState, script: scriptURL });

        return false;
    }

    var randomUnlabelled = function(){
        var numberList = [];
        var countOfElement = _this.data.length;
        var countOfUnlabelledElement = countOfElement/4;
        Math.floor((Math.random() * 10) + 1);
        for(var i = 0; i < countOfUnlabelledElement; i++){
            var random = Math.floor((Math.random() * countOfElement));
            if(numberList.indexOf(random) == -1){
                numberList.push(random);
                _this.data[random].title = "Unlabelled";
            }
            else{
                i--;
            }
        }
    }

    var getFilterParameter = function(value){
        var ip_origen = [];
        var ip_dest = [];
        var port = [];
        var protocol = [];
        $('.filter-initial-port:checkbox:checked').each(function(index){
            ip_origen.push($(this).attr('value'));
        });
        $('.filter-end-port:checkbox:checked').each(function(index){
            ip_dest.push($(this).attr('value'));
        });
        $('.filter-port:checkbox:checked').each(function(index){
            port.push($(this).attr('value'));
        });
        $('.filter-protocol:checkbox:checked').each(function(index){
            protocol.push($(this).attr('value'));
        });
        value.initialIp = ip_origen;
        value.endIp = ip_dest;
        value.port = port;
        value.protocol = protocol;

    }
    /**
     * Filter function
     * Before get all connection ids using filters hashtable.
     * Next get max connection id list to create a union hashtable. In keys is union ids and in hashtable[id] is number of list that exist this id.
     * Finally loops for min id list and if hashtable[id] is equal to number of filter (this means that id element is in all set, is element in the intersection)
     * insert id element in the result list.
     * @param ipsInitial IP0 filters selected in connection viewer
     * @param ipsEnd IP1 filters selected in connection viewer
     * @param ports ports filters selected in connection viewer
     * @param protocols protocols filters selected in connection viewer
     * @param label connection label filters selected on top of connection list
     * @returns {Array} List of connection after filter applied
     */
    var filter = function(ipsInitial, ipsEnd, ports, protocols,label){
        label = (label != 'All') ? label : ''
        if(!ipsInitial.length && !ipsEnd.length && !ports.length && !protocols.length){
            return label == '' ? list_ids : labels_id[label]
        }
        var ids_ipInitial = [], ids_ipDest = [], ids_port = [], ids_protocol = [], result = [], union_hash = {};
        var filter_count = 0;

        //Obtener los ids de las conexiones.
        ipsInitial.forEach(function(item){
            filter_count += 1
            ids_ipInitial = ids_ipInitial.concat(ipInitial[item]);
        });
        ipsEnd.forEach(function(item){
            filter_count += 1
            ids_ipDest = ids_ipDest.concat(ipEnd[item]);
        });
        ports.forEach(function(item){
            filter_count += 1
            ids_port = ids_port.concat(connectionPort[item]);
        });
        protocols.forEach(function(item){
            filter_count += 1
            ids_protocol = ids_protocol.concat(connectionProtocol[item]);
        });

        //Obteniendo la mayor lista
        var maxLength = Math.max(ids_ipInitial.length, ids_ipDest.length, ids_port.length, ids_protocol.length);

        //Hacer la Union en un Hashtable para obtimizar la interseccion despues. De esta manera en union.keys esta la union de los ids de las conexiones filtradas
        for(var i = 0; i < maxLength; i++){
            if(ids_ipInitial.length > i){
                ids_ipInitial[i] in union_hash ? union_hash[ids_ipInitial[i]] += 1 : union_hash[ids_ipInitial[i]] = 1;
            }
            if(ids_ipDest.length > i){
                ids_ipDest[i] in union_hash ? union_hash[ids_ipDest[i]] += 1 : union_hash[ids_ipDest[i]] = 1;
            }
            if(ids_port.length > i){
                ids_port[i] in union_hash ? union_hash[ids_port[i]] += 1 : union_hash[ids_port[i]] = 1;
            }
            if(ids_protocol.length > i){
                ids_protocol[i] in union_hash ? union_hash[ids_protocol[i]] += 1 : union_hash[ids_protocol[i]] = 1;
            }
        }

        if(ids_ipInitial.length < Math.max(ids_ipDest.length, ids_port.length, ids_protocol.length) || (ids_ipDest.length == 0 && ids_port.length == 0 && ids_protocol.length == 0)){//ids_ipInitial es la menor lista
            ids_ipInitial.forEach(function(id){
                if((union_hash[id] == filter_count) && (label == '' || ids_label[id] == label)){
                    result.push(id);
                }
            });
        }

        if(ids_ipDest.length < Math.max(ids_ipInitial.length, ids_port.length, ids_protocol.length) || (ids_ipInitial.length == 0 && ids_port.length == 0 && ids_protocol.length == 0)){//ids_ipDest es la menor lista
            ids_ipDest.forEach(function(id){
                if((union_hash[id] == filter_count) && (label == '' || ids_label[id] == label)){
                    result.push(id);
                }
            });
        }

        if(ids_port.length < Math.max(ids_ipDest.length, ids_ipInitial.length, ids_protocol.length) || (ids_ipDest.length == 0 && ids_ipInitial.length == 0 && ids_protocol.length == 0)){//ids_ipPort es la menor lista
            ids_port.forEach(function(id){
                if((union_hash[id] == filter_count) && (label == '' || ids_label[id] == label)){
                    result.push(id);
                }
            });
        }

        if(ids_protocol.length < Math.max(ids_ipDest.length, ids_port.length, ids_ipInitial.length) || (ids_ipDest.length == 0 && ids_ipInitial.length == 0 && ids_port.length == 0)){//ids_ipProtocol es la menor lista
            ids_protocol.forEach(function(id){
                if((union_hash[id] == filter_count) && (label == '' || ids_label[id] == label)){
                    result.push(id);
                }
            });
        }

        return result;

    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var EVTHANDLER = {

        onLoad: function(data, options) {
            //console.log(data)

            _this.clear();
            var o = $.extend(true, defaultLoadOptions, options || {});

            //  Set color scales (need to be reset every time a new dataset is loaded)
            o.tagColorArray = o.misc.tagColorArray.length >= TAG_CATEGORIES ? o.misc.tagColorArray : tagColorRange;
            o.queryTermColorArray = o.misc.queryTermColorArray.length >= TAG_CATEGORIES ? o.misc.queryTermColorArray : queryTermColorRange;
            _this.tagColorScale = null;
            _this.tagColorScale = d3.scale.ordinal().domain(d3.range(0, TAG_CATEGORIES, 1)).range(o.tagColorArray);
            _this.queryTermColorScale = null;
            _this.queryTermColorScale = d3.scale.ordinal().range(o.queryTermColorArray);

            //  Initialize keyword extractor
            var keywordExtractorOptions = { minRepetitions: (parseInt(data.length * 0.05) >= 5) ? parseInt(data.length * 0.05) : 5 };
            var keywordExtractor = new KeywordExtractor(keywordExtractorOptions);

            //  Clean documents and add them to the keyword extractor
            var primaryData = typeof data == 'string' ? JSON.parse(data) : data.slice();
            _this.data = processingData(primaryData);

            //Getting random unlabelled connections
            //randomUnlabelled();


            contentList.build(_this.data, o.contentList);

            _this.data.forEach(function(d, i){

                //Getting random unlabelled connections
                if(d.botprob != "NA"){
                    d.title = "Unlabelled"
                }

                //d.characteristicVector = "";
                d.index = i;
                //d.title = d.title.clean();
                d.description = d.description.clean();
                /**
                 * Modified by Jorch
                 * Only using the connections words to build the tags block
                 * @type {string}
                 */
                //var document = (d.description) ? d.title +'. '+ d.description : d.title; //original version
                var document = (d.description) ? d.description : "";

                /**
                 * Modified by Jorch
                 */
                //keywordExtractor.addDocument(document.removeUnnecessaryChars(), d.id); //original version
                keywordExtractor.addDocument(document, d.id);

                /**
                 * Generating Matrix of Similarity
                 */
                _this.similarity_matrix[d.id] = sortBySimilarityToTheEnterConnection(_this.data,d)

                /**
                 * Preparing Data for Testing
                 */
                if(d.title == 'Botnet' || d.title == 'Normal'){
                    d.feature_vector_list = d.feature_vector_list.push(d.title)
                    testing_data.push(d.feature_vector_list)
                }

                /**
                 * Filling filter hash
                 */
                var connection_id= d.connection_id;
                var members = connection_id.split('-');
                var ip_origen = members[0];
                ip_origen in ipInitial ? ipInitial[ip_origen].push(d.id) : ipInitial[ip_origen] = [d.id];
                var ip_det = members[1];
                ip_det in ipEnd ? ipEnd[ip_det].push(d.id) : ipEnd[ip_det] = [d.id];
                var port = members[2];
                port in connectionPort ? connectionPort[port].push(d.id) : connectionPort[port] = [d.id];
                var protocol = members[3];
                protocol in connectionProtocol ? connectionProtocol[protocol].push(d.id) : connectionProtocol[protocol] = [d.id]
                list_ids.push(d.id);
                ids_label[d.id] = d.title
                d.title in labels_id ? labels_id[d.title].push(d.id) : labels_id[d.title] = [d.id]

                /**
                 * Build Each element in the list
                 * */
                contentList.buildOneElement(d,i);
             });

            _this.rankingMode = RANKING_MODE.overall_score;
            _this.rankingModel.clear().setData(_this.data);
            _this.selectedKeywords = [];
            _this.selectedId = STR_UNDEFINED;

            //  Extract collection and document keywords
            //keywordExtractor.processCollection();

            //  Assign document keywords
            /*_this.data.forEach(function(d, i){
                d.keywords = keywordExtractor.listDocumentKeywords(i);
            });*/

            //  Assign collection keywords and set other necessary variables
            /*_this.keywords = keywordExtractor.getCollectionKeywords();
            _this.keywordsDict = keywordExtractor.getCollectionKeywordsDictionary();*/


            //  Build blocks
/*            var buildOpt = {
                contentList: o.contentList,
                tagCloud:    o.tagCloud, { customScrollBars: o.misc.customScrollBars }),
                tagBox:      $.extend(o.tagBox, { customScrollBars: o.misc.customScrollBars }),
                visCanvas:   $.extend(o.visCanvas, { customScrollBars: o.misc.customScrollBars }),
                docViewer:   $.extend(o.docViewer, { customScrollBars: o.misc.customScrollBars })
            };*/
            //tagCloud.build(_this.keywords, _this.data, _this.tagColorScale, o.tagCloud, _this.keywordsDict);
            tagBox.build(o.tagBox);
            visCanvas.build(contentList.getListHeight(), o.visCanvas);
            docViewer.build(o.docViewer);

            //  Bind event handlers to resize window and undo effects on random click
            $(window).off('resize', EVTHANDLER.onResize).resize(EVTHANDLER.onResize);
            $(s.root)
            .off({
                'mousedown': EVTHANDLER.onRootMouseDown,
                'click': EVTHANDLER.onRootClick
            }).on({
                'mousedown': EVTHANDLER.onRootMouseDown,
                'click': EVTHANDLER.onRootClick
            });

            $('body > div.main-panel > div.central-panel > div.vis-panel').scroll(function () {
                var top = $(this).position().top;
                var left = $(this).position().left;
                var count  = count_selected//$('li.list-selected').length
                if ($(this).scrollTop() > (26 * count) ) {
                    var i = 0;
                    $('li.list-selected').each(function(index){
                        var item  = $(this)
                        if(!item.hasClass('li-nonshow')){
                            var x = top + (26*i);
                            item.css('z-index','99');
                            item.css('position','fixed');
                            item.css('left',left);
                            item.css('top', x);
                            //var width2 = $('#connection-list > li:nth-child(2)').css('width');
                            var width = $('#connection-list').css('width');//$('#connection-list > li:nth-child('+ (count+1) +')').css('width');
                            item.css('width', width);
                            i++;
                        }
                    });
                } else {

                    $('li.list-selected').each(function(index){
                        var item  = $(this)
                        if(!item.hasClass('li-nonshow')){
                            item.css('z-index','');
                            item.css('position','');
                            item.css('left','');
                            item.css('top', '');
                        }
                    });
                }
            });

            //  Custom callback
            s.onLoad.call(this, _this.keywords);

        },

        onChange: function(selectedKeywords) {

            /**
             * Modified by Jorch
             * @type {*}
             */
            docViewer.updateSelectedKeys(selectedKeywords);

            _this.selectedKeywords = selectedKeywords;
            _this.selectedId = STR_UNDEFINED;

            var rankingData = _this.rankingModel.update(_this.selectedKeywords, _this.rankingMode).getRanking();
            var status = _this.rankingModel.getStatus();
            contentList.update(rankingData, status, _this.selectedKeywords, _this.queryTermColorScale);
            visCanvas.update(_this.rankingModel, _this.queryTermColorScale, contentList.getListHeight());
            docViewer.clear();
            tagCloud.clearEffects();

            s.onChange.call(this, rankingData, _this.selectedKeywords, status);
        },


        onTagDropped: function(index) {
            var stem = $('#urank-tag-'+index).attr('stem');
            var queryTermColor = _this.queryTermColorScale(stem);
            //var queryTermColor = _this.queryTermColorScale(_this.keywords[index].stem);
            tagBox.dropTag(index, queryTermColor);
            s.onTagDropped.call(this, index, queryTermColor);
        },

        onTagDeleted: function(index) {
            tagBox.deleteTag(index);
            tagCloud.restoreTag(index);
            s.onTagDeleted.call(this, index);
        },

        onTagInCloudMouseEnter: function(index) {
            tagCloud.hoverTag(index);
            s.onTagInCloudMouseEnter.call(this, index);
        },

        onTagInCloudMouseLeave: function(index) {
            tagCloud.unhoverTag(index);
            s.onTagInCloudMouseLeave.call(this, index);
        },

        onTagInCloudClick: function(index) {
            // TODO
            s.onTagInCloudClick.call(this, index);
        },

        onKeywordHintEnter: function(index) {
            tagCloud.keywordHintMouseEntered(index);
            s.onKeywordHintMouseEnter.call(this, index);
        },

        onKeywordHintLeave: function(index) {
            tagCloud.keywordHintMouseLeft(index);
            s.onKeywordHintMouseLeave.call(this, index);
        },

        onKeywordHintClick: function(index) {
            tagCloud.keywordHintClicked(index);
            s.onKeywordHintClick.call(this, index);
        },

        onDocumentHintClick: function(index) {
            tagCloud.documentHintClicked(index);
            var idsArray = _this.keywords[index].inDocument;
            contentList.highlightListItems(idsArray);
            visCanvas.highlightItems(idsArray).resize(contentList.getListHeight());

            s.onDocumentHintClick.call(this, index);
        },

        onTagInBoxMouseEnter: function(index) {
            // TODO
            s.onTagInBoxMouseEnter.call(this, index);
        },

        onTagInBoxMouseLeave: function(index) {
            // TODO
            s.onTagInBoxMouseLeave.call(this, index);
        },

        onTagInBoxClick: function(index) {
            // TODO
            s.onTagInBoxClick.call(this, index);
        },

        onItemClicked : function(documentId) {
            _this.selectedId = _this.selectedId === documentId ? STR_UNDEFINED : documentId;

            if(_this.selectedId !== STR_UNDEFINED) {    // select

                var connection = _this.rankingModel.getDocumentById(documentId);

                //Save connection selected in dictionary
                _this.connection_selected[connection.index] = connection
                _this.connection_selected_list[connection.index] = connection

                //var new_list = getDataOrdered(_this.data,connection);
                var new_list = climbUpConnection(_this.data,connection);
                var count_of_selected_items = connection_id.length;
                contentList.orderVisualEfect();
                contentList.orderedList(new_list, count_of_selected_items);

                contentList.selectMultipleListItem(connection_id);
                $('body > div.main-panel > div.central-panel > div.vis-panel').scrollTop(0,0);

                //contentList.selectListItem(documentId);
                visCanvas.selectItem(documentId);
                contentList.onWatchListItem(documentId);
                var heatmap = contentList.createHeatmapRepresentation(connection.characteristicVector)//createHeatmapVisualRepresentation(connection.description)
                if(connection.title == 'Unlabelled'){

                    docViewer.showDocument(connection, _this.selectedKeywords.map(function(k){return k.stem}), _this.queryTermColorScale,null,heatmap);

                    //Mostrar conexiones comparativas en el mismo orden que aparecen en el listado
                    if(_this.firstSimilar == 'botnet'){
                        heatmap = contentList.createHeatmapRepresentation(_this.moreSimilarBotnet.characteristicVector)////createHeatmapVisualRepresentation(_this.moreSimilarBotnet.description)
                        docViewer.showDocument(_this.moreSimilarBotnet, _this.selectedKeywords.map(function(k){return k.stem}), _this.queryTermColorScale, connection,heatmap);
                        heatmap = contentList.createHeatmapRepresentation(_this.moreSimilarNormal.characteristicVector)//createHeatmapVisualRepresentation(_this.moreSimilarNormal.description)
                        docViewer.showDocument(_this.moreSimilarNormal, _this.selectedKeywords.map(function(k){return k.stem}), _this.queryTermColorScale, connection,heatmap);

                        //Save connection botnet and normal in dictionary
                        _this.connection_selected[_this.moreSimilarBotnet.index] = _this.moreSimilarBotnet
                        _this.connection_selected[_this.moreSimilarNormal.index] = _this.moreSimilarNormal
                    }
                    else{
                        heatmap = contentList.createHeatmapRepresentation(_this.moreSimilarNormal.characteristicVector)//createHeatmapVisualRepresentation(_this.moreSimilarNormal.description)
                        docViewer.showDocument(_this.moreSimilarNormal, _this.selectedKeywords.map(function(k){return k.stem}), _this.queryTermColorScale, connection,heatmap);
                        heatmap = contentList.createHeatmapRepresentation(_this.moreSimilarBotnet.characteristicVector)//createHeatmapVisualRepresentation(_this.moreSimilarBotnet.description)
                        docViewer.showDocument(_this.moreSimilarBotnet, _this.selectedKeywords.map(function(k){return k.stem}), _this.queryTermColorScale, connection,heatmap);

                        //Save connection botnet and normal in dictionary
                        _this.connection_selected[_this.moreSimilarNormal.index] = _this.moreSimilarNormal
                        _this.connection_selected[_this.moreSimilarBotnet.index] = _this.moreSimilarBotnet
                    }
                    _this.firstSimilar = ''

                    //docViewer.showDocument(connection, _this.selectedKeywords.map(function(k){return k.stem}), _this.queryTermColorScale,_this.moreSimilarBotnet,_this.moreSimilarNormal);
                    contentList.onWatchListItem(_this.moreSimilarNormal.id);
                    contentList.onWatchListItem(_this.moreSimilarBotnet.id);
                }
                else{
                    docViewer.showDocument(connection, _this.selectedKeywords.map(function(k){return k.stem}), _this.queryTermColorScale, null, heatmap);
                }

                $('li[urank-id = '+ documentId+']').addClass('list-selected')
                count_selected += 1//Object.keys(_this.connection_selected).length
            }
            else {                   // deselect
                count_selected = 0;
                $('li').removeClass('list-selected')
                contentList.deselectAllListItems();
                visCanvas.deselectAllItems();
                docViewer.clear();
            }
            //tagCloud.clearEffects();
            s.onItemClicked.call(this, documentId);
        },

        onDeselectItem: function(documentId){
            var connection = _this.rankingModel.getDocumentById(documentId);

            //Remove connection from connection selected list
            delete _this.connection_selected[connection.index]

            if(connection.index in _this.connection_selected_list){
                //Remove connection from connection selected list
                delete _this.connection_selected_list[connection.index]
                count_selected -= 1
            }

            var new_list = climbDownConnection(_this.data,connection);
            var count_of_selected_items = connection_id.length;
            contentList.orderedList(new_list, count_of_selected_items);
            $('li[urank-id = '+ documentId+']').removeClass('list-selected')
            s.onDeselectItem.call(this, documentId);
        },

        onItemMouseEnter: function(documentId) {
            contentList.hover(documentId);
            visCanvas.hoverItem(documentId);
            s.onItemMouseEnter.call(this, documentId);
        },

        onItemMouseLeave: function(documentId) {
            contentList.unhover(documentId);
            visCanvas.unhoverItem(documentId);
            s.onItemMouseLeave.call(this, documentId);
        },

        onFaviconClicked: function(documentId){
            contentList.toggleFavicon(documentId);
            s.onFaviconClicked.call(this, documentId);

            /**
             * Modified by Jorch
             * @type {{name: string, score: number}}
             */
            var scriptURL = '/server/save.php',
             date = new Date(),
             timestamp = date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate() + '_' + date.getHours() + '.' + date.getMinutes() + '.' + date.getSeconds(),
             urankState = _this.urank.getCurrentState(),
             gf = $('#select-download').val() == '2files' ?
             [{ filename: 'urank_selected_keywords_' + timestamp + '.txt', content: JSON.stringify(urankState.selectedKeywords) },
             { filename: 'urank_ranking_' + timestamp + '.txt', content: JSON.stringify(urankState.ranking) }] :
             [{ filename: 'urank_state_' + timestamp + '.txt', content: JSON.stringify(urankState) }];
            var obj = {
                name: 'Dhayalan',
                score: 100
            };
            var content  = JSON.stringify(obj);
            $.generateFile({ filename: "bookmarks.json", content: content, script: '/server/save.php' });
        },

        onWatchiconClicked: function(documentId) {
            contentList.toggleWatchListItem(documentId);
            s.onWatchiconClicked.call(this, documentId);
        },

        onRootMouseDown: function(event){
            event.stopPropagation();
            if(event.which == 1) {
                tagCloud.clearEffects();
            }
        },

            onRootClick: function(event) {
            if(event.which == 1) {
                contentList.clearEffects();
                visCanvas.clearEffects().resize(contentList.getListHeight());
                docViewer.clear();
            }
        },

        onParallelBlockScrolled: function(sender, offset) {
            if(sender === contentList)
                visCanvas.scrollTo(offset);
            else if(sender == visCanvas)
                contentList.scrollTo(offset);
        },

        onResize: function(event) {
            visCanvas.resize();
        },

        // Event handlers to return
        onRankByOverallScore: function() {
            _this.rankingMode = RANKING_MODE.overall_score;
            EVTHANDLER.onChange(_this.selectedKeywords);
            s.onRankByOverallScore.call(this);
        },

        /**
         * Created by Jorch
         */
        onFindNotLabeled: function(value,aux){
            //$('.processing-message').html('Processing Query...');
            //$('.processing-message').show();
            //console.log(value);
            value = {
                unlabelled:$('#chek-find-not-labeled').is(':checked') ? $('#chek-find-not-labeled').attr('value') : '',
                bot:$('#chek-find-botnet').is(':checked') ? $('#chek-find-botnet').attr('value') : '',
                notBot:$('#chek-find-normal').is(':checked') ? $('#chek-find-normal').attr('value') : '',
                all:$('#chek-find-All').is(':checked') ? $('#chek-find-All').attr('value') : '',
                initialIp:null,
                endIp:null,
                port:null,
                protocol:null
            }

            getFilterParameter(value);
            var label = value.unlabelled + value.bot + value.notBot + value.all;
            //label = label.charAt(0).toUpperCase() + label.slice(1); //haciendo la primera letra mayuscula
            var list = filter(value.initialIp, value.endIp, value.port, value.protocol,label)

            contentList.selectManyListItem(list);

            //Esto es para mantener los elementos seleccionados en el filtro y no queden los que estaban antes de aplicar el filtro
            count_selected = 0;
            list.forEach(function(id){
                if($('li[urank-id = '+ id+']').hasClass('list-selected'))
                    count_selected += 1
            });

            var filters = value.unlabelled + ' ' + value.bot + ' ' + value.notBot + ' ' + value.all + ' (IP_0)' + value.initialIp + ' (IP_1)' + value.endIp+ ' (Port)' + value.port + ' (Protocol)' + value.protocol + ' ';
            enterLog('Filter,0');//+filters);
            //$('.processing-message').hide();
            //$('.processing-message').html('Processing Data...');

        },
        /**
         * Created by Jorch
         */
        onEnterLog: function(value){
            //var scriptURL = "http://localhost/loginapp/server/log.php",
            var scriptURL = "http://itic.uncu.edu.ar:8880/riskIDemo/server/log.php",
                date = new Date(),
                timestamp = date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate() + '_' + date.getHours() + '.' + date.getMinutes() + '.' + date.getSeconds(),
                userName = $('#username').html(),
                userToken = $('#usertoken').html(),
                sessionId = $('#sessionid').html(),
                urankState = sessionId + ',' + userName +',' + userToken + ',' + timestamp+','+value + ', full app',
                gf = [{ filename: 'urank_labeled_' + timestamp + '.txt', content: urankState }];//JSON.stringify(urankState)

            $.generateFile({ filename: "bookmarks.json", content: urankState, script: scriptURL });

            return false;
        },

        onFindBotnet:function(value){
            var botnets = [];
            _this.data.forEach(function(d, i){
                if(!value.currentTarget['checked']){
                    botnets.push(d.id);
                }
                else{
                    //console.log(d.index);
                    var label = d.title;

                    /*if(label.split(' ')[1] == 'Botnet'){
                     notLabeled.push(d.id);
                     }*/
                    if(label == 'Botnet'){
                        botnets.push(d.id);
                    }
                }

            });
            contentList.selectManyListItem(botnets);
        },
        /**
         * Created by Jorch
         */
        onChekFindNotLabeled: function(){
            alert('checked');
            var notLabeled = [];
            _this.data.forEach(function(d, i){
                //console.log(d.index);
                var label = d.title;
                if(label.split(' ')[1] == 'Botnet'){
                    notLabeled.push(d.id);
                }
            });
            //console.log(notLabeled);
            contentList.selectManyListItem(notLabeled);
        },

        onRankByMaximumScore: function() {
            _this.rankingMode = RANKING_MODE.max_score;
            EVTHANDLER.onChange(_this.selectedKeywords);
            s.onRankByMaximumScore.call(this);
        },

        onReset: function(event) {
            if(event) event.stopPropagation();
            contentList.reset();
            connectionList = [];
            connection_id = [];
            contentList.orderedList(_this.data,0);
            //tagCloud.reset();
            //tagBox.clear();
            //visCanvas.reset();
            //docViewer.clear();
            _this.rankingModel.reset();
            _this.selectedId = STR_UNDEFINED;
            _this.selectedKeywords = [];
            docViewer.reset();
            s.onReset.call(this);

            //Clean Connection Viewer section
            $("#btn-close-connections").trigger('click');
            //$('#viscanvas > div > div').html('');

            //enter Log
            enterLog('Ranking Reset,0');
        },

        onShowSequence: function(event){
            if(event) event.stopPropagation();
            $("#dialog-seguence").html('')
            var main_div = $('<div></div>')
            var seq_element = ''
            //var class_label = 'unlabelled'
            Object.keys(_this.connection_selected).forEach(function(key){
                var seq = _this.connection_selected[key].description
                var index = _this.connection_selected[key].index + 1
                var current_label = _this.connection_selected[key].title
                var class_label = current_label.toLowerCase()
                seq_element = '<div style="margin: 5px;"><div><label class="urank-docviewer-attributes urank-docviewer-details-label '+ class_label +'" ><span>'+ index + ' | ' + current_label +'</span></label></div><div><p style="font-size: 1em">'+ seq +'</p></div></div>'
                main_div.append(seq_element)
            })

/*
            <label id="index-label-1" class="urank-docviewer-attributes urank-docviewer-details-label unlabelled">1 | <span id="label-1">Unlabelled</span></label>
*/

            $("#dialog-seguence").html(main_div);
            $("#dialog-seguence").dialog( "open" );

            enterLog('Show Sequence Connection,0');

            s.onShowSequence.call(this);
        },

        onCloseConnections: function(event){
            if(event) event.stopPropagation();
            Object.keys(_this.connection_selected).forEach(function(key){
                var id = _this.connection_selected[key].id
                $("#btn-close-connection-"+id).trigger('click');
            })
            //s.onCloseConnections.call(this);
        },

        onDestroy: function() {
            tagCloud.destroy();
            tagBox.destroy();
            contentList.destroy();
            visCanvas.destroy();
            docViewer.destroy();
        },

        onClear: function() {
            tagCloud.clear();
            tagBox.clear();
            docViewer.clear();
/*            contentList.destroy();
            visCanvas.destroy();*/
        },
        /**
         * Modified by Jorch
         */
        onUpdateTagsCloud: function(stf_value,pattern_value,length_value,order_by_periodicity,options){
            var o = $.extend(true, defaultLoadOptions, options || {});
            tagCloud.build(_this.keywords, _this.data, _this.tagColorScale, o.tagCloud, _this.keywordsDict,stf_value,pattern_value,length_value,order_by_periodicity);
        },

        onUpdateLabelDictionary: function (id_connection, new_label) {
            Object.keys(labels_id).forEach(function(currentKey) {
                var index = labels_id[currentKey].indexOf(id_connection);
                if (index > -1) {
                    labels_id[currentKey].splice(index, 1);
                }
            });
            labels_id[new_label]
            new_label in labels_id ? labels_id[new_label].push(id_connection) : labels_id[new_label] = [id_connection]
        }
    };



    // Constructor
    function Urank(arguments) {

        _this = this;
        // default user-defined arguments
        s = $.extend(defaultInitOptions, arguments);

        var options = {
            contentList: {
                root: s.contentListRoot,
                onItemClicked: EVTHANDLER.onItemClicked,
                onDeselectItem: EVTHANDLER.onDeselectItem,
                onItemMouseEnter: EVTHANDLER.onItemMouseEnter,
                onItemMouseLeave: EVTHANDLER.onItemMouseLeave,
                onFaviconClicked: EVTHANDLER.onFaviconClicked,
                onWatchiconClicked: EVTHANDLER.onWatchiconClicked,
                onScroll: EVTHANDLER.onParallelBlockScrolled
            },

            tagCloud: {
                root: s.tagCloudRoot,
                onTagInCloudMouseEnter: EVTHANDLER.onTagInCloudMouseEnter,
                onTagInCloudMouseLeave: EVTHANDLER.onTagInCloudMouseLeave,
                onTagInCloudClick: EVTHANDLER.onTagInCloudClick,
                onDocumentHintClick: EVTHANDLER.onDocumentHintClick,
                onKeywordHintMouseEnter : EVTHANDLER.onKeywordHintEnter,
                onKeywordHintMouseLeave : EVTHANDLER.onKeywordHintLeave,
                onKeywordHintClick : EVTHANDLER.onKeywordHintClick
            },

            tagBox: {
                root: s.tagBoxRoot,
                onChange: EVTHANDLER.onChange,
                onTagDropped: EVTHANDLER.onTagDropped,
                onTagDeleted: EVTHANDLER.onTagDeleted,
                onTagInBoxMouseEnter: EVTHANDLER.onTagInBoxMouseEnter,
                onTagInBoxMouseLeave: EVTHANDLER.onTagInBoxMouseLeave,
                onTagInBoxClick: EVTHANDLER.onTagInBoxClick
            },

            visCanvas: {
                root: s.visCanvasRoot,
                onItemClicked: EVTHANDLER.onItemClicked,
                onItemMouseEnter: EVTHANDLER.onItemMouseEnter,
                onItemMouseLeave: EVTHANDLER.onItemMouseLeave,
                onScroll: EVTHANDLER.onParallelBlockScrolled
            },

            docViewer: {
                root: s.docViewerRoot
            }
        };

        this.data = [];
        this.keywords = [];
        this.keywordsDict = {};
        this.rankingModel = new RankingModel();
        this.similarity_matrix = {}
        this.moreSimilarBotnet = null;
        this.moreSimilarNormal = null;
        this.firstSimilar = '';
        this.connection_selected = {}
        this.connection_selected_list = {}

        contentList = new ContentList(options.contentList);
        tagCloud = new TagCloud(options.tagCloud);
        tagBox = new TagBox(options.tagBox);
        visCanvas = new VisCanvas(options.visCanvas);
        docViewer = new DocViewer(options.docViewer);
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  Miscelaneous
    /**
     * Modified by Jorch
     */
   /* var MISC2 = {
        getCurrentLabeled: function(){
            return{
                ranking: _this.rankingModel.getRanking().map(function(d){
                    return {
                        id: d.id,
                        label: d.title,
                        status: d.description + '\n'
                    }
                })
            };
        }
    };*/

    var MISC = {
        getCurrentState: function(){
            /*return {
                mode: _this.rankingMode,
                status: _this.rankingModel.getStatus(),
                selectedKeywords: _this.selectedKeywords.map(function(sk){ return { term: sk.term, weight: sk.weight } }),
                ranking: _this.rankingModel.getRanking().map(function(d){
                    return {
                        id: d.id,
                        title: d.title,
                        rankingPos: d.rankingPos,
                        overallScore: d.overallScore,
                        maxScore: d.maxScore,
                        positionsChanged: d.positionsChanged,
                        weightedKeywords: d.weightedKeywords.map(function(wk){ return { term: wk.term, weightedScore: wk.weightedScore } })
                    }
                })
            };*/
            var terms = '';
            //_this.selectedKeywords.map(function(sk){ terms = terms+'  ' + sk.term + '('+sk.weight+')' });
            //var text = 'Labeling using that terms: '+ terms+'\n';
            var text = '[\n';//'ID | Label | Keywords \n';
            var id_term = [];
            var result = [];
            this.rankingModel.getRanking().map(function(d){
                if('terms' in d){
                    //text = text + d.id +' | '+ d.title + ' | '+  d.terms+ '\n';//+ ' | ' + d.description+'\n';
                    id_term[d.id] = d.terms;
                }
                /*else{
                    text = text + d.id +' | '+ d.title + '\n';//+ ' | ' + d.description+'\n';
                }*/
            });
            this.data.map(function(d){
                result.push(
                    {
                        id: d.id,
                        title: d.title,
                        uri:"http://www.mendeley.com",
                        excessURI: "http://www.mendeley.com",
                        creator:"David J Reinkensmeyer, Jeremy L Emken, Steven C Cramer",
                        description: d.description,
                        collectionName: "",
                        keyword: d.id in id_term ? id_term[d.id]: d.keyword,
                        observation: d.observation,
                        connection_id: d.connection_id,
                        cluster: d.cluster,
                        facets:{provider: "mendeley",year: "2004"}+'\n'
                    }
                );

                //text = text + d.id +' | '+ d.title + '\n';
            });
            return result;
        },
        getCurrentData: function(){
            var next_line = "\n";
            var result = "Label | Id | Connection Id | Sequence" + next_line;
            this.data.forEach(function(item,index){
                var sequence = getLetterSequences(item.description);
                var aux = item.title + ' | ' + item.id +' | ' + item.connection_id + '    | ' + sequence + next_line;
                result += aux;
            });
            return result;
        },
        selectMultipleListItem: function(){
            contentList.selectMultipleListItem(connection_id);
        },
        getDocumentById:function(documentId){
            return _this.rankingModel.getDocumentById(documentId);
        },
        getSimilarConnectionsById:function(documentId){
           return _this.similarity_matrix[documentId]
        },
        saveLabeling: function(){
            var scriptURL = "http://itic.uncu.edu.ar:8880/riskID/app/server/save.php",
                date = new Date(),
                timestamp = date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate() + '_' + date.getHours() + '.' + date.getMinutes() + '.' + date.getSeconds(),
                urankState = this.getCurrentState(),
                gf = [{ filename: 'urank_labeled_' + timestamp + '.txt', content: JSON.stringify(urankState) }];//JSON.stringify(urankState)

            $.generateFile({ filename: "bookmarks.json", content: JSON.stringify(urankState), script: scriptURL });
        }
    };



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  Prototype


    Urank.prototype = {
        loadData: EVTHANDLER.onLoad,
        reset: EVTHANDLER.onReset,
        rankByOverallScore: EVTHANDLER.onRankByOverallScore,
        rankByMaximumScore: EVTHANDLER.onRankByMaximumScore,
        findNotLabeled: EVTHANDLER.onFindNotLabeled,
        enterLog:EVTHANDLER.onEnterLog,
        //findBotnet:EVTHANDLER.onFindBotnet,
        //checkfindNotLabeled: EVTHANDLER.onChekFindNotLabeled(),
        clear: EVTHANDLER.onClear,
        destroy: EVTHANDLER.onDestroy,
        getCurrentState: MISC.getCurrentState,
        getCurrentData: MISC.getCurrentData,
        saveLabeling: MISC.saveLabeling,
        getDocumentById: MISC.getDocumentById,
        getSimilarConnectionsById: MISC.getSimilarConnectionsById,
        selectMultipleListItem: MISC.selectMultipleListItem,
        updateTagsCloud: EVTHANDLER.onUpdateTagsCloud,
        updateLabelDictionary: EVTHANDLER.onUpdateLabelDictionary,
        onTagDropped:EVTHANDLER.onTagDropped,
        onChange:EVTHANDLER.onChange,
        onDeselectItem:EVTHANDLER.onDeselectItem,
        onWatchiconClicked:EVTHANDLER.onWatchiconClicked,
        onShowSequence: EVTHANDLER.onShowSequence,
        onCloseConnections: EVTHANDLER.onCloseConnections
        /**
         * Modified by Jorch
         */
        //getCurrentLabeled: MISC2.getCurrentLabeled()
    };

    return Urank;



})();
