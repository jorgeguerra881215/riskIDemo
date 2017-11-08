/**
 * @author Santokh Singh
 *
 */
function STRTreeJSTS() {
	this.strTree = new jsts.index.strtree.STRtree()
	this.geometryFactory = new jsts.geom.GeometryFactory()

	// this function clean up the STRTree
	// -----------------------------------------------------------------------
	STRTreeJSTS.prototype.cleanJSTSTree = function() {
		this.strTree = new jsts.index.strtree.STRtree()
		this.geometryFactory = new jsts.geom.GeometryFactory()
	}


	// this function inserts path/pathId into STRTree
	//-------------------------------------------------------------------------------------
	STRTreeJSTS.prototype.insertPathToJSTSTree = function(pathId, path) {
		var coordinates = new Array();
		for (var i = 0; i < path.length; i++) {
			var x = path[i][0] * landscapeConfig.getWidth();
			var y = path[i][1] * landscapeConfig.getHeight();

			coordinates.push(new jsts.geom.Coordinate(x, y));
		}
		// console.log(coordinates)
		coordinates.push(coordinates[0]);
		var shell = this.geometryFactory.createLinearRing(coordinates);
		var geometry = {};
		geometry['polygon'] = this.geometryFactory.createPolygon(shell);
		geometry['pathId'] = pathId;
		geometry['selected'] = false;
		// console.log(geometry)
		this.strTree.insert(geometry['polygon'].getEnvelopeInternal(), geometry);
	}


	// this function return id of isolines as a list which are within brush
	//-------------------------------------------------------------------------------------
	STRTreeJSTS.prototype.getIsolinesWithinBrush = function() {
		console.log("STRTreeJSTS.getIsolinesWithinBrush");
		var isolineInsideBrush = [];
		var extent = landscapeBrush.extent();
		if (extent.length > 0) {
			this.deSelectIsolines();
			var brushPolygon = this.getBrushPolygon();
			this.strTree.query(brushPolygon.getEnvelopeInternal()).forEach(function(d) {
				if (d.polygon.within(brushPolygon)) {
					isolineInsideBrush.push(d.pathId);
				}
			})
		}
		return isolineInsideBrush;
	}


	// this function return id of isolines as a list which intersects with brush
	//-------------------------------------------------------------------------------------
	STRTreeJSTS.prototype.getIdsOfIntersectingIsolinesWithBrush = function() {
		console.log("STRTreeJSTS.getIsolinesWithinBrush");
		var isolinesIntersectingBrush = [];
		var extent = landscapeBrush.extent();
		if (extent.length > 0) {
			this.deSelectIsolines();
			var brushPolygon = this.getBrushPolygon();
			this.strTree.query(brushPolygon.getEnvelopeInternal()).forEach(function(d) {
				if (d.polygon.intersects(brushPolygon)) {
					isolinesIntersectingBrush.push(d.pathId);
				}
			})
		}
		return isolinesIntersectingBrush;
	}


	// checks which isoline intersects with brush and creates intersecting paths
	// returns an object where keys are the id of isolines and the value are the
	// corresponding intersecting paths
	//-------------------------------------------------------------------------------------
	STRTreeJSTS.prototype.getIntersectingIsolinesWithBrush = function() {
		console.log("STRTreeJSTS.getIsolinesWithinBrush");
		var isolinesIntersectingBrush = {}
		var extent = landscapeBrush.extent();
		if (extent.length > 0) {
			this.deSelectIsolines();
			var brushPolygon = this.getBrushPolygon();
			this.strTree.query(brushPolygon.getEnvelopeInternal()).forEach(function(d) {
				if (d.polygon.intersects(brushPolygon)) {
					var intersectPolygon = brushPolygon.intersection(d.polygon);
					var coordinates = this.getCoordinatesOfJSTSPolygon(intersectPolygon);
					isolinesIntersectingBrush[d.pathId] = coordinates;
				}
			})
		}
		return isolinesIntersectingBrush;
	}

	// this function return id of isolines as a list which intersects with brush
	//-------------------------------------------------------------------------------------
	STRTreeJSTS.prototype.getCoordinatesOfJSTSPolygon = function(JSTSPolygon) {
		var coordinatesNew = [];
		var coordinates = JSTSPolygon.getCoordinates();
		for (var i = 0; i < coordinates.length; i++) {
			coordinatesNew.push([coordinates[i]['x'], coordinates[i]['y']])
		};
		return coordinatesNew;
	}



	// this function creates a brushPolygon
	// @return JSTSPolygon object
	//-------------------------------------------------------------------------------------
	STRTreeJSTS.prototype.getBrushPolygon = function() {
		var extent = landscapeBrush.extent();
		var p1 = extent[0]
		var p3 = extent[1]
		p1[0] = p1[0] * landscapeConfig.getWidth();
		p1[1] = p1[1] * landscapeConfig.getHeight();
		p3[0] = p3[0] * landscapeConfig.getWidth();
		p3[1] = p3[1] * landscapeConfig.getHeight();
		var p2 = [p1[0], p3[1]]
		var p4 = [p3[0], p1[1]]

		var coordinates = new Array();
		coordinates.push(new jsts.geom.Coordinate(p1[0], p1[1]))
		coordinates.push(new jsts.geom.Coordinate(p2[0], p2[1]))
		coordinates.push(new jsts.geom.Coordinate(p3[0], p3[1]))
		coordinates.push(new jsts.geom.Coordinate(p4[0], p4[1]))
		coordinates.push(coordinates[0])
		var shell = this.geometryFactory.createLinearRing(coordinates)
		var brushPolygon = this.geometryFactory.createPolygon(shell)
		return brushPolygon;
	}

	// returns brush points (rectangle)
	//-------------------------------------------------------------------------------------
	STRTreeJSTS.prototype.getBrushPolygonPoints = function() {
		var extent = landscapeBrush.extent();
		var p1 = extent[0]
		var p3 = extent[1]
		p1[0] = p1[0] * landscapeConfig.getWidth();
		p1[1] = p1[1] * landscapeConfig.getHeight();
		p3[0] = p3[0] * landscapeConfig.getWidth();
		p3[1] = p3[1] * landscapeConfig.getHeight();
		var p2 = [p1[0], p3[1]]
		var p4 = [p3[0], p1[1]]

		var	brushPoints = {}
		brushPoints['p1'] = p1;
		brushPoints['p2'] = p2;
		brushPoints['p3'] = p3;
		brushPoints['p4'] = p4;
		return brushPoints;
	}

	//-------------------------------------------------------------------------------------
	STRTreeJSTS.isWithinExtent = function(x, y) {
		var i, j, len, p1, p2, ret, _i, _len;
		len = extent.length;
		j = len - 1;
		ret = false;
		for ( i = _i = 0, _len = extent.length; _i < _len; i = ++_i) {
			p1 = extent[i];
			p2 = extent[j];
			if ((p1[1] > y) !== (p2[1] > y) && x < (p2[0] - p1[0]) * (y - p1[1]) / (p2[1] - p1[1]) + p1[0]) {
				ret = !ret;
			}
			j = i;
		}
		return ret;
	};


	// //-------------------------------------------------------------------------------------
	// STRTreeJSTS.getAllDocumentssWithinBrush = function(x, y) {
		// var i, j, len, p1, p2, ret, _i, _len;
		// len = extent.length;
		// j = len - 1;
		// ret = false;
		// for ( i = _i = 0, _len = extent.length; _i < _len; i = ++_i) {
			// p1 = extent[i];
			// p2 = extent[j];
			// if ((p1[1] > y) !== (p2[1] > y) && x < (p2[0] - p1[0]) * (y - p1[1]) / (p2[1] - p1[1]) + p1[0]) {
				// ret = !ret;
			// }
			// j = i;
		// }
		// return ret;
	// };

	// this function retunrs the ids of all documents as a list which are within brush
	//-------------------------------------------------------------------------------------
	STRTreeJSTS.prototype.getIdsOfAllDocumentsWithinBrush = function(landscapeState) {

	}

	// this function retunrs the all documents as a mapList which are within brush where key
	// is the document id and value are the corresponding document data (x, y ...)
	//-------------------------------------------------------------------------------------
	STRTreeJSTS.prototype.getAllDocumentsObjsWithinBrush = function(landscapeState) {

	}

	// this function retunrs the all documents as a mapList which are within brush where key
	// is the document id and value are the corresponding document data (x, y ...)
	//-------------------------------------------------------------------------------------
	STRTreeJSTS.prototype.getAllDocumentsObjsWithinBrushIsolineBased = function(landscapeState) {

	}

	// this function returns documents(ids + pos) which are within brush as a list
	//-------------------------------------------------------------------------------------
	STRTreeJSTS.prototype.getAllDocumentssWithinBrushX = function(landscapeState) {
	//	console.log("STRTreeJSTS.getAllDocumentssWithinBrushX");
		var isolinesX = {}
		var docsInsideBrush = {}
		if (landscapeBrush.extent().length < 1) {
			return docsInsideBrush;
		}
		this.deSelectIsolines();
		var brushPolygon = this.getBrushPolygon();

		// check lowest level whose isoline intersects with brush
		//----------------------------------------------------------------------------
		var brushPolygonLevel = 0;
		this.strTree.query(brushPolygon.getEnvelopeInternal()).forEach(function(d) {
			// console.log(d.pathId)
			if (brushPolygon.within(d.polygon)) {
				var level = parseInt(d.pathId.split("-")[1]);
				if (level > brushPolygonLevel) {
					brushPolygonLevel = level;
				}
			}
		})

		//-----------------------------------------------------------------------------
		this.strTree.query(brushPolygon.getEnvelopeInternal()).forEach(function(d) {
			var level = parseInt(d.pathId.split("-")[1]);

			if (level >= brushPolygonLevel) {
				if (d.polygon.intersects(brushPolygon)) {
					var intersectPolygon = brushPolygon.intersection(d.polygon);
					var levelIsolines = stateCurrent.getIsolinesByLevel("level" + level);
					if (d.pathId in levelIsolines) {

						if (d.polygon.intersects(brushPolygon)) {

							if (Object.keys(levelIsolines[d.pathId]['docs']).length > 0) {
								var extent = [];
								var coordinates = intersectPolygon.getCoordinates();
								for (var i = 0; i < coordinates.length; i++) {
									extent.push([coordinates[i]['x'], coordinates[i]['y']])
								};
								var abc = []
								$.each(levelIsolines[d.pathId]['docs'], function(index, docId) {

									var docObj = landscapeState.getDocumentById(docId);

									var jstsPoint = new jsts.geom.Coordinate(docObj['x']*landscapeConfig.getWidth(), docObj['y']*landscapeConfig.getHeight())
									// var docsInsideBrush = {}
									if (intersectPolygon.getEnvelopeInternal().containsCoordinate(jstsPoint)) {

										var x = docObj['x']*landscapeConfig.getWidth();
										var y = docObj['y']*landscapeConfig.getHeight();
										var i, j, len, p1, p2, ret, _i, _len;
										len = extent.length;
										j = len - 1;
										ret = false;
										for ( i = _i = 0, _len = extent.length; _i < _len; i = ++_i) {
											p1 = extent[i];
											p2 = extent[j];
											if ((p1[1] > y) !== (p2[1] > y) && x < (p2[0] - p1[0]) * (y - p1[1]) / (p2[1] - p1[1]) + p1[0]) {
												ret = !ret;
											}
											j = i;
										}
										if (ret == true) {
											docsInsideBrush[docId] = docObj;
											abc.push(docId)
											// });
										} else {

										}

									}
								})

								isolinesX[d.pathId] = abc;
							}
						}
					}


				}
			}
		})
		return isolinesX;

		// return Object.keys(docsInsideBrush);

	}


	// this function returns documents(ids + pos) which are within brush as a list
	//-------------------------------------------------------------------------------------

	STRTreeJSTS.prototype.getDocumentsWithinBrush = function(landscapeState) {

	//	console.log("STRTreeJSTS.getDocumentssWithinBrush");
		// svgcanvas.selectAll(".docPoints").data([]).exit().remove()
		var docsInsideBrush = {}
		// var docPoints = svgcanvas.append("g")
		// .attr("class", "docPoints")
		if (landscapeBrush.extent().length < 1) {
			return docsInsideBrush;
		}

		this.deSelectIsolines();
		var brushPolygon = this.getBrushPolygon();

		// check lowest level whose one of the isoline intersects with brush for mining
		//----------------------------------------------------------------------------
		var brushPolygonLevel = 0;
		this.strTree.query(brushPolygon.getEnvelopeInternal()).forEach(function(d) {
			// console.log(d.pathId)
			if (brushPolygon.within(d.polygon)) {
				var level = parseInt(d.pathId.split("-")[1]);
				if (level > brushPolygonLevel) {
					brushPolygonLevel = level;
				}
			}
		})
		//-----------------------------------------------------------------------------


		//-----------------------------------------------------------------------------
		this.strTree.query(brushPolygon.getEnvelopeInternal()).forEach(function(d) {
			var level = parseInt(d.pathId.split("-")[1]);
			if (level >= brushPolygonLevel) {
				if (d.polygon.intersects(brushPolygon)) {
					var intersectPolygon = brushPolygon.intersection(d.polygon);
					var levelIsolines = stateCurrent.getIsolinesByLevel("level" + level);
					if (d.pathId in levelIsolines) {

						if (d.polygon.intersects(brushPolygon)) {

							if (Object.keys(levelIsolines[d.pathId]['docs']).length > 0) {
								var extent = [];
								var coordinates = intersectPolygon.getCoordinates();
								for (var i = 0; i < coordinates.length; i++) {
									extent.push([coordinates[i]['x'], coordinates[i]['y']])
								};

								$.each(levelIsolines[d.pathId]['docs'], function(index, docId) {

									var docObj = landscapeState.getDocumentById(docId);

									var jstsPoint = new jsts.geom.Coordinate(docObj['x']*landscapeConfig.getWidth(), docObj['y']*landscapeConfig.getHeight())
									// var docsInsideBrush = {}
									if (intersectPolygon.getEnvelopeInternal().containsCoordinate(jstsPoint)) {

										var x = docObj['x']*landscapeConfig.getWidth();
										var y = docObj['y']*landscapeConfig.getHeight();
										var i, j, len, p1, p2, ret, _i, _len;
										len = extent.length;
										j = len - 1;
										ret = false;
										for ( i = _i = 0, _len = extent.length; _i < _len; i = ++_i) {
											p1 = extent[i];
											p2 = extent[j];
											if ((p1[1] > y) !== (p2[1] > y) && x < (p2[0] - p1[0]) * (y - p1[1]) / (p2[1] - p1[1]) + p1[0]) {
												ret = !ret;
											}
											j = i;
										}
										if (ret == true) {
											docsInsideBrush[docId] = docObj;
											// });
										} else {

										}

									}
								})
							}
						}
					}

				}
			}
		})
		return docsInsideBrush;

	}



	// this function returns documents(ids + pos) which are within brush as a list
	//-------------------------------------------------------------------------------------
	STRTreeJSTS.prototype.getDocumentssWithinBrushMagic = function(landscape) {

	//	console.log("landscape in strtreejsts")
	//	console.log(landscape)


		//console.log("STRTreeJSTS.getDocumentssWithinBrush");
		var isolinesX = {}
		var docsInsideBrush = {}
		if (landscapeBrush.extent().length < 1) {
			return docsInsideBrush;
		}
		this.deSelectIsolines();
		var brushPolygon = this.getBrushPolygon();

		// check lowest level whose isoline intersects with brush
		//----------------------------------------------------------------------------
		var brushPolygonLevel = 0;
		this.strTree.query(brushPolygon.getEnvelopeInternal()).forEach(function(d) {
			// console.log(d.pathId)
			if (brushPolygon.within(d.polygon)) {
				var level = parseInt(d.pathId.split("-")[1]);
				if (level > brushPolygonLevel) {
					brushPolygonLevel = level;
				}
			}
		})

		//-----------------------------------------------------------------------------
		this.strTree.query(brushPolygon.getEnvelopeInternal()).forEach(function(d) {
			var level = parseInt(d.pathId.split("-")[1]);

			if (level >= brushPolygonLevel) {
				if (d.polygon.intersects(brushPolygon)) {
					var intersectPolygon = brushPolygon.intersection(d.polygon);
					var levelIsolines = landscape.getIsolinesByLevel("level" + level);
					if (d.pathId in levelIsolines) {

						if (d.polygon.intersects(brushPolygon)) {

							if (Object.keys(levelIsolines[d.pathId]['docs']).length > 0) {
								var extent = [];
								var coordinates = intersectPolygon.getCoordinates();
								for (var i = 0; i < coordinates.length; i++) {
									extent.push([coordinates[i]['x'], coordinates[i]['y']])
								};
								var abc = []
								$.each(levelIsolines[d.pathId]['docs'], function(index, docId) {

									var docObj = landscape.getDocumentById(docId);

									var jstsPoint = new jsts.geom.Coordinate(docObj['x']*landscapeConfig.getWidth(), docObj['y']*landscapeConfig.getHeight())
									// var docsInsideBrush = {}
									if (intersectPolygon.getEnvelopeInternal().containsCoordinate(jstsPoint)) {

										var x = docObj['x']*landscapeConfig.getWidth();
										var y = docObj['y']*landscapeConfig.getHeight();
										var i, j, len, p1, p2, ret, _i, _len;
										len = extent.length;
										j = len - 1;
										ret = false;
										for ( i = _i = 0, _len = extent.length; _i < _len; i = ++_i) {
											p1 = extent[i];
											p2 = extent[j];
											if ((p1[1] > y) !== (p2[1] > y) && x < (p2[0] - p1[0]) * (y - p1[1]) / (p2[1] - p1[1]) + p1[0]) {
												ret = !ret;
											}
											j = i;
										}
										if (ret == true) {
											docsInsideBrush[docId] = docObj;
											abc.push(docId)
											// });
										} else {

										}
									}
								})
								isolinesX[d.pathId] = abc;
							}
						}
					}
				}
			}
		})
		return docsInsideBrush;

	}



	// this function deselects the selected isolines
	//-------------------------------------------------------------------------------------
	STRTreeJSTS.prototype.deSelectIsolines= function() {
		svgcanvas.selectAll('path').each(function(d, i) {
			var colorIndex = parseInt(this.id.split("-")[1]) + 1;
			d3.select(this).style("fill",  landscapeConfig.getContinuousColor()[colorIndex]);
		});
	}


}
