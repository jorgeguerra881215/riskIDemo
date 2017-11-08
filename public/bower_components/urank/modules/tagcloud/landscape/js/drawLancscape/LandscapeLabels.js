/**
 * @author Santokh Singh
 *
 */
function LandscapeLabels() {
	this.labels = {};
	this.fontSize = 16;
	this.fontColor = "Red";
	this.labelColor = "White";
	this.fontWeight = null;
	this.tagBox = {}
	this.landscapeLabelPrefix = "landscapeLabel_";
	var me = this;


	// -----------------------------------------------------------------------
	LandscapeLabels.prototype.init = function(labels, tagBox) {
		if (labels["labels"] != undefined) {
			if (labels["labelcolor"] != undefined) {
				this.labelColor = labels["labelcolour"];
			}
			if (labels["fontsize"] != undefined) {
				this.fontSize = labels["labelcolour"];
			}
			this.labels = labels["labels"];
			this.tagBox = tagBox;
			this.landscapeLabelPrefix = "landscapeLabel_";
			me = this;

		}
	}

	// -----------------------------------------------------------------------
	LandscapeLabels.prototype.addUrankTagStyling = function(index, color){
		var tagId = this.landscapeLabelPrefix + index;
		var a = tagCloudCanvas.select("#"+tagId);
		var b = d3.select("#"+tagId);
		if(!d3.select("#"+tagId).empty()) {
			$tag = d3.select("#"+tagId);
			var prevColor  = $tag.style("color");
			$tag = d3.select("#"+tagId);
			$tag.style("color", prevColor );
		    $tag.style("fill", color );
			$tag.style("font-weight", "bold");
		}
	}


	// -----------------------------------------------------------------------
	LandscapeLabels.prototype.removeUrankTagStyling = function(index){
		var tagId = this.landscapeLabelPrefix + index;
		if(!d3.select("#"+tagId).empty()) {
			$tag = d3.select("#"+tagId);
			var prevColor  = $tag.style("color");
			var test = this.labelColor;
			$tag.style("fill", prevColor );
			$tag.style("font-weight", null);
		}
	}

	LandscapeLabels.prototype.processLabels = function() {


	}

	// -----------------------------------------------------------------------
	LandscapeLabels.prototype.drawLabels = function() {
		svgcanvas.selectAll("#landscapeLabelDragLines").remove();
		svgcanvas.selectAll("#landscapeLabel").remove();



	   	//--------------------------------------------------------------------------------------


		var fontSize = this.fontSize;
		var fontColor = this.fontColor;
		var labelColor = this.labelColor;
		var fontWeight = this.fontWeight;
		var totalScreenWidth = 2024;
		var containerWidth = totalScreenWidth*0.40;
		var labelScale = d3.scale.linear().domain([ 0, containerWidth ]).range([4, 16 ]);
		fontSize = labelScale(landscapeConfig.getWidth());

		// create labels containers
		//---------------------------------------------------------------------------------------
		var landscapeLabelsDragingLines = svgcanvas.append("g")
			.attr("class", "landscapeLabels")
			.attr("id", "landscapeLabelDragLines")
		var landscapeLabelsContainer = svgcanvas.append("g")
			.attr("class", "landscapeLabels")
			.attr("id", "landscapeLabel")
		//--------------------------------------------------------------------------------------




		// Drag labels rectangle
		//---------------------------------------------------------------------------------------
		var dragLabelsRectangle = d3.behavior.drag().origin(function() {
				var t = d3.select(this);
				return {x: t.attr("x") + d3.transform(t.attr("transform")).translate[0],
						y: t.attr("y") + d3.transform(t.attr("transform")).translate[1]};
	        }).on("drag", function(d,i) {
	            var id = d3.select(this).attr("id");
	            var rectId = id + "_rect";
	            var lineId = id + "_line";
	            var transX = 0;
	            var transY = 0;
	            d3.select(this).attr("transform", function(d,i){
	            	transX =  d3.event.x;
	            	transY = d3.event.y ;
	                return "translate(" + [ d3.event.x,d3.event.y ] + ")"
	            })

	            var rect = landscapeLabelsContainer.select("#"+rectId);
	            var dx = parseInt(rect.attr("x")) ;
	            var dy =  parseInt(rect.attr("y"));
	            var width =  parseInt(rect.attr("width")) / 2;
	            var height =  parseInt(rect.attr("height")) / 2;
	            var xMiddle = dx + width + transX;
	            var yMiddle = dy + height + transY;
	            landscapeLabelsDragingLines.select("#"+lineId)
				    .attr("x2", xMiddle)
				    .attr("y2", yMiddle);
	   	});

		var totalLabelCounter = 0;
		$.each(this.labels, function(labelindex, label) {

			var labelsText = label["labels"]
			var labelWeight = label["weight"];
			var keywordsObj = label.keywords;
			if(labelsText ==null || labelsText == "" || labelsText.length < 1) {
				return true;
			}
			var labelDepth = label["depth"]
			var labelPosX = label["coordinates"][0] * landscapeConfig.getWidth();
			var labelPosY = label["coordinates"][1] * landscapeConfig.getHeight();
			var labelCounter = 0;
			// var documentsIds = [];
			// for(var i =0; i< label["docs"].length; i++ ) {
				// documentsIds.push("doc_"+label["docs"][i]);
			// }


			// get Label with max Length
			//-------------------------------------------------------------------------------------
			var textBoxHeight = 15;
			var textBoxWidth = 15;
			var maxTextLenght = 0;
			var maxCharText = "";
			$.each(labelsText, function(index, text) {
				var length = text.length;
				if (length > maxTextLenght) {
					maxTextLenght = length;
					maxCharText = text;
				}
			});
			//-------------------------------------------------------------------------------------


			// create Label group which will holds a group of labels
			var landscapeLabels = landscapeLabelsContainer.append("g")
				.attr("id", labelindex)
				.call(dragLabelsRectangle);
			//-------------------------------------------------------------------------------------


			var dummyText = landscapeLabels.append("svg:text")
				.attr("dx", labelPosX - 2)
				.attr("dy", labelPosY)
				.attr("id", "dummyLandscapeLabel").attr("depth", labelDepth)
				.style("font-size", (fontSize+labelWeight))
				.style("fill", labelColor)
				.text(maxCharText)

			textBoxHeight = dummyText.node().getBBox().height;
			textBoxWidth = dummyText.node().getBBox().width;

			svgcanvas.selectAll("#dummyLandscapeLabel").remove();

			var textBoxPosX = labelPosX - (textBoxWidth + 15)/2;
			var textBoxPosY =  labelPosY - textBoxHeight;


			if((textBoxPosX + textBoxWidth + 15) > landscapeConfig.getWidth()) {
				textBoxPosX = textBoxPosX  + landscapeConfig.getWidth() - (textBoxPosX + textBoxWidth + 15)-2;
			}

			if((textBoxPosY + labelsText.length * textBoxHeight + 10) > landscapeConfig.getHeight()) {
				textBoxPosY = textBoxPosY  + landscapeConfig.getHeight() - (textBoxPosY + labelsText.length * textBoxHeight + 10)-2;
			}




			var textBox = landscapeLabels
				.append("rect")
				.attr("id",labelindex+"_rect")
				.attr("x",textBoxPosX)
				.attr("y", textBoxPosY)
				.attr("height", labelsText.length * textBoxHeight + 10)
				.attr("width",textBoxWidth + 15)
				.attr("rx", "10")
				.attr("ry", "10")
				.style(	"opacity", 0.3)
				.style("stroke-opacity", 0.3)
				.on("mouseover", function(d, i) {
					d3.select(this).style("opacity", 0.5);
					d3.select(this).style("stroke-opacity", 0.5);
					d3.select(this).style("cursor", "pointer");
				})
				.on("mouseout", function(d, i) {
					d3.select(this).style("opacity", 0.3)
					d3.select(this).style("stroke-opacity", 0.3)
				})
			var lineId = labelindex+"_line";
			landscapeLabelsDragingLines.append("line")
			    .style("stroke", "black")
			   	.attr("id", lineId)
			    .attr("x1", labelPosX)
			    .attr("y1", labelPosY)
			    .attr("x2", labelPosX)
			    .attr("y2", labelPosY)
				.style("stroke-dasharray", ("3, 3"))
				//.style("opacity", 0.0)
				//.style("stroke-opacity", 0.0)


			$.each(labelsText, function(index, text) {
				var stem = text;
				var labelIndex = totalLabelCounter;
				if(landscapeConfig.getLandscapeType() == "urankLandscape") {
					for(var j=0; j < keywordsObj.length; j++) {
						if(keywordsObj[j].term == text) {
							stem = keywordsObj[j].stem;
							labelIndex = keywordsObj[j].index;
						}
					}
				}



				var padding = (textBoxWidth+15-text.length)/2;
				var dummyText2 = landscapeLabels.append("svg:text")
					.attr("dx", labelPosX - 2)
					.attr("dy", labelPosY)
					.attr("id", "dummyLandscapeLabel2").attr("depth", labelDepth)
					.style("font-size", (fontSize+labelWeight))
					.style("fill", labelColor)
					.text(text)

				var dummyTextWidth = dummyText2.node().getBBox().width;
				var padding = (textBoxWidth+15-dummyTextWidth)/2;
					svgcanvas.selectAll("#dummyLandscapeLabel2").remove();
					landscapeLabels.append("svg:text")
					.attr("id", "landscapeLabel_" + labelIndex)
					.attr("dx", textBoxPosX  +  padding)
					.attr("dy", (textBoxPosY + (labelCounter * textBoxHeight))+15)//
					.attr("depth", labelDepth)
					.attr("color", labelColor)
					.attr("stem", stem)
					.style("font-size", (fontSize+labelWeight))
					.style("fill", labelColor)
					.style("font-weight", fontWeight)
					.text(text)
					.attr("labelCounter", labelIndex)
						.attr("isLabelInTagBox", 0)
					.attr("labelID", labelindex).attr("text", text)
					.on("mouseover",function(d, i) {
						var color = d3.select(this).style("fill")
						d3.select(this).attr("color", color);
						d3.select(this).style("cursor", "pointer")
						d3.select(this).style("font-size", (fontSize+labelWeight))
						d3.select(this).style("fill", "#FFBE3B")
						d3.select(this).style("font-weight", "bold")
						var stem = d3.select(this).attr("stem"); 
						var tagDataset = landscapeController.dataProcessor.getObjectsBasedOnTag(stem); 
						if(landscapeConfig.getLandscapeType() == "standaloneLandscape") {
							landscapeController.stateCurrent.heighlightDocumentsByIds(tagDataset.indices);
						}		
						else if(landscapeConfig.getLandscapeType() == "urankLandscape") {
							var i = parseInt(d3.select(this).attr("labelCounter"));
							var label = d3.select(this).attr("text");
							var tagIdPrefix = "urank-tag-";
							var tagClass = 'urank-tagcloud-tag';

							var mousePos = landscapeConfig.getCurrentMousePos();
							var tagId = tagIdPrefix + i;
							 var padding = 4;
							 $('#'+tagId).css({'top':(mousePos[1]-padding),'left':(mousePos[0]-padding)}).fadeIn();
							 $('.'+tagClass).hide();
   							 $('#'+tagId).show();
						}
					})
					.on("mouseout", function(d, i) {
						var color = d3.select(this).attr("color")
						d3.select(this).style("fill", color);
						d3.select(this).style("font-weight", null)
						if(landscapeConfig.getLandscapeType() == "standaloneLandscape") {
							landscapeController.stateCurrent.heighlightDocumentsByIds([]);
						}

					}).on("click", function(d, i) {
						var tag = $( this ).html();
						var stem = d3.select(this).attr("stem"); 
						if(landscapeConfig.getLandscapeType() == "standaloneLandscape") {
							var tagDataset = landscapeController.dataProcessor.getObjectsBasedOnTag(stem); 				
							FilterHandler.setCurrentFilterCategories('category', tagDataset.dataList, "tag", [tag]);
						}

					})
					labelCounter++;
						totalLabelCounter++;
				})

		});

	}

}
