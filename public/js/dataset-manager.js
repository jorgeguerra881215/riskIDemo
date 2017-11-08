

function datasetManager(){

    var datasetMappings = {
        DS_Co: {
            //description: 'Connections 22',
            //file: 'dataset_ctu13.json'
            description: 'CTU-13 Dataset',
            file: 'dataset_test.json'
        }/*,
        DS_Ro: {
            description: 'Connections 87',
            file: 'dataset_Cx87.json'
        },
        DS_AR: {
            description: 'Connections 45',
            file: 'dataset_Cx45.json'
        },
        DS_Al: {
            description: 'Connections all',
            file: 'dataset_CxAll.json'
        }*/
    };

    /*var datasetMappings = {
        DS_Co: {
            description: 'Connections',
            file: 'dataset_Cx.json'
        },
        DS_Ro: {
            description: 'Robots',
            file: 'dataset_Ro.json'
        },
        DS_AR: {
            description: 'Augmented Reality',
            file: 'dataset_AR.json'
        },
        DS_WW: {
            description: 'Women in Workforce',
            file: 'dataset_WW.json'
        },
        DS_CE: {
            description: 'Circular Economy',
            file: 'dataset_CE.json'
        },
        DS_Co: {
            description: 'Connections',
            file: 'dataset_Cx.json'
        }
    };*/

    this.getIDsAndDescriptions = function(){
        var idsAndDescriptions = [];
        Object.keys(datasetMappings).forEach(function(id, i){
            idsAndDescriptions.push({ id: id, description: datasetMappings[id].description });
        });
        return idsAndDescriptions;
    };


    this.getDataset = function(datasetId, callback){

        if(datasetMappings[datasetId]){
            $.getJSON('datasets/'+datasetMappings[datasetId].file, function(data){
                console.log('Dataset '+ datasetId +' retrieved');
                callback.call(this, data);
            })
            .fail(function(jqXHR, textStatus, errorThrown) { console.log('getJSON request failed! ' + textStatus + ' --- ' + errorThrown.message);
                                                           console.log(jqXHR); });
        }
        else {
            console.log("Invalid dataset id (value=" + datasetId + ')');
        }

    };


}
