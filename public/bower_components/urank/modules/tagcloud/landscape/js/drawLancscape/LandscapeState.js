/**
 * @author Santokh Singh
 *
 */
function LandscapeState() {

	this.documents;
	this.isolines;
	this.mappings;
	this.labels = new LandscapeLabels();
	this.wordsCloud;
	this.strTreeJSTS;
	this.magiclens;
	this.magicDocs;
	this.translate;
	this.scale;
	var me = this;

	// initialize landscape
	// -----------------------------------------------------------------------
	LandscapeState.prototype.init = function(data, tagBox) {
			var allDocs = data['documents'];
			var outsideDocs = data['outsideDocuments'];
			this.documents = new Documents(allDocs, outsideDocs);
			this.labels.init(data['labels'], tagBox);
			this.isolines = new Isolines(data['isolinesTree']);
			this.createLevelBasedIsolines();
			this.wordsCloud = new WordsCloud();
			this.strTreeJSTS = new STRTreeJSTS();

	}

	// returns (jsonfile name) of landscape
	// -----------------------------------------------------------------------
	LandscapeState.prototype.getJsonFileName = function() {
		return me.jsonFileName;
	}

	// fill Landscape with data
	// -----------------------------------------------------------------------
	LandscapeState.prototype.setData = function(documents, isolines, mappings) {
		me.documents = documents;
		me.isolines = isolines;
		me.mappings = mappings;
	}

	/******************************************************************************************************************
	*
	*	ISOLINES
	*
	* ***************************************************************************************************************/
	// get all documents as list of an isoline
	// -----------------------------------------------------------------------
	LandscapeState.prototype.getAllDocumentsOfAnIsoline = function(isolineId) {
		return me.isolines.getAllDocumentsOfAnIsoline(isolineId);
	}

	// returns all the documents as a list which are within an isoline
	// -----------------------------------------------------------------------
	LandscapeState.prototype.getAllDocumentsIdsOfAnIsoline = function( isolineId ) {
		return me.isolines.getAllDocumentsIdsOfAnIsoline(isolineId);
	}

	// returns all isolines of a given level
	// -----------------------------------------------------------------------
	LandscapeState.prototype.getIsolinesByLevel = function(level) {
		return me.isolines.getIsolinesByLevel(level);
	}


	// invokes recursive function to create a level based isoline object
	// -----------------------------------------------------------------------
	LandscapeState.prototype.createLevelBasedIsolines = function() {
		me.isolines.createLevelBasedIsolines();
	}

	// invokes function to draw isolines
	// -----------------------------------------------------------------------
	LandscapeState.prototype.drawIsolines = function() {
		me.isolines.drawIsolines(me);
	}

	// invokes function which selects(highlights) isolines which are within brush
	// -----------------------------------------------------------------------
	LandscapeState.prototype.selectIsolinesWithinBrush = function( ) {
		return me.isolines.selectIsolinesWithinBrush(me);
	}
	//==========================================================================




	/******************************************************************************************************************
	*
	*	Documents
	*
	* ***************************************************************************************************************/
	// -----------------------------------------------------------------------
	LandscapeState.prototype.getDocuments = function() {
		me.documents.getDocuments();
		var allDocs = 	me.documents.getDocuments();
		return allDocs;
	}

	// -----------------------------------------------------------------------
	LandscapeState.prototype.getDocumentById = function(docId) {
		return me.documents.getDocumentById(docId);
	}

	// -----------------------------------------------------------------------
	LandscapeState.prototype.getOutsideDocuments = function() {
		me.documents.getOutsideDocuments();

	}

	// -----------------------------------------------------------------------
	LandscapeState.prototype.getDrawnDocsIdsList = function( ) {
		return me.documents.getDrawnDocsIdsList();
	}

	// -----------------------------------------------------------------------
	LandscapeState.prototype.doesDocumentExists = function(docId) {
		return me.documents.doesDocumentExists(docId);
	}

	// -----------------------------------------------------------------------
	LandscapeState.prototype.drawAllDocuments= function() {
		me.documents.drawAllDocuments();
	}

	// -----------------------------------------------------------------------
	LandscapeState.prototype.drawDocumentsWithinBrush = function() {
		return me.documents.drawDocumentsWithinBrush(me);
	}

	// -----------------------------------------------------------------------
	LandscapeState.prototype.drawDocumentsWithinSelectedIsolines = function() {
		return me.documents.drawDocumentsWithinSelectedIsolines(me);
	}

	// -----------------------------------------------------------------------
	LandscapeState.prototype.drawDocumentsWithinSelectedIsolineById = function(isolineId) {
		me.documents.drawDocumentsWithinSelectedIsolineById(isolineId, me);
	}

	// -----------------------------------------------------------------------
	LandscapeState.prototype.removeDocumentsWithinSelectedIsolineById = function(isolineId) {
		me.documents.removeDocumentsWithinSelectedIsolineById(isolineId);
	}

	// -----------------------------------------------------------------------
	LandscapeState.prototype.heighlightDocumentsByIds = function(documentIds) {
		return me.documents.heighlightDocumentsByIds(documentIds);
	}

	// -----------------------------------------------------------------------
	LandscapeState.prototype.deHeighlightDocuments = function() {
		return me.documents.deHeighlightDocuments();
	}


	// -----------------------------------------------------------------------
	LandscapeState.prototype.getDocumentsSize = function() {
		return me.documents.getDocumentsSize();
	}

	LandscapeState.prototype.fillDocsColorFacetBased= function(facetBasedDocuments, color) {
		me.documents.fillDocsColorFacetBased(facetBasedDocuments, color);
	}


	/******************************************************************************************************************
	*
	*	Labels
	*
	* ***************************************************************************************************************/
	// draws label
	// -----------------------------------------------------------------------
	LandscapeState.prototype.drawLabels = function() {
		//console.log("LandscapeState.drawIsolines()")
		me.labels.drawLabels();

	};

	LandscapeState.prototype.markLabelNotInBox = function(index) {
		me.labels.markLabelNotInBox(index);
	}

	//========================================================================


	/******************************************************************************************************************
	*
	*	Tranform
	*
	* ***************************************************************************************************************/
	// invokes function which transform oldstate to nextstate
	// -----------------------------------------------------------------------
	LandscapeState.prototype.transformTo = function(nextState, transformDir) {
		strTreeJSTS.cleanJSTSTree();
		me.transform.doTransform(me, nextState, transformDir);
	}
	//===========================================================================



	/******************************************************************************************************************
	*
	*	strTreeJSTS
	*
	* ***************************************************************************************************************/

	// me function clean up the STRTree
	// -----------------------------------------------------------------------
	LandscapeState.prototype.insertPathToJSTSTree = function(pathId, path) {
		me.strTreeJSTS.insertPathToJSTSTree(pathId, path);
	}

	// this function inserts path/pathId into STRTree
	//---------------------------------------------------------------------------
	LandscapeState.prototype.cleanJSTSTree = function() {
		me.strTreeJSTS.cleanJSTSTree();
	}

	// this function return id of isolines as a list which are within brush
	// -----------------------------------------------------------------------
	LandscapeState.prototype.getIsolinesWithinBrush = function() {
		return me.strTreeJSTS.getIsolinesWithinBrush();
	};


	// this function return id of isolines as a list which intersects with brush
	// -----------------------------------------------------------------------
	LandscapeState.prototype.getIdsOfIntersectingIsolinesWithBrush = function() {
		return me.strTreeJSTS.getIdsOfIntersectingIsolinesWithBrush();
	};


	// checks which isoline intersects with brush and creates intersecting paths
	// returns an object where keys are the id of isolines and the value are the
	// corresponding intersecting paths
	// -----------------------------------------------------------------------
	LandscapeState.prototype.getIntersectingIsolinesWithBrush = function() {
	//	console.log("LandscapeState.getIntersectingIsolinesWithBrush()");
		return me.strTreeJSTS.getIntersectingIsolinesWithBrush();
	};


	// me function return id of isolines as a list which intersects with brush
	// -----------------------------------------------------------------------
	LandscapeState.prototype.getCoordinatesOfJSTSPolygon = function() {
		return me.strTreeJSTS.getCoordinatesOfJSTSPolygon();
	};


	// this function creates a brushPolygon
	// @return JSTSPolygon object
	// -----------------------------------------------------------------------
	LandscapeState.prototype.getBrushPolygon = function() {
		return me.strTreeJSTS.getBrushPolygon();
	};


	// this function return id of isolines as a list which intersects with brush
	// -----------------------------------------------------------------------
	LandscapeState.prototype.getBrushPolygonPoints = function() {
		return me.strTreeJSTS.getBrushPolygonPoints();
	};



	// // -----------------------------------------------------------------------
	LandscapeState.prototype.getDocumentsWithinBrush = function() {
		return me.strTreeJSTS.getDocumentsWithinBrush(me);
	};


	// -----------------------------------------------------------------------
	LandscapeState.prototype.getAllDocumentssWithinBrush = function() {
		return me.strTreeJSTS.getAllDocumentssWithinBrush(me);
	};


		// -----------------------------------------------------------------------
	LandscapeState.prototype.getAllDocumentssWithinBrushX = function() {
		return me.strTreeJSTS.getAllDocumentssWithinBrushX(me);
	};


	// -----------------------------------------------------------------------
	LandscapeState.prototype.deSelectIsolines = function() {
	//	console.log("LandscapeState.getAllDocumentssWithinBrush()");
		return me.strTreeJSTS.deSelectIsolines();
	};


	/******************************************************************************************************************
	*
	*	WordsCloud
	*
	* ***************************************************************************************************************/
	// -----------------------------------------------------------------------
	LandscapeState.prototype.drawTagsCloud = function(tags) {
		return me.wordsCloud.draw(tags);
	};

	// -----------------------------------------------------------------------
	LandscapeState.prototype.getTagsList = function(tags) {
		return me.wordsCloud.getTagsList();
	};

	// -----------------------------------------------------------------------
	LandscapeState.prototype.clearTagCloud = function(tags) {
		return me.wordsCloud.clearTagCloud();
	};

	//===========================================================================


	/******************************************************************************************************************
	*
	*	Urank
	*
	* ***************************************************************************************************************/
	// -----------------------------------------------------------------------
	LandscapeState.prototype.addUrankTagStyling = function(index, color) {
		me.wordsCloud.addUrankTagStyling(index, color);
		me.labels.addUrankTagStyling(index, color);
	};

	// -----------------------------------------------------------------------
	LandscapeState.prototype.removeUrankTagStyling = function(index) {
		me.wordsCloud.removeUrankTagStyling(index);
		me.labels.removeUrankTagStyling(index);
	};


	/******************************************************************************************************************
	*
	*	Zoom landscape
	*
	* ***************************************************************************************************************/
	// -----------------------------------------------------------------------
	LandscapeState.prototype.zoom = function() {
		if(d3.event.sourceEvent.shiftKey) {
			return
		}
		if(d3.event  == null || d3.event.scale <= 1) {
			var translate = [0,0];
			var scale = 1;
			me.resetZoom(translate, scale);
			return;
		}
		this.translate = d3.event.translate;
		this.scale = d3.event.scale;
		svgcanvas.selectAll("g").each(function(d, i) {
			if (d3.select(this).attr('class') == "landscapeBrush") {
				d3.select(this).attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
			}
			if (d3.select(this).attr('class') == "landscapeLabels") {
				d3.select(this).attr("transform", "translate(" +  d3.event.translate  + ")" + " scale(" + d3.event.scale + ")");
			}
		})
		//zoom/pan all paths
		svgcanvas.selectAll("path").attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
		svgcanvas.selectAll("circle").each(function(d, i) {
			d3.select(this).attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
		})

	}

	// Reset Landscape zooming
	// -----------------------------------------------------------------------
	LandscapeState.prototype.resetZoom = function(translate, scale ) {
		landscapeZoom.translate(translate)
		landscapeZoom.scale(scale)
		this.translate = translate;
		this.scale = scale;
		svgcanvas.selectAll("g").each(function(d, i) {
			if (d3.select(this).attr('class') == "brush") {
				d3.select(this).attr("transform", "translate(" + translate + ")" + " scale(" + scale + ")");
			}
			if (d3.select(this).attr('class') == "landscapeLabels") {
				d3.select(this).attr("transform", "translate(" + translate  + ")" + " scale(" + scale+ ")");
			}
		})
		//zoom/pan all paths
		svgcanvas.selectAll("path").attr("transform", "translate(" + translate + ")" + " scale(" + scale+ ")");
		svgcanvas.selectAll("circle").each(function(d, i) {
			d3.select(this).attr("transform", "translate(" +translate + ")" + " scale(" +scale+ ")");
		})
	}


	LandscapeState.prototype.getD3EventTranslate = function() {
		return this.translate;
	}

	LandscapeState.prototype.getD3EventScale= function() {
		return this.scale;
	}

}
