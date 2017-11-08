function Settings(){

    Settings.prototype.getRankingDimensions = function(domRoot, containerHeight){

        var margin = {top: 0, bottom: 20, left: 2, right: 2 };
        var width = $(domRoot).width() - margin.left - margin.right;
        var height = containerHeight || '';

        return{ 'margin': margin, 'width': width, 'height': height };
	};


	Settings.prototype.getRankingInitData = function(rankingModel){

        //var data = rankingModel.getRanking();
        var rankingData = rankingModel.getRanking();
        var attr = rankingModel.getMode();
        var a = [];
        var i = 0;

        rankingData.forEach(function(d, i){
            if(d.overallScore > 0) {
                a[i] = d;
                var x0 = 0;
                var maxWeightedScoreFound = false;

                a[i].weightedKeywords.forEach(function(wk){

                    if(attr === RANKING_MODE.overall_score){
                        wk['x0'] = x0;
                        wk['x1'] = x0 + wk['weightedScore'];
                        x0 = wk['x1'];
                    }
                    else{
                        if(wk['weightedScore'] == a[i]['maxScore'] && !maxWeightedScoreFound){
                            wk['x0'] = x0;
                            wk['x1'] = x0 + wk['weightedScore'];
                            x0 = wk['x1'];
                            maxWeightedScoreFound = true;
                        }
                        else{
                            wk['x0'] = x0;
                            wk['x1'] = x0;
                        }
                    }
                });
            }
        });
        return { 'data' : a };
	};
};
