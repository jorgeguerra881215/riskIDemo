
var RankingArray = (function() {

    function RankingArray(arguments) {

        var rankingData = Object.create(Array.prototype);
        rankingData = Array.apply(rankingData, arguments) || rankingData;
        rankingData = RankingArray.injectOwnMethods(rankingData);
        return rankingData;
    }

    RankingArray.injectOwnMethods = function(rankingData) {
        for(var method in RankingArray.prototype) {
            if(RankingArray.prototype.hasOwnProperty(method)) {
                rankingData[method] = RankingArray.prototype[method];
            }
        }
        return rankingData;
    }

    RankingArray.prototype = {

        addEmptyElement: function(datum) {
            datum.originalIndex = this.length;
            datum.rankingPos = 0;
            datum.overallScore = 0;
            datum.maxScore = 0;
            datum.positionsChanged = 1000;
            datum.weightedKeywords = new Array();
            var copy = this;
            copy.push(datum);
            return copy;
        },

        //  Sorts the dataRanking array by overall or maximum score, using the quicksort algorithm
        sortBy: function(attr){

            quicksort(this);

            function quicksort(array){
                qsort(array, 0, array.length);
            }

            function qsort(array, begin, end) {
                if(end-1 > begin) {
                    var pivot = begin +  Math.floor((end - begin) / 2); //begin + Math.floor(Math.random() * (end - begin));
                    pivot = partition(array, begin, end, pivot);
                    qsort(array, begin, pivot);
                    qsort(array, pivot+1, end);
                }
            }

            function partition(array, begin, end, pivot) {
                var piv = array[pivot];
                array.swap(pivot, end-1);
                var store = begin;
                var ix;
                for(ix = begin; ix < end-1; ++ix) {
                    //if(array[ix].overallScore >= piv.overallScore) {
                    if(array[ix][attr] >= piv[attr]) {
                        array.swap(store, ix);
                        ++store;
                    }
                }
                array.swap(end-1, store);
                return store;
            }
            return this;
        },


        assignRankingPositions: function(attr){
            var currentScore = Number.MAX_VALUE;
            var currentPos = 1;
            var itemsInCurrentPos = 0;
            this.forEach(function(d, i){
                if(d[attr] > 0){
                    if( d[attr] < currentScore ){
                        currentPos = currentPos + itemsInCurrentPos;
                        currentScore = d[attr];
                        itemsInCurrentPos = 1;
                    } else{
                        itemsInCurrentPos++;
                    }
                    d.rankingPos = currentPos;

                } else{
                    d.rankingPos = 0;
                }
            });
            return this;
        },
        //  Calculates the number of positions changed by each recommendations, basing on the array "previousRanking"
        //  If there doesn't exist a previous ranking or a recommendation wasn't previously ranked, then the value 1000 is assigned
        addPositionsChanged: function(oldRanking){
            this.forEach(function(d, i){
                if(oldRanking.length == 0){
                    d.positionsChanged = 1000;
                    d.lastIndex = d.originalIndex;
                }
                else{
                    var j = _.findIndex(oldRanking, function(oldItem){ return oldItem.id == d.id; });

                    d.lastIndex = j;
                    if(oldRanking[j].rankingPos === 0 )
                        d.positionsChanged = 1000;
                    else
                        d.positionsChanged = oldRanking[j].rankingPos - d.rankingPos;
                }
            });
            return this;
        },

        clear: function() {
            this.splice(0, this.length);
        },

        swap: function(index1, index2){
            var tmp = this[index1];
            this[index1] = this[index2];
            this[index2] = tmp;
        },
        clone: function() {
            var a = this;
            return a;
        },
        set: function(other) {
            var a = this;
            a.clear();
            other.forEach(function(item, i){
                var keys = Object.keys(item);
                var obj = {};
                keys.forEach(function(key){
                    obj[key] = item[key];
                });
                a.push(obj);
            });
            return a;
        }

    };

    return RankingArray;
})();



