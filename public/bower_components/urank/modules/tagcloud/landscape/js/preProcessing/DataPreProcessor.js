var DataPreProcessor = (function(){

	var dataObjectTextKey = "description";
	var dataset = new Object();
	var landscapeInputData = "";
	var keywords; ""; 
	var keywordExtractor = "";
	var me = this;

	// constructor
	function DataPreProcessor(data, keywordExtractor, keywords) {
		this.dataObjectTextKey = "description";
		this.dataset = data;
		this.landscapeInputData = "";
		this.keywordExtractor = keywordExtractor; 
		this.keywords = keywords,
        dataset = data;
        me = this;
	}

	// -----------------------------------------------------------------------
	DataPreProcessor.prototype.createInputForLandscape = function() {
		if(this.keywordExtractor == "") {
			extractWeightedKeywords(); 
		}
		var cosineSimilarity = new CosineSimilarity();
		var cosineSimBetweenAllDocuments = cosineSimilarity.getCosineSimilarties(this.dataset);
		createLandscapeInputString(cosineSimBetweenAllDocuments);
	};

	// -----------------------------------------------------------------------
	DataPreProcessor.prototype.getProcessedLandscapeVisdata = function(visLandscapeData){
		visLandscapeData = JSON.parse(visLandscapeData);
		visLandscapeData.documents = getProcessedVisdataDocuments(visLandscapeData.documents);
		visLandscapeData.labels.labels = getProcessedVisdataLabels(visLandscapeData);
		// console.log("visLandscapeData", visLandscapeData)
		return visLandscapeData;
	};

	// -----------------------------------------------------------------------
	DataPreProcessor.prototype.getDataset = function() {
		return dataset;
	};

	// -----------------------------------------------------------------------
	DataPreProcessor.prototype.getTagCloudData = function (documentsIds){

		var documentKeywords = [];
		var dataLength = dataset.length;
		for (var j = 0; j < documentsIds.length; j++) {
			var id = documentsIds[j];
			if (dataLength > id) {
				documentKeywords.push(dataset[id].keywords);
			}
		}
		
		var tagSet = getTagsForGivenDocuments(documentsIds);
		var tagCloud = []
		var tagsNum = 15;
		if(tagSet.length < tagsNum) {
			tagsNum =tagSet.length;
		}

		for (var x = 0; x < tagsNum; x++) {
			var term = tagSet[x].term;
			var stem = tagSet[x].stem;
			var variations = tagSet[x].variations[term];
			var weight = 0;
			var counter = 0;
			for(var y= 0; y < documentKeywords.length; y++) {
				if(documentKeywords[y][stem] !== undefined) {
					weight = weight + documentKeywords[y][stem];

				}
				counter++;
			}
			var tagObj = {}


			tagObj.text = term;
			tagObj.stem = stem;
			tagObj.keywords = tagSet[x];
			tagObj.size= weight/counter;
			if (landscapeConfig.getLandscapeType() == "urankLandscape") {
				for(var index = 0; index < this.keywords.length; index++){
					var keywordStem = this.keywords[index].stem; 
					if( keywordStem != stem) {
						continue; 
					}
					else {
						tagObj.index = index; 
						tagCloud.push(tagObj);
					}
		      	}
			}
			else {
				tagCloud.push(tagObj);
			}
			
		}
		return tagCloud;
	};

	// -----------------------------------------------------------------------
	DataPreProcessor.prototype.getLandscapeInputString = function(){
		return landscapeInputData;
	};

	// -----------------------------------------------------------------------
	DataPreProcessor.prototype.getLandscapParamsConfig = function() {
		
		var fdPParameterSet = new Object();
		fdPParameterSet["TEXT_SIMILARITY_STANDARD_SEPARATION"] = "TEXT_SIMILARITY_STANDARD_SEPARATION";
		fdPParameterSet["TEXT_SIMILARITY_STRONG_SEPARATION"] = "TEXT_SIMILARITY_STRONG_SEPARATION";
		fdPParameterSet["TEXT_SIMILARITY_WEAK_SEPARATION"] = "TEXT_SIMILARITY_WEAK_SEPARATION";
		fdPParameterSet["CROSS_MEDIA_SIMILARITY"] = "CROSS_MEDIA_SIMILARITY";
		fdPParameterSet["TEXT_SIMILARITY_FAKE_CLUSTERS"] = "TEXT_SIMILARITY_FAKE_CLUSTERS";
		fdPParameterSet["EXTENDED_DISTANCE"] = "EXTENDED_DISTANCE";
		fdPParameterSet["DISTANCE"] = "DISTANCE";
		fdPParameterSet["ANGULAR_LD_SPACE"] = "ANGULAR_LD_SPACE";
		fdPParameterSet["CUSTOM"] = "CUSTOM";
		fdPParameterSet["TEXT_SIMILARITY_STANDARD_SEPARATION_USE_GIVEN_COORDS"] = "TEXT_SIMILARITY_STANDARD_SEPARATION_USE_GIVEN_COORDS";
		currentParameter = fdPParameterSet["TEXT_SIMILARITY_STRONG_SEPARATION"]; 
		if(landscapeConfig.getLandscapeType() != "urankLandscape") {	
			var currentParameter = fdPParameterSet[$( "#landscapeAlgSelection option:selected" ).text()]; 
		}
		return JSON.stringify({
			"peaks" : {
				"peakRadius" : 0.2,
				"minDistBeetwPeaks" : 0.4
			},
			"FDP" : {
				"parameterSet":currentParameter
			}
		});
	};

	DataPreProcessor.prototype.getObjectsBasedOnTag = function(tag) {
		var docIndices = [];
		var docData = []
		dataset.forEach(function(d,index){
			
			if(Object.keys(d.keywords).indexOf(tag) != -1) {
				docIndices.push(index);
				docData.push(d);
			}
        });
        
        return {"indices": docIndices, "dataList":docData } ;
	}
	
	DataPreProcessor.prototype.getDatasetByIds = function (documentsIds){

		var documentDataset = [];
		var dataLength = dataset.length;
		for (var j = 0; j < documentsIds.length; j++) {
			var id = documentsIds[j];
			if (dataLength > id) {
				documentDataset.push(dataset[id]);
			}
		}
		return documentDataset;
	};






	// -----------------------------------------------------------------------
	var extractWeightedKeywords = function() {
		var arguments = {
            /**
             * Modified by Jorch
             */
            //minRepetitions : (parseInt(dataset.length * 0.05) > 1) ? parseInt(dataset.length * 0.05) : 2  //original version
            minRepetitions : 1
        };
        me.keywordExtractor = new KeywordExtractor(arguments);
		var indexCounter = 0;

		dataset.forEach(function(d) {
			d.id = d.id.replace(/([^A-Za-z0-9[\]{}_.:-])\s?/g, '_');
			d.index = indexCounter++;
			d.isSelected = false;
			d.title = d.title.clean();
			if (d.description == null || d.description == 'undefined') {
				d.description = "";
			}
			d.description = d.description.clean();
            var document = (d.description) ? d.title + '. ' + d.description : d.title;
            me.keywordExtractor.addDocument(document.removeUnnecessaryChars(), d.id);

		});


        me.keywordExtractor.processCollection();

        dataset.forEach(function(d, i){
            d.keywords = me.keywordExtractor.listDocumentKeywords(i);
        });
        dataset.keywords = me.keywordExtractor.getCollectionKeywords();
	};



	// -----------------------------------------------------------------------
	var createLandscapeInputString = function(cosineSim){
		var documentsList = [];
		var datasetTemp =  $.extend(true, {}, dataset);
        dataset.forEach(function(currDocument){
        	var documentObj = new Object();
        	// delete currDocument.description;
             // delete currDocument.keywords;
        	documentObj.index = currDocument.index;
        	documentObj.metadata = currDocument;
        	documentsList.push(documentObj);
        });
        var landscapeInputDataObj = new Object();
		landscapeInputDataObj.documents = documentsList;
		landscapeInputDataObj.cosineSimilariy = cosineSim;
		landscapeInputData =  JSON.stringify(landscapeInputDataObj);
	};


	// -----------------------------------------------------------------------
	var getProcessedVisdataLabels = function (visLandscapeData){
        var labelCounter = 0;
        var labels = new Object();
        var labelPeaks = visLandscapeData.labelPeaks_;

        var labelDictionary = {};
        var labelCounter = 0;
        for(var i=0; i < labelPeaks.length; i++) {
            var numOfLabels = 3;
        	var labelId = "label_"+labelCounter++;
        	var labelObj = labelPeaks[i];
        	var documentsIds = labelObj["docIndexIds"];
			var tempDataset = getTagsForGivenDocuments(documentsIds);
			if(tempDataset.length < numOfLabels) {
				numOfLabels = tempDataset.length  - 1;
			}
			var labelSet = tempDataset.slice(0,numOfLabels);
			var labelSetNew = []; 
			if (landscapeConfig.getLandscapeType() == "urankLandscape") {
				var test = me.keywords;
				for(var index = 0; index < me.keywords.length; index++){
					var keywordStem = me.keywords[index].stem; 
					for(var z=0; z < labelSet.length; z++) {
						var stem = labelSet[z].stem; 
						if( keywordStem == stem) {
							labelSet[z].index = index; 
							labelSetNew.push(labelSet[z]);
						
						}
					}
		      	}
		      	var labelSet = labelSetNew; 
			}
	
			
			var labelsText = [];
			var keywords = [];
			for(var x =0; x < labelSet.length; x++ ) {
				var term = labelSet[x].term;
				var stem = labelSet[x].stem;
				labelsText.push(labelSet[x].term);
				var peaksIds= [];
				if(term in labelDictionary) {
					peaksIds = labelDictionary[term];
				}
				peaksIds.push(labelId);
				labelDictionary[term] = peaksIds;
			}
			var newLabelObj = new Object();
			newLabelObj.labels = labelsText;
			newLabelObj.keywords = labelSet;
			newLabelObj.coordinates = [labelObj.posx, labelObj.posy];
			newLabelObj.depth = 0;
			newLabelObj.docs = documentsIds;
			newLabelObj.weight = 0;
			labels[labelId] = newLabelObj;

        }

		return getRefinedLabels(labels, labelDictionary);

	};

	// -----------------------------------------------------------------------
	var getTagsForGivenDocuments = function (documentsIds){
        
		var documentKeywords = [];
		var dataLength = dataset.length;	
        var datasetNew = []; 
		for (var j = 0; j < documentsIds.length; j++) {
			var index = documentsIds[j];
			if (dataLength > index) {
				datasetNew.push(dataset[index]);
			
			}
		}
		var newPos = new Pos(); 
		var arguments = {
            /**
             * Modified by Jorch
             */
	        //minRepetitions : (parseInt(dataset.length * 0.05) > 1) ? parseInt(dataset.length * 0.05) : 2,     //original version
	        //minDocFrequency: 2
            minRepetitions : 1,
            minDocFrequency: 1
        };
        
        var keywordExtractorNew = new KeywordExtractor(arguments);
        var indexCounter = 0;

		datasetNew.forEach(function(d) {
			d.id = d.id.replace(/([^A-Za-z0-9[\]{}_.:-])\s?/g, '_');
			d.index = indexCounter++;
			d.isSelected = false;
			if (d.description == null || d.description == 'undefined') {
				d.description = "";
			}
			d.description = d.description.clean();
			d.title = d.title.clean();
            var document = (d.description) ? d.title + '. ' + d.description : d.title;
			keywordExtractorNew.addDocument(document.removeUnnecessaryChars(), d.id);

		});


        keywordExtractorNew.processCollection();
        datasetNew.keywords = keywordExtractorNew.getCollectionKeywords();
        return  datasetNew.keywords;    
             
	};
	

	// -----------------------------------------------------------------------
	var getProcessedVisdataDocuments = function(documents){

		for(docId in documents) {
			var metadata = JSON.parse(documents[docId].metadata);
			documents[docId].metadata = metadata;

		}
		return documents;
	};


	var getRefinedLabels = function(labels, labelsDictionary){
		var minBeetweenPeaksLength = 0.2;
		var labelCounter = Object.keys(labels).length;
		// console.log("labels", labels )
		// console.log("labelsDictionary", labelsDictionary )
		var addedLabels = []
		$.each(labelsDictionary, function(labelText, peaksIds) {
			if(peaksIds.length > 1 ) {
				var xPos = 0;
				var yPos = 0;
				// var lenthBetweenPeaks = getPeaksWithMinBeetweenLength(labels, peaksIds, minBeetweenPeaksLength);
				for(var i=0; i < peaksIds.length; i++) {
					var peakId = peaksIds[i];
					var labelObj = labels[peakId];
					xPos = xPos + labelObj.coordinates[0];
					yPos = yPos + labelObj.coordinates[1];
					var index = labelObj.labels.indexOf(labelText);
					if(index != -1) {
						labelObj.labels.splice(index, 1);
						labels[peakId].labels = labelObj.labels;
					}
				}

				xPos = xPos / peaksIds.length;
				yPos = yPos / peaksIds.length;

				for(var z=0; z < addedLabels.length; z++) {
					var pos0 =  labels[addedLabels[z]].coordinates[0];
					var pos1 =  labels[addedLabels[z]].coordinates[1];
					if(xPos == pos0 && yPos == pos1) {
						xPos = xPos + 0.05;
						yPos = yPos + 0.05;

					}
				}
				var keywordsArrayObj = []
				var keywords = {}
				keywords.inDocument = [];
				keywords.keywordsInProximity = [];
				keywords.repeated =  0;
				keywords.stem =  "";
				keywords.term =  "";
				keywords.variations = {};
				for(var j=0; j < dataset.length; j++) {
					if(dataset[j].term == labelText) {
						keywords.inDocument = dataset[j].inDocument ;
						keywords.keywordsInProximity = dataset[j].keywordsInProximity;
						keywords.repeated =  dataset[j].repeated ;
						keywords.stem =  dataset[j].stem ;
						keywords.term =  dataset[j].term ;
						keywords.variations = dataset[j].variations;
						break;
					}
				}
				
			
				if (landscapeConfig.getLandscapeType() == "urankLandscape") {
					for(var index = 0; index < me.keywords.length; index++){
						var keywordterm = me.keywords[index].term; 
						if( keywordterm == labelText) {
							keywords = me.keywords[index]; 
							keywords.index = index; 
							keywordsArrayObj.push(keywords); 
							break; 
						}

			      	}
				}
				var newLabelObj = new Object();
				newLabelObj.labels = [labelText];
				newLabelObj.keywords = keywordsArrayObj;
				newLabelObj.coordinates = [xPos, yPos];
				newLabelObj.depth = 0;
				newLabelObj.docs = [];
				newLabelObj.weight = peaksIds.length;
				labelCounter++;
				addedLabels.push("label_"+labelCounter);
				labels["label_"+labelCounter] = newLabelObj;

			}

		});

		
		return labels;
	}

	var getPeaksWithMinBeetweenLength = function(labels, peaksIds, minBeetweenLength) {
		var peaksWithMinBeetweenLength = {};
		for (var i = 0; i < peaksIds.length; i++) {
			var peakIdA = peaksIds[i];
			var xPosA = labels[peakIdA].coordinates[0];
			var yPosA = labels[peakIdA].coordinates[1];

			for (var j = 0; j < peaksIds.length; j++) {
				var peakIdB = peaksIds[j];
				if(peakIdA == peakIdB) {
					continue
				}
				var xPosB = labels[peakIdB].coordinates[0];
				var yPosB = labels[peakIdB].coordinates[1];
				var length = Math.sqrt(Math.pow((xPosA - xPosB), 2) + Math.pow((yPosA - yPosB), 2));
				if(length <= minBeetweenLength) {
					peaksWithMinBeetweenLength[peakIdA] = true;
					peaksWithMinBeetweenLength[peakIdA] = true;
				}
			}

		}
		return peaksWithMinBeetweenLength;

	}

    return DataPreProcessor;
})();
