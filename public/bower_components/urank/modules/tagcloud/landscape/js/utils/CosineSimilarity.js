function CosineSimilarity() {

	// -----------------------------------------------------------------------
	CosineSimilarity.prototype.getCosineSimilarties = function(data) {

		var documentSize = data.length;

		var cosineSimilarities = createEmptyArray(documentSize,0);
		// console.log("double[][] cosineSimilarity = new double["+documentSize+"]["+documentSize+"];")
		data.forEach(function(currDocument, i){
			var keywords0 = currDocument.keywords;
			var currDocId = currDocument.index;
			var currDocCosineSim = createEmptyArray(documentSize,0);
			data.forEach(function(nextDocument, j){
				var cosineSim = getCosineSimilarityOfTwoDocuments(currDocument, nextDocument);
				var nextDocId = nextDocument.index;
				if( !isNaN(cosineSim)) {
					currDocCosineSim[nextDocId] = cosineSim;
				}
				// console.log("cosineSimilarity["+currDocId+"]["+nextDocId+"] = " + cosineSim + ";")
         	});

     		cosineSimilarities[currDocId] = currDocCosineSim;

         });
		 // console.log("return cosineSimilarity;")
		return cosineSimilarities;
	};
	// -----------------------------------------------------------------------
	function getCosineSimilarityOfTwoDocuments(document0, document1){
		var keywords0 = document0.keywords;
		var keywords1 = document1.keywords;
		var globalKeywords = createGlobalKeywords(keywords0, keywords1);
		var termFreqVec0 = createTermFrequencyVector(keywords0, globalKeywords);
		var termFreqVec1 = createTermFrequencyVector(keywords1, globalKeywords);
		return calcCosineSimilarity(termFreqVec0, termFreqVec1);

	};

	function createGlobalKeywords(keywords0, keywords1) {
		var globalKeywords = {};
		for (var key in keywords0) {
			globalKeywords[key] = true;
		}
		for (var key in keywords1) {
			globalKeywords[key] = true;
		}
		return globalKeywords;
	};

	function createTermFrequencyVector(keywordsMap, globalKeywords) {
		var termFrequencyVector = [];
		for (var term in globalKeywords) {
			var freq = keywordsMap[term] || 0;
			termFrequencyVector.push(freq);
		}
		return termFrequencyVector;
	}

	function calcVectorDotProduct(vector0, vector1) {
		var doctProduct = 0;
		for (var i = 0; i < vector0.length; i++) {
			doctProduct += vector0[i] * vector1[i];
		}
		return doctProduct;
	}

	function calcVectorMagnitude(vecor) {
		var magnitude = 0;
		for (var i = 0; i < vecor.length; i++) {
			magnitude += vecor[i] * vecor[i];
		}
		return Math.sqrt(magnitude);
	}

	function calcCosineSimilarity(vector0, vector1) {
		var vectorDotProduct = calcVectorDotProduct(vector0, vector1);
		var vectorMagnitude = calcVectorMagnitude(vector0) * calcVectorMagnitude(vector1);
		var cosineSimilarity = vectorDotProduct / vectorMagnitude;
		return cosineSimilarity;
	}

	function createEmptyArray(size, value) {

		var array = new Array(size);
		for (var i = 0; i < size; i++) {
			array[i] = value;
		}
		return array;
	}

}
