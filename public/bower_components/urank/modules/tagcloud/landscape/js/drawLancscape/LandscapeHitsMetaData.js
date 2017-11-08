/**
 * @author Santokh Singh
 *
 */
function LandscapeHitsMetaData(hitsMetaData) {
	this.hitsMetaData = hitsMetaData;

	// -----------------------------------------------------------------------
	LandscapeHitsMetaData.prototype.getDocIdsRelToTermAndType = function(term, type){
		var documentsIds = [];
		$.each(this.hitsMetaData, function( index, metadataObj ) {
			var docId = metadataObj['id'];
			var metadata = metadataObj['metadataInfo']['metadata'];
			if(metadata != null && metadata != "") {
				$.each(metadata, function( index, data ) {
					var dataType = data['@name'];
					if(dataType == type) {
						var allDataTerms = data['@value'];
						if(allDataTerms != null && allDataTerms != "") {
							var dataTerms = allDataTerms.split("\n");
							if(dataTerms.indexOf(term)>=0) {
								documentsIds.push(docId);
							}
						}
					}
				})
			}
		});
		return documentsIds;
	}


	// -----------------------------------------------------------------------
	LandscapeHitsMetaData.prototype.getHitsMetaData = function() {
		return this.hitsMetaData;

	}

	// -----------------------------------------------------------------------
	LandscapeHitsMetaData.prototype.setHitsMetaData = function(hitsMetaData) {
		this.hitsMetaData = hitsMetaData;
	}
}
