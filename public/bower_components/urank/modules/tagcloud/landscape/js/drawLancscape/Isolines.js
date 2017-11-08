/**
 * @author Santokh Singh
 *
 */
function Isolines(isolines) {

	this.isolines = isolines;
	this.isolineLevelBased = {};
	var me = this;


	// invokes function to draw isolines
	// -----------------------------------------------------------------------
	Isolines.prototype.drawIsolines = function(landscapeState) {
		this.traverseAndDrawIsolines(this.isolines, 0, landscapeState);
	};


	// recursive function which run the isoline-tree to draw the paths
	// -----------------------------------------------------------------------
	Isolines.prototype.traverseAndDrawIsolines = function(isolines, level, landscapeState) {

		if(Object.keys(isolines).length > 0)  {

			var levelIsolines = {};
			$.each(isolines, function(pathId, properties) {
				if(pathId != "root") {
					if(!properties['hole']['hole'] ||
					   (properties['hole']['hole'] && properties['hole']['holeParent']) ) {

						// DRAWING BEGIN
						//--------------------------------------------------------------------
						var coords = [properties['path']];
						svgPathsWithFilter.selectAll("path." + pathId)
						.data(coords)
						.enter()
						.append("path")
						.attr("d", function(d) {
								var retVal = d3line(d) + "z";

								// handle holes
								//--------------------------------------------------------------------
								 if(properties['hole']['hole'] && properties['hole']['holeParent'] ) {
									 var holePolygons = properties['hole']['holePolygons'];
									 for (var i=0; i < holePolygons.length; i++) {
										 retVal = retVal +  (d3line(isolines[holePolygons[i]]['path'])) + "z";
									 };
								 }
								landscapeState.insertPathToJSTSTree(pathId, properties['path']);
								strTreeJSTSCurrent.insertPathToJSTSTree(pathId, properties['path']);
								return retVal;

						})
						.attr("selected", false)
						.attr("class", "landscapePaths")
						.attr("id", pathId)
						.style("stroke-width", 1)
						.style("stroke", landscapeConfig.getContinuousColor()[level])
						.style("fill", landscapeConfig.getContinuousColor()[level])
						.style("fill-rule", "evenodd")

						// set events listeners
						//-----------------------------
						// setPathEventsListeners(pathId);
		//				eventListener.setSVGPath(pathId);
						//-------------------------------

						//------------------------------------------------------------------------
						// DRAWING END
					}

				}
				for (pathIdChild in properties['children']) {
					levelIsolines[pathIdChild] =  properties['children'][pathIdChild];
				}
			});

		   // LEVELS BASED Filtering on polygons
		   if(Object.keys(levelIsolines).length > 0){
				svgPathsWithFilter = svgcanvas.append("g")//
					.attr("filter", "url(#svgFilterOnPath)")
					.attr("id", "level"+level);
			}
			level++;
			this.traverseAndDrawIsolines(levelIsolines, level, landscapeState);
		}
	};


	// invokes recursive function to create a level based isoline object
	// -----------------------------------------------------------------------
	Isolines.prototype.createLevelBasedIsolines =  function () {
		this.traverseLevelBasedIsolines(this.isolines, 0);
	};


    //  create a level based isoline object recursivly
	// -----------------------------------------------------------------------
	Isolines.prototype.traverseLevelBasedIsolines =  function (isolines, level) {
		var levelIsolines = {};
		if(Object.keys(isolines).length > 0)  {
			$.each(isolines, function(pathId, properties) {
				for (pathIdChild in properties['children']) {
					levelIsolines[pathIdChild] =  properties['children'][pathIdChild];
				}
			});
			this.isolineLevelBased["level"+level] = levelIsolines;
			level++;
			this.traverseLevelBasedIsolines(levelIsolines, level);
		}
	};


	// returns all isolines of a given level
	// -----------------------------------------------------------------------
	Isolines.prototype.getIsolinesByLevel =  function (level) {
		return this.isolineLevelBased[level];
	};


	// invokes function which selects(highlights) isolines which are within brush
	// -----------------------------------------------------------------------
	Isolines.prototype.selectIsolinesWithinBrush = function(landscapeState) {
		var isolinesIds = landscapeState.getIsolinesWithinBrush();
		svgcanvas.selectAll('.isolineSelected').classed("isolineSelected", false);
		for (var i=0; i < isolinesIds.length; i++) {
			var pathId = isolinesIds[i];
			d3.select("#" + pathId).style("fill", null).classed("isolineSelected", true);
		};

	};


	// returns all documents which are inside the given isoline
	// -----------------------------------------------------------------------
	Isolines.prototype.getAllDocumentsOfAnIsoline = function(isolineId) {
		 var level = "level" + isolineId.split("-")[1];
		 return this.isolineLevelBased[level][isolineId]['docs'];
	};


	// returns all ids as a List of documents which are inside the given isoline
	// -----------------------------------------------------------------------
	Isolines.prototype.getAllDocumentsIdsOfAnIsoline = function(isolineId) {
		var temp = {}
		 var level = "level" + isolineId.split("-")[1];
		 if( !this.isolineLevelBased[level] ||
		 	 !this.isolineLevelBased[level][isolineId] ||
		 	 !this.isolineLevelBased[level][isolineId]['docs']) {
			return temp;
		 }

		 return this.isolineLevelBased[level][isolineId]['docs'];
	};

	// // @param isolineIdsList ids of isolines as a list
	// // @return return an map-object where keys are the isolineIds and
	// //         values are the all corresponding documents of isoline
	// // -----------------------------------------------------------------------
	// Isolines.prototype.getMapObjOfIsolinesAndDocs= function(isolineIdsList) {
//
		// var isolineDocsObj = {}
		// for (var i=0; i < isolineIdsList.length; i++) {
		 	// var isolineId = isolineIdsList[i]
		    // var level = "level" + isolineId.split("-")[1];
		    // isolineDocsObj[isolineId] = this.isolineLevelBased[level][isolineId]['docs']
		// };
		// return isolineDocsObj;
	// }
}
