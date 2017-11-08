function WordsCloud() {
	this.tagsList = []
	this.urankPrefix = ""; 
	this.landscapeTagCloudPrefix = "landscapeTagCloud_";
	var me = this; 
	// -----------------------------------------------------------------------
	WordsCloud.prototype.draw = function(tags) {
		var widthLandscapeCloud =  $( "#eexcess_landscape_tag_cloud" ).width();
		var heightLandscapeCloud = $( "#eexcess_landscape_tag_cloud" ).height();

		var tagsData = [];
		tagsData = JSON.parse( JSON.stringify( tags ) );
		var min = 100000000;
		var max = 0;
		for(var i=0; i < tagsData.length; i++) {
			var size = tagsData[i].size; 
			if (size < min) {
				min = size;
			}
			if (size > max) {
				max = size;
			}
		
		}
		wordScale = d3.scale.linear().domain([ 0, max ]).range([ 14, max+12 ]);
		if(max > 60) {
			wordScale = d3.scale.linear().domain([ 0, max ]).range([ 14, 45+12 ]);
		}
		else {
		}

		d3.layout.cloud().size([ widthLandscapeCloud, heightLandscapeCloud ]).words(tagsData).padding(5).rotate(
				function() {
					return ~~(Math.random() * 2) * 1;
				}).font("Impact").fontSize(function(d) {
			return (wordScale(d.size));
		}).on("end", updateCloud).start();
	}
	
	// -----------------------------------------------------------------------	
	WordsCloud.prototype.clearTagCloud = function(){
		tagCloudCanvas.select("#landscapeTagsCloud").data([]).exit().remove(); 	
	}
	

	// -----------------------------------------------------------------------
	WordsCloud.prototype.getTagsList = function(index){
		return this.tagsList; 		
	}
		
	// -----------------------------------------------------------------------
	WordsCloud.prototype.addUrankTagStyling = function(index, color){
		var tagId = this.landscapeTagCloudPrefix + index; 
		if(!d3.select("#"+tagId).empty()) {
			$tag = d3.select("#"+tagId); 
			var prevColor  = $tag.style("fill"); 
			$tag = d3.select("#"+tagId); 
			$tag.style("color", prevColor ); 
		    $tag.style("fill", color ); 
			$tag.style("font-weight", "bold"); 	
		}
	}
	
	
	// -----------------------------------------------------------------------
	WordsCloud.prototype.removeUrankTagStyling = function(index){
		var tagId = this.landscapeTagCloudPrefix + index; 
		if(!d3.select("#"+tagId).empty()) {
			$tag = d3.select("#"+tagId); 
			var prevColor  = $tag.style("color"); 
			$tag.style("fill", prevColor ); 
			$tag.style("font-weight", null);

		}
	}
	
	
	function updateCloud(words) {
		
		var widthLandscapeCloud =  $( "#eexcess_landscape_tag_cloud" ).width()/2;
		var heightLandscapeCloud =  $( "#eexcess_landscape_tag_cloud" ).height()/2;
		var tagBox = 	this.tagBox; 
		var fill = landscapeConfig.getTagCloudColorPlate();
		
		var allLabelDivs  =$('#dragableLandscapeLabels').children(); 
		var createdLabelsDivs = {}
		$(allLabelDivs).each(function(index, item){                 
        	var text = $(item).attr("text");
        	var id =   $(item).attr("id");
        	var pos =  $(item).attr("tag-pos");
        	
        	createdLabelsDivs[text] = {"id":id, "pos":pos};           
    	});
    	var inBoxCreatedDivs = {}   
    	var keywordBoxElements  = $('#eexcess_keywords_box').children(); 
		$(keywordBoxElements).each(function(index, item){         
        	var text = $(item).attr("text");
        	var id =   $(item).attr("id");
        	var pos =  $(item).attr("tag-pos");
			inBoxCreatedDivs[text] =  {"id":id, "pos":pos};
			createdLabelsDivs[text] = {"id":id, "pos":pos}; 
		});      
		var tagCounter = allLabelDivs.length; 
		var count = 0; 
		tagCloudCanvas.select("#landscapeTagsCloud").data([]).exit().remove(); 
		tagCloudCanvas.append("g")
	  		.attr("id","landscapeTagsCloud")
	        .attr("transform", "translate("+widthLandscapeCloud+","+widthLandscapeCloud+")")
	        .selectAll("text")
	        .data(words)
		      .enter().append("text")
		      .style("font-size", function(d) { 
		      	return d.size + "px"; 
		      })
		      .style("font-family", "Impact")
		      .style("fill", function(d, i) {
		      	if(d.text in inBoxCreatedDivs) {	  
		        	return $("#"+inBoxCreatedDivs[d.text].id).css("background-color");
				}			
		    	return fill[i];
		    	// return fill(i); 
		      })
		      .attr("text-anchor", "middle")
		      .attr("id",  function(d) {
		      	if(d.text in createdLabelsDivs) {
		      		return  "landscapeTagCloud_" + createdLabelsDivs[d.text].pos; 
		      	}
		    	
		        return "landscapeTagCloud_"+(count++);
		      })
		      .attr("stem",  function(d) {
		        return d.stem;
		      })
		      .attr("text",  function(d) {
		         return d.text; 
		      })
		       .attr("color",  function(d, i) {
		         // if(d.text in inBoxCreatedDivs) {	  
		        	// return $("#"+inBoxCreatedDivs[d.text].id).css("background-color");
				// }			
		    	return fill[i];
		      })
		      .attr("transform", function(d) {
		        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
		      }).text(function(d) {
		    	  return d.text; 
		      }).on("click", function(d, i) {
		    	  	var tag = $( this ).html();
		    	  	var stem = d3.select(this).attr("stem"); 
					if(landscapeConfig.getLandscapeType() == "standaloneLandscape") {
						var tagDataset = landscapeController.dataProcessor.getObjectsBasedOnTag(stem); 				
						FilterHandler.setCurrentFilterCategories('category', tagDataset.dataList, "tag", [tag]);
					}
			}).on("mouseover",function(d, i) {
		      		var color = d3.select(this).style("fill")
					d3.select(this).attr("color", color); 	    	  	
					d3.select(this).style("cursor", "pointer")
					d3.select(this).style("font-weight", "bold")
					d3.select(this).style("fill", "#B26200")

					var stem = d3.select(this).attr("stem"); 
					var text = d3.select(this).attr("text"); 
					var pos = d3.select(this).attr("pos"); 
					var tagDataset = landscapeController.dataProcessor.getObjectsBasedOnTag(stem); 
					if(landscapeConfig.getLandscapeType() == "standaloneLandscape") {
						landscapeController.stateCurrent.heighlightDocumentsByIds(tagDataset.indices);
					}		
					else if (landscapeConfig.getLandscapeType() == "urankLandscape") {
						var i = parseInt(d3.select(this).attr("tagCounter"));
						var tagIdPrefix = "urank-tag-";
						var tagClass = 'urank-tagcloud-tag';
						$('.' + tagClass).hide();
						if(text in createdLabelsDivs) {
							var tagId = createdLabelsDivs[text].id;		
							var mousePos = landscapeConfig.getCurrentMousePos();
							var padding = 4; 
							$('#'+tagId).css({'top':(mousePos[1]-padding),'left':(mousePos[0]-padding)}).fadeIn();
							$('#' + tagId).show();
						}
					}

// 					

		      }).on("mouseout", function(d, i) {
		      		var color = d3.select(this).attr("color")
					d3.select(this).style("fill", color);
					d3.select(this).style("font-weight", null)
					if(landscapeConfig.getLandscapeType() == "standaloneLandscape") {
						landscapeController.stateCurrent.heighlightDocumentsByIds([]);

					}

			});
	}
	

}
  	