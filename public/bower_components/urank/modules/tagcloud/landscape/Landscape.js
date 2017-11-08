var LandscapeLoader = {
	isLoading: false,
	callbacks: [],
	load:function(callback){
		LandscapeLoader.callbacks.push(callback);
		if (!LandscapeLoader.isLoading){
			LandscapeLoader.isLoading = true;
			pathToLandscape = 'landscape/';
		    Modernizr.load([{
		        load: [
		            pathToLandscape + 'js/createLandscape/installLocationMainWindow.js',
		            pathToLandscape + 'js/createLandscape/stockwatcher.nocache.js',
		            pathToLandscape + 'css/landscape.css',
		           	pathToLandscape + 'js/libs/javascript.util.min.js',
		           	pathToLandscape + 'js/libs/jsts.min.js',
		            pathToLandscape + 'js/libs/underscore.js', // needs to be loaded after stockwatcher.nocache.js
		            pathToLandscape + 'js/libs/d3.layout.cloud.js',
		            pathToLandscape + 'js/drawLancscape/Documents.js',
		            pathToLandscape + 'js/drawLancscape/Isolines.js',
		            pathToLandscape + 'js/drawLancscape/LandscapeConfig.js',
		            pathToLandscape + 'js/drawLancscape/LandscapeHitsMetaData.js',
		            pathToLandscape + 'js/drawLancscape/LandscapeLabels.js',
		            pathToLandscape + 'js/drawLancscape/LandscapeState.js',
		            pathToLandscape + 'js/drawLancscape/WordsCloud.js',
		            pathToLandscape + 'js/drawLancscape/STRTreeJSTS.js',
		            pathToLandscape + 'js/drawLancscape/SVGFilter.js',
		            pathToLandscape + 'js/preProcessing/DataPreProcessor.js',
		            pathToLandscape + 'js/utils/CosineSimilarity.js',
		            pathToLandscape + 'LandscapeController.js'
		        ],
		        complete: function(){
		            LandscapeLoader.loadingFinished();
		        }
			}]);
		}
	},
	loadingFinished:function(){
		for (var i=0; i<LandscapeLoader.callbacks.length; i++){
			LandscapeLoader.callbacks[i]();
		}
		LandscapeLoader.callbacks = [];
		LandscapeLoader.isLoading = false;
	}
};
