/**
 * @author Santokh Singh
 *
 */
function Documents(documents, outsideDocuments) {
	this.documents = documents;
	this.outsideDocuments = outsideDocuments;
	this.documentIdsMap = {};

	// get all the documents of landscape/state
	// -----------------------------------------------------------------------
	Documents.prototype.getDocuments = function() {
		return this.documents;

	}

	// -----------------------------------------------------------------------
	Documents.prototype.getDocumentsSize = function() {
		return Object.keys(this.documents).length;
	}


	// get a document by id
	// -----------------------------------------------------------------------
	Documents.prototype.getDocumentById = function(docId) {
		var docObj = {}
		if(docId in this.documents) {
			docObj = this.documents[docId];
		}

		return docObj;

	}

	// returns true if landscape has the asked document else false
	// -----------------------------------------------------------------------
	Documents.prototype.doesDocumentExists = function(docId) {
		if(docId in this.documents) {
			return true;
		}
		return false;
	}

	// get all documents which are not inside any isolines
	// -----------------------------------------------------------------------
	Documents.prototype.getOutsideDocuments = function() {
		return this.outsideDocuments;

	}


	// draws all the documents of the landscape/state
	// -----------------------------------------------------------------------
	Documents.prototype.drawDocuments = function(documents, docPoints) {
		var idsMap = {};
		var index = 0;
		if(Object.keys(documents).length > 0)  {
				$.each(documents, function(documentId, docData) {
					var x = docData['x'] * landscapeConfig.getWidth();
					var y = docData['y'] * landscapeConfig.getHeight();
					var x = docData['x'] * landscapeConfig.getWidth();
					var y = docData['y'] * landscapeConfig.getHeight();
					docPoints.append("circle")//
					.attr("class", "landscapeDocPoint")//
					.attr("id", documentId)
					.attr("cx", x)
					.attr("cy", y)
					.attr("r", 4)//
					.attr("index", docData.metadata.index)
					.attr("color", "red")//
					.style("fill", "red")
					.on("mouseover", function(d, i) {
						d3.select(this).attr("r", 4);
						d3.select(this).style("fill", "#FFBE3B");
						d3.select(this).style("cursor", "pointer")

					}).on("mouseout", function(d, i) {
						var color = d3.select(this).attr("color")//
						d3.select(this).attr("r", 4);
						d3.select(this).style("fill", color);
					}).on("click", function(d) {
						var i = d3.select(this).attr("index"); 
						landscapeController.stateCurrent.heighlightDocumentsByIds([i]);
						var datasetList = landscapeController.dataProcessor.getDatasetByIds([i]); 
						FilterHandler.singleItemSelected(datasetList[0], false); 
					}).append("title").text(function(d, i) {
						return docData.metadata.title;
					})
					
					index++;
				})
			}
			this.documentIdsMap = idsMap;
	}


	// draw all documents of the landscape/state
	// -----------------------------------------------------------------------
	Documents.prototype.drawAllDocuments = function() {
		svgcanvas.selectAll("#docPoints").remove();
		var docPoints = svgcanvas.append("g")
			.attr("id", "docPoints")

		this.drawDocuments(this.documents, docPoints)

	}



	// -----------------------------------------------------------------------
	Documents.prototype.heighlightDocumentsByIds= function(documentIds) {
        var docsLength = Object.keys(this.documents).length;
        var opacity = 0.2;
        if(documentIds == "" || documentIds.length == 0) {
            opacity = 1;

        }

		for(var i=0; i < docsLength ; i++) {
			var docId = "doc_" + i;
            svgcanvas.select("#"+docId).attr("r", 4).style("opacity", opacity);
		}
        if(documentIds == "") {
            return;
        }
		for(var i=0; i < documentIds.length; i++) {
            if(i <  docsLength) {
                var docId = "doc_" + documentIds[i];
                svgcanvas.select("#" + docId).attr("r", 6).style("opacity", 1);
            }
		}
	}


	// -----------------------------------------------------------------------
	Documents.prototype.deHeighlightDocuments= function() {
		var idsMap = this.documentIdsMap;
		for(key in idsMap) {
			var docId = idsMap[key];
			svgcanvas.select("#"+docId).attr("r", 4).style("opacity", 1);
		}
	}

	// -----------------------------------------------------------------------
	Documents.prototype.getListOfVanishedDocs = function(docsListToCheck) {
		var vanishedDocs = [];
		for (var i=0; i < docsListToCheck.length; i++) {
		  var doc = docsListToCheck[i];
		  if(doc in this.documents) {
		  	vanishedDocs.push(doc);
		  }
		}
		return vanishedDocs;
	}


    // draws documents which are within brush
	// -----------------------------------------------------------------------
	Documents.prototype.drawDocumentsWithinBrush = function(landscapeState) {
		// console.log("Documents.drawDocumentsWithinBrush");
		svgcanvas.selectAll("#docPoints").data([]).exit().remove()
		var docInsideBrush = landscapeState.getDocumentsWithinBrush();
		var docPoints = svgcanvas.append("g")
			.attr("id", "docPoints")
	//	docsTable.clear();
		this.drawDocuments(docInsideBrush, docPoints);
	}

	// draws documents of isolines which are within brush ( user has selected isolines)
	// -----------------------------------------------------------------------
	Documents.prototype.drawDocumentsWithinSelectedIsolines = function(landscapeState) {
		selectedDocuments = [];
		svgcanvas.select("#docPoints").data([]).exit().remove();

		// get ids of selected isolines
		var selectIsolinesIds = $(".isolineSelected").map(function() {
			return d3.select(this).attr('id');
		}).get();

		if (selectIsolinesIds.length <= 0) {
			return;
		}

		// add group for documents
		var docPoints = svgcanvas.append("g").attr("id", "docPoints");

		isolineBasedDocs = {};
		for (var i = 0; i < selectIsolinesIds.length; i++) {
			var isolineId = selectIsolinesIds[i];
			var docIds = landscapeState.getAllDocumentsOfAnIsoline(isolineId);
			var docsObjList = {};

			var isolineDocs = docPoints.append("g")
				.attr("id", "isoline_" + isolineId)
				.attr("class", "docsOfIsoline");
			for (var j = 0; j < docIds.length; j++) {
				var docId = docIds[j];
				if ( docId in this.documents) {
					docsObjList[docId] = this.documents[docId];
				}
			}

			this.drawDocuments(docsObjList, isolineDocs);
			selectedDocuments.push(docsObjList)
		}
	}

	// removes drawn documents of an isoline which has been deselected by user
	// -----------------------------------------------------------------------
	Documents.prototype.removeDocumentsWithinSelectedIsolineById= function(isolineId) {

		svgcanvas.select("#isoline_" + isolineId).data([]).exit().remove()
		docsTable.clear();
		this.drawDocumentsWithinSelectedIsolines();

	}

	// draws documents of an isoline which has been selected by user
	// -----------------------------------------------------------------------
	Documents.prototype.drawDocumentsWithinSelectedIsolineById = function(isolineId, landscapeState) {
		// var checked = document.getElementById("selectIsolineDocs").checked;
		// if (!checked) {
			// svgcanvas.selectAll("isoline_" + isolineId).data([]).exit().remove();
			// return;
		// }
		var docPoints;
		if(!svgcanvas.select("#docPoints").empty() ) {
			docPoints = svgcanvas.select("#docPoints");
		}
		else {
			svgcanvas.select("#docPoints").data([]).exit().remove();
			docPoints = svgcanvas.append("g").attr("id", "docPoints")
		}

		var docIds = landscapeState.getAllDocumentsOfAnIsoline(isolineId);
		var docsObjList = {}

		// add group for isoline-docs
		var isolineDocs = docPoints.append("g")
			.attr("id", "isoline_" + isolineId)
			.attr("class", "docsOfIsoline")
		for (var j = 0; j < docIds.length; j++) {
			var docId = docIds[j];
			if ( docId in this.documents) {
				docsObjList[docId] = this.documents[docId];
			}
		}
		this.drawDocuments(docsObjList, isolineDocs)

	}

	// returns ids as a list of document which are currently drawn
	// -----------------------------------------------------------------------
	Documents.prototype.getDrawnDocsIdsList= function() {
		var drawnDocsIds  = {}
		drawnDocsIds = $(".landscapeDocPoint").map(function() {
	  		return d3.select(this).attr('id');
		}).get();
		return drawnDocsIds;
	}

	// -----------------------------------------------------------------------
	Documents.prototype.fillDocsColorFacetBased= function(facetBasedDocuments, color) {

		for(facetName in facetBasedDocuments ) {
			for( facetAttribute in facetBasedDocuments[facetName]) {
				var docsIndices = facetBasedDocuments[facetName][facetAttribute].indices;
				for(var i = 0; i < docsIndices.length; i++) {
					var index = docsIndices[i];
					var docId= "#doc_"+index;
					svgcanvas.select(docId).style("fill", color(facetAttribute));
				    svgcanvas.select(docId).attr("color", color(facetAttribute));
				}
			}
		}
	}

}
