/**
 * @author Santokh Singh
 *
 */
function LandscapeConfig() {
	this.width = 100;
	this.height = 80;
	this.configColor = {"continuousColor": ["#00CED1", "#7AC5CD", "#5F9EA0", "#9BCD9B", "#698B69", "#6E8B3D", "#556B2F", "#006400", "#8B4513", "#8B5A2B", "#CD853F", "#EE9A49", "#FFA54F", "#CDAA7D", "#EEC591", "#FFD39B"],
			"heatmapColor": ["#defdfd", "#92dbfd", "#6c81fd", "#384dfd", "#8222be", "#c63abe", "#c17c70", "#b41f60", "#ba3053", "#d21053", "#f30053", "#fc5d53", "#f99253", "#fdb053", "#fde200", "#fdfae4"],
			"alternateColor": ["#33CCFF", "#26BFBF", "#1AB380", "#0DA640", "#009900", "#208D00", "#408200", "#5F7600", "#7F6A00", "#7F6F20", "#7F7540", "#7F7A5F", "#7F7F7F", "#9F9F9F", "#BFBFBF", "#DFDFDF"]
	}
	this.outsideDivId = "visualisationpanelcontainer";
	this.landscapeHeaderDivId = "landscapeVisHeader";
	this.landscapeDivId = "landscapevis";
	this.fontsize = 12;
	this.fontcolor = "#000000";
	this.colorType = "continuousColor";
//	this.tagCloudColorPlate = ["#FF0000", "#00FFFF", "#0000FF", "#FF0080", "#800080", "#FFFF00", "#00FF00", "#FF00FF", "#C0C0C0", "#808080", "#FF8040", "#804000", "#800000", "#9F9F9F", "#BFBFBF", "#DFDFDF"]
	this.tagCloudColorPlate = ["#000000", "#0C090A", "#2C3539", "#2B1B17", "#34282C", "#25383C", "#3B3131","#413839","#3D3C3A","#463E3F","#4C4646","#504A4B","#565051","#5C5858","#625D5D","#666362","#6D6968","#726E6D","#736F6E","#837E7C","#848482","#B6B6B4"]
	this.landscapeType = "standaloneLandscape"
	this.mouseCoords = [];
	var me = this;


	// -----------------------------------------------------------------------
	LandscapeConfig.prototype.getWidth = function() {
		return this.width;
	}

	// -----------------------------------------------------------------------
	LandscapeConfig.prototype.setWidth = function(width) {
		this.width = width;
	}

	// -----------------------------------------------------------------------
	LandscapeConfig.prototype.getHeight = function() {
		return this.height;
	}

	// -----------------------------------------------------------------------
	LandscapeConfig.prototype.setHeight = function(height) {
		this.height = height;
	}

	// -----------------------------------------------------------------------
	LandscapeConfig.prototype.getFontSize = function() {
		return this.fontsize;

	}

	// -----------------------------------------------------------------------
	LandscapeConfig.prototype.setFontSize = function(fontsize) {
		this.fontsize = fontsize;
	}


	// -----------------------------------------------------------------------
	LandscapeConfig.prototype.getFontColor = function() {
		return this.fontcolor;
	}

	// -----------------------------------------------------------------------
	LandscapeConfig.prototype.setFontColor = function(fontcolor) {
		this.fontcolor = fontcolor;
	}

	// -----------------------------------------------------------------------
	LandscapeConfig.prototype.getContinuousColor = function() {
		return this.configColor[this.colorType];
	}

	// -----------------------------------------------------------------------
	LandscapeConfig.prototype.setColorType= function(colorType) {
		this.colorType = colorType;
	}

	// -----------------------------------------------------------------------
	LandscapeConfig.prototype.getTagCloudColorPlate= function() {
		return this.tagCloudColorPlate;
	}

	// -----------------------------------------------------------------------
	LandscapeConfig.prototype.setLandscapeType= function(type) {
		this.landscapeType = type;
	}

	// -----------------------------------------------------------------------
	LandscapeConfig.prototype.getLandscapeType= function() {
		return this.landscapeType;
	}

	// -----------------------------------------------------------------------
	LandscapeConfig.prototype.setCurrentMousePos= function(mouseCoords) {
		this.mouseCoords = mouseCoords;
	}


	// -----------------------------------------------------------------------
	LandscapeConfig.prototype.getCurrentMousePos= function() {
		return this.mouseCoords;
	}







}
