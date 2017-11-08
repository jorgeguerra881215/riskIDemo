// Numeric Constants
window.TAG_CATEGORIES = 5;

//  String Constants
window.STR_NO_VIS = "No visualization yet!";
window.STR_DROPPED = "Dropped!";
//window.STR_DROP_TAGS_HERE = "Drop tags here!";
window.STR_DROP_TAGS_HERE = "Select connections to compare!";
window.STR_JUST_RANKED = "new";
window.STR_SEARCHING = "Searching...";
window.STR_UNDEFINED = 'undefined';


window.VIS_MODULES = {
    ranking: Ranking
};

window.TAGCLOUD_MODULES = {
    default: TagCloudDefault
    //,landscape: LandscapeTagCloud
};


window.RANKING_STATUS = {
    new : 'new',
    update : 'update',
    unchanged : 'unchanged',
    no_ranking : 'no_ranking'
};


window.RANKING_MODE = {
    overall_score: 'overallScore',
    max_score: 'maxScore'
};

window.USER_ACTION = {
    added: 'keyword added',
    deleted: 'keyword deleted',
    weighted: 'changed weight',
    bookmarked: 'document bookmarked',
    unbookmarked: 'document unbookmarked',
    watched: 'watching document',
    unwatched: 'document unwatched',
    mode: 'ranking mode changed'
};

