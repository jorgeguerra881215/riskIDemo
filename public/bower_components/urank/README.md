# uRank

## Description

Use uRank to visualize a colleciton of documents and rank them according to keywords selected by the user

![alt tag](https://cloud.githubusercontent.com/assets/6489976/6713829/25e9161e-cd95-11e4-88b5-6cf0ba685d9d.png)

uRank consists of 5 components:
 * Tag Cloud: shows keywords extracted for the whole collection as tags. Color intensity indicates term frequency
 * Tag Box: the user can drag and drop tags here to query the collection, which in turns creates or updates the document ranking
 * Content List: displays documents in a list. As the ranking is updated, it shows additional information, such as ranking position and number of positions changed respect to the last ranking state
 * Vis Canvas: displays a ranking visualization as stacked bars. It depicts overall scores and query term contribution. Alternatively, documents can be ranked by maximum term score
 * Doc Viewer: when a document is selected, its title, content and other metadata are displayed here

![alt-tag](https://cloud.githubusercontent.com/assets/6489976/6714765/5c18502e-cd9a-11e4-95f3-925c0eeb9da4.png)

## How to use it

Include the following files in the header:
 * jquery (version 1.10.2 or higher)
 * modernizr (urank/dependencies/modernizr.js)
 * urank entry point (urank/urank.js)
 
Example (assume urank folder is inside the folder scripts/):
```
<script type="text/javascript" src="libs/jquery-1.10.2.js" charset="utf-8"></script>
<script type="text/javascript" src="scripts/urank/dependencies/modernizr.js" charset="utf-8"></script>
<script type="text/javascript" src="scripts/urank/urank.js" charset="utf-8"></script>
```

Create the DOM elements that will serve as containers for the 5 aforementioned blocks.
In your code, call the Urank function passing 3 arguments: 
 1. A callback function that will receive a UrankController object as argument
 2. An object specifying initialization settings
 3. A string with the path to urank folder

Example:
```
var options = {
   tagCloudRoot: '#tag_cloud',
   tagBoxRoot: '#tag_box',
   contentListRoot: '#content_list',
   visCanvasRoot: '#vis_canvas',
   docViewerRoot: '#doc_viewer'
};

var init = function(urank){
   $('#btn_reset').click(urank.reset);
   $('#btn_sort_by_overall_score').click(urank.rankByOverallScore);
   $('#btn_sort_by_max_score').click(urank.rankByMaximumScore);
   urank.loadData(data);
};

Urank(init, options, 'scripts/urank/');
```

`options` passes the DOM elements that will be roots for each specific component (see full list below). `init` is the callback function that receives a UrankController object: `urank`. This controller provides three event handlers that can be bound to your own DOM elements: `reset`, `rankByOverallScore` and `rankByMaximumScore`. To load a collection of documents, call urank's `loadData` method passing your data array as argument.
 
## Full list of initizialization options

 * root: {string} DOM selector for element that captures mousedown events and causes certain effects to disappear. Default: 'body'
 * tagCloudRoot: {string} DOM selector for tagCloud container
 * tagBoxRoot:  {string} DOM selector for tagBox container
 * contentListRoot:  {string} DOM selector for contentList container
 * visCanvasRoot:  {string} DOM selector for visCanvas container
 * docViewerRoot:  {string} DOM selector for docViewer container
 * tagColorArray: {array} (optional) HEX color strings for tags in Tag Cloud. It should be a palette for sequential data (see colorbrewer2.org)
 * queryTermColorArray: {array} (optional) HEX color strings for tags in Tag Box. It should be a palette for qualitative data (see colorbrewer2.org)
 
####Callbacks to be executed after homonymous methods (optional)
 * onLoad: receives array with keywords extracted from loaded data
 * onChange: receives two parameters: ranking data array and seleced keywords array
 * onReset
 * onRankByOverallScore
 * onRankByMaximumScore
 * onItemClicked: receives document id as parameter
 * onItemMouseEnter: receives document id as parameter
 * onItemMouseLeave: receives document id as parameter
 * onFaviconClicked: receives document id as parameter
 * onWatchiconClicked: receives document id as parameter
 * onTagInCloudMouseEnter: receives tag index in keywords array
 * onTagInCloudMouseLeave: receives tag index in keywords array
 * onTagInCloudClick: receives tag index in keywords array
 * onTagDeleted: receives tag index in keywords array
 * onTagInBoxMouseEnter: receives tag index in keywords array
 * onTagInBoxMouseLeave: receives tag index in keywords array
 * onTagInBoxClick: receives tag index in keywords array
 * onDocumentHintClick: receives tag index in keywords array
 * onKeywordHintMouseEnter: receives tag index in keywords array
 * onKeywordHintMouseLeave: receives tag index in keywords array
 * onKeywordHintClick: receives tag index in keywords array

######Notes:
  * Document Hint: green pie chart shown when a tag in the Tagcloud is hovered. Depicts the amount of documents in the collection containing the keyword. If this hint is clicked, the corresponding documents are highlighted in the content list and ranking view
  * Keyword Hint: red circle shown when a tag in the Tagcloud is hovered. The white number indicates the number frequently co-occurring keywords. If the red circle is clicked, the view is "frozen" so it is possible to navigate in the Tagcloud.



