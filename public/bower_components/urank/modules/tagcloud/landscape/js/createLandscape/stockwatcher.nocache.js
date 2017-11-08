function stockwatcher(){
  var $intern_0 = 'bootstrap', $intern_1 = 'begin', $intern_2 = 'gwt.codesvr.stockwatcher=', $intern_3 = 'gwt.codesvr=', $intern_4 = 'stockwatcher', $intern_5 = 'startup', $intern_6 = 'DUMMY', $intern_7 = 0, $intern_8 = 1, $intern_9 = 'script', $intern_10 = 'javascript', $intern_11 = 'Failed to load ', $intern_12 = 'moduleStartup', $intern_13 = 'scriptTagAdded', $intern_14 = 'moduleRequested', $intern_15 = 'undefined', $intern_16 = 'DOMContentLoaded', $intern_17 = 50, $intern_18 = 'meta', $intern_19 = 'name', $intern_20 = 'stockwatcher::', $intern_21 = '', $intern_22 = '::', $intern_23 = 'gwt:property', $intern_24 = 'content', $intern_25 = '=', $intern_26 = 'gwt:onPropertyErrorFn', $intern_27 = 'Bad handler "', $intern_28 = '" for "gwt:onPropertyErrorFn"', $intern_29 = 'gwt:onLoadErrorFn', $intern_30 = '" for "gwt:onLoadErrorFn"', $intern_31 = '#', $intern_32 = '?', $intern_33 = '/', $intern_34 = 'img', $intern_35 = 'clear.cache.gif', $intern_36 = 'baseUrl', $intern_37 = 'stockwatcher.nocache.js', $intern_38 = 'base', $intern_39 = '//', $intern_40 = 'user.agent', $intern_41 = 'webkit', $intern_42 = 'safari', $intern_43 = 'msie', $intern_44 = 10, $intern_45 = 11, $intern_46 = 'ie10', $intern_47 = 9, $intern_48 = 'ie9', $intern_49 = 8, $intern_50 = 'ie8', $intern_51 = 'gecko', $intern_52 = 'gecko1_8', $intern_53 = 2, $intern_54 = 3, $intern_55 = 4, $intern_56 = 'selectingPermutation', $intern_57 = 'stockwatcher.devmode.js', $intern_58 = '1F80C0E6F07875FCF6FC2BE5C35E017F', $intern_59 = '8D79AF4465E6B1BCBE3896CFBCFEFD1F', $intern_60 = '8F9C876D1D43ED645622AC139C839B02', $intern_61 = 'AB63AB82739ACD56BA4EF565AB230DB9', $intern_62 = 'BB62E49B549DD2218BD9B51DB220B3E5', $intern_63 = ':', $intern_64 = '.cache.js', $intern_65 = 'loadExternalRefs', $intern_66 = 'end', $intern_67 = 'http:', $intern_68 = 'file:', $intern_69 = '_gwt_dummy_', $intern_70 = '__gwtDevModeHook:stockwatcher', $intern_71 = 'Ignoring non-whitelisted Dev Mode URL: ', $intern_72 = ':moduleBase', $intern_73 = 'head';
  var $wnd = window;
  var $doc = document;
  sendStats($intern_0, $intern_1);
  function isHostedMode(){
    var query = $wnd.location.search;
    return query.indexOf($intern_2) != -1 || query.indexOf($intern_3) != -1;
  }

  function sendStats(evtGroupString, typeString){
    if ($wnd.__gwtStatsEvent) {
      $wnd.__gwtStatsEvent({moduleName:$intern_4, sessionId:$wnd.__gwtStatsSessionId, subSystem:$intern_5, evtGroup:evtGroupString, millis:(new Date).getTime(), type:typeString});
    }
  }

  stockwatcher.__sendStats = sendStats;
  stockwatcher.__moduleName = $intern_4;
  stockwatcher.__errFn = null;
  stockwatcher.__moduleBase = $intern_6;
  stockwatcher.__softPermutationId = $intern_7;
  stockwatcher.__computePropValue = null;
  stockwatcher.__getPropMap = null;
  stockwatcher.__installRunAsyncCode = function(){
  }
  ;
  stockwatcher.__gwtStartLoadingFragment = function(){
    return null;
  }
  ;
  stockwatcher.__gwt_isKnownPropertyValue = function(){
    return false;
  }
  ;
  stockwatcher.__gwt_getMetaProperty = function(){
    return null;
  }
  ;
  var __propertyErrorFunction = null;
  var activeModules = $wnd.__gwt_activeModules = $wnd.__gwt_activeModules || {};
  activeModules[$intern_4] = {moduleName:$intern_4};
  stockwatcher.__moduleStartupDone = function(permProps){
    var oldBindings = activeModules[$intern_4].bindings;
    activeModules[$intern_4].bindings = function(){
      var props = oldBindings?oldBindings():{};
      var embeddedProps = permProps[stockwatcher.__softPermutationId];
      for (var i = $intern_7; i < embeddedProps.length; i++) {
        var pair = embeddedProps[i];
        props[pair[$intern_7]] = pair[$intern_8];
      }
      return props;
    }
    ;
  }
  ;
  function installScript(filename){
    __WAIT_FOR_BODY_LOADED__;
    function installCode(code_0){
      var doc = getInstallLocationDoc();
      var docbody = doc.body;
      var script = doc.createElement($intern_9);
      script.language = $intern_10;
      script.src = code_0;
      if (stockwatcher.__errFn) {
        script.onerror = function(){
          stockwatcher.__errFn($intern_4, new Error($intern_11 + code_0));
        }
        ;
      }
      docbody.appendChild(script);
      sendStats($intern_12, $intern_13);
    }

    sendStats($intern_12, $intern_14);
    setupWaitForBodyLoad(function(){
      installCode(filename);
    }
    );
  }

  function installScript(filename){
    function setupWaitForBodyLoad(callback){
      function isBodyLoaded(){
        if (typeof $doc.readyState == $intern_15) {
          return typeof $doc.body != $intern_15 && $doc.body != null;
        }
        return /loaded|complete/.test($doc.readyState);
      }

      var bodyDone = isBodyLoaded();
      if (bodyDone) {
        callback();
        return;
      }
      function onBodyDone(){
        if (!bodyDone) {
          bodyDone = true;
          callback();
          if ($doc.removeEventListener) {
            $doc.removeEventListener($intern_16, onBodyDone, false);
          }
          if (onBodyDoneTimerId) {
            clearInterval(onBodyDoneTimerId);
          }
        }
      }

      if ($doc.addEventListener) {
        $doc.addEventListener($intern_16, onBodyDone, false);
      }
      var onBodyDoneTimerId = setInterval(function(){
        if (isBodyLoaded()) {
          onBodyDone();
        }
      }
      , $intern_17);
    }

    function installCode(code_0){
      var doc = getInstallLocationDoc();
      var docbody = doc.body;
      var script = doc.createElement($intern_9);
      script.language = $intern_10;
      script.src = code_0;
      if (stockwatcher.__errFn) {
        script.onerror = function(){
          stockwatcher.__errFn($intern_4, new Error($intern_11 + code_0));
        }
        ;
      }
      docbody.appendChild(script);
      sendStats($intern_12, $intern_13);
    }

    sendStats($intern_12, $intern_14);
    setupWaitForBodyLoad(function(){
      installCode(filename);
    }
    );
  }

  stockwatcher.__startLoadingFragment = function(fragmentFile){
    return computeUrlForResource(fragmentFile);
  }
  ;
  stockwatcher.__installRunAsyncCode = function(code_0){
    var doc = getInstallLocationDoc();
    var docbody = doc.body;
    var script = doc.createElement($intern_9);
    script.language = $intern_10;
    script.text = code_0;
    docbody.appendChild(script);
  }
  ;
  function processMetas(){
    var metaProps = {};
    var propertyErrorFunc;
    var onLoadErrorFunc;
    var metas = $doc.getElementsByTagName($intern_18);
    for (var i = $intern_7, n = metas.length; i < n; ++i) {
      var meta = metas[i], name_0 = meta.getAttribute($intern_19), content;
      if (name_0) {
        name_0 = name_0.replace($intern_20, $intern_21);
        if (name_0.indexOf($intern_22) >= $intern_7) {
          continue;
        }
        if (name_0 == $intern_23) {
          content = meta.getAttribute($intern_24);
          if (content) {
            var value_0, eq = content.indexOf($intern_25);
            if (eq >= $intern_7) {
              name_0 = content.substring($intern_7, eq);
              value_0 = content.substring(eq + $intern_8);
            }
             else {
              name_0 = content;
              value_0 = $intern_21;
            }
            metaProps[name_0] = value_0;
          }
        }
         else if (name_0 == $intern_26) {
          content = meta.getAttribute($intern_24);
          if (content) {
            try {
              propertyErrorFunc = eval(content);
            }
             catch (e) {
              alert($intern_27 + content + $intern_28);
            }
          }
        }
         else if (name_0 == $intern_29) {
          content = meta.getAttribute($intern_24);
          if (content) {
            try {
              onLoadErrorFunc = eval(content);
            }
             catch (e) {
              alert($intern_27 + content + $intern_30);
            }
          }
        }
      }
    }
    __gwt_getMetaProperty = function(name_0){
      var value_0 = metaProps[name_0];
      return value_0 == null?null:value_0;
    }
    ;
    __propertyErrorFunction = propertyErrorFunc;
    stockwatcher.__errFn = onLoadErrorFunc;
  }

  function computeScriptBase(){
    function getDirectoryOfFile(path){
      var hashIndex = path.lastIndexOf($intern_31);
      if (hashIndex == -1) {
        hashIndex = path.length;
      }
      var queryIndex = path.indexOf($intern_32);
      if (queryIndex == -1) {
        queryIndex = path.length;
      }
      var slashIndex = path.lastIndexOf($intern_33, Math.min(queryIndex, hashIndex));
      return slashIndex >= $intern_7?path.substring($intern_7, slashIndex + $intern_8):$intern_21;
    }

    function ensureAbsoluteUrl(url_0){
      if (url_0.match(/^\w+:\/\//)) {
      }
       else {
        var img = $doc.createElement($intern_34);
        img.src = url_0 + $intern_35;
        url_0 = getDirectoryOfFile(img.src);
      }
      return url_0;
    }

    function tryMetaTag(){
      var metaVal = __gwt_getMetaProperty($intern_36);
      if (metaVal != null) {
        return metaVal;
      }
      return $intern_21;
    }

    function tryNocacheJsTag(){
      var scriptTags = $doc.getElementsByTagName($intern_9);
      for (var i = $intern_7; i < scriptTags.length; ++i) {
        if (scriptTags[i].src.indexOf($intern_37) != -1) {
          return getDirectoryOfFile(scriptTags[i].src);
        }
      }
      return $intern_21;
    }

    function tryBaseTag(){
      var baseElements = $doc.getElementsByTagName($intern_38);
      if (baseElements.length > $intern_7) {
        return baseElements[baseElements.length - $intern_8].href;
      }
      return $intern_21;
    }

    function isLocationOk(){
      var loc = $doc.location;
      return loc.href == loc.protocol + $intern_39 + loc.host + loc.pathname + loc.search + loc.hash;
    }

    var tempBase = tryMetaTag();
    if (tempBase == $intern_21) {
      tempBase = tryNocacheJsTag();
    }
    if (tempBase == $intern_21) {
      tempBase = tryBaseTag();
    }
    if (tempBase == $intern_21 && isLocationOk()) {
      tempBase = getDirectoryOfFile($doc.location.href);
    }
    tempBase = ensureAbsoluteUrl(tempBase);
    return tempBase;
  }

  function computeUrlForResource(resource){
    if (resource.match(/^\//)) {
      return resource;
    }
    if (resource.match(/^[a-zA-Z]+:\/\//)) {
      return resource;
    }
    return stockwatcher.__moduleBase + resource;
  }

  function getCompiledCodeFilename(){
    var answers = [];
    var softPermutationId = $intern_7;
    function unflattenKeylistIntoAnswers(propValArray, value_0){
      var answer = answers;
      for (var i = $intern_7, n = propValArray.length - $intern_8; i < n; ++i) {
        answer = answer[propValArray[i]] || (answer[propValArray[i]] = []);
      }
      answer[propValArray[n]] = value_0;
    }

    var values = [];
    var providers = [];
    function computePropValue(propName){
      var value_0 = providers[propName](), allowedValuesMap = values[propName];
      if (value_0 in allowedValuesMap) {
        return value_0;
      }
      var allowedValuesList = [];
      for (var k in allowedValuesMap) {
        allowedValuesList[allowedValuesMap[k]] = k;
      }
      if (__propertyErrorFunction) {
        __propertyErrorFunction(propName, allowedValuesList, value_0);
      }
      throw null;
    }

    providers[$intern_40] = function(){
      var ua = navigator.userAgent.toLowerCase();
      var docMode = $doc.documentMode;
      if (function(){
        return ua.indexOf($intern_41) != -1;
      }
      ())
        return $intern_42;
      if (function(){
        return ua.indexOf($intern_43) != -1 && (docMode >= $intern_44 && docMode < $intern_45);
      }
      ())
        return $intern_46;
      if (function(){
        return ua.indexOf($intern_43) != -1 && (docMode >= $intern_47 && docMode < $intern_45);
      }
      ())
        return $intern_48;
      if (function(){
        return ua.indexOf($intern_43) != -1 && (docMode >= $intern_49 && docMode < $intern_45);
      }
      ())
        return $intern_50;
      if (function(){
        return ua.indexOf($intern_51) != -1 || docMode >= $intern_45;
      }
      ())
        return $intern_52;
      return $intern_21;
    }
    ;
    values[$intern_40] = {gecko1_8:$intern_7, ie10:$intern_8, ie8:$intern_53, ie9:$intern_54, safari:$intern_55};
    __gwt_isKnownPropertyValue = function(propName, propValue){
      return propValue in values[propName];
    }
    ;
    stockwatcher.__getPropMap = function(){
      var result = {};
      for (var key in values) {
        if (values.hasOwnProperty(key)) {
          result[key] = computePropValue(key);
        }
      }
      return result;
    }
    ;
    stockwatcher.__computePropValue = computePropValue;
    $wnd.__gwt_activeModules[$intern_4].bindings = stockwatcher.__getPropMap;
    sendStats($intern_0, $intern_56);
    if (isHostedMode()) {
      return computeUrlForResource($intern_57);
    }
    var strongName;
    try {
      unflattenKeylistIntoAnswers([$intern_50], $intern_58);
      unflattenKeylistIntoAnswers([$intern_52], $intern_59);
      unflattenKeylistIntoAnswers([$intern_42], $intern_60);
      unflattenKeylistIntoAnswers([$intern_46], $intern_61);
      unflattenKeylistIntoAnswers([$intern_48], $intern_62);
      strongName = answers[computePropValue($intern_40)];
      var idx = strongName.indexOf($intern_63);
      if (idx != -1) {
        softPermutationId = parseInt(strongName.substring(idx + $intern_8), $intern_44);
        strongName = strongName.substring($intern_7, idx);
      }
    }
     catch (e) {
    }
    stockwatcher.__softPermutationId = softPermutationId;
    return computeUrlForResource(strongName + $intern_64);
  }

  function loadExternalStylesheets(){
    if (!$wnd.__gwt_stylesLoaded) {
      $wnd.__gwt_stylesLoaded = {};
    }
    sendStats($intern_65, $intern_1);
    sendStats($intern_65, $intern_66);
  }

  processMetas();
  stockwatcher.__moduleBase = computeScriptBase();
  activeModules[$intern_4].moduleBase = stockwatcher.__moduleBase;
  var filename = getCompiledCodeFilename();
  if ($wnd) {
    var devModePermitted = !!($wnd.location.protocol == $intern_67 || $wnd.location.protocol == $intern_68);
    $wnd.__gwt_activeModules[$intern_4].canRedirect = devModePermitted;
    function supportsSessionStorage(){
      var key = $intern_69;
      try {
        $wnd.sessionStorage.setItem(key, key);
        $wnd.sessionStorage.removeItem(key);
        return true;
      }
       catch (e) {
        return false;
      }
    }

    if (devModePermitted && supportsSessionStorage()) {
      var devModeKey = $intern_70;
      var devModeUrl = $wnd.sessionStorage[devModeKey];
      if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/.*$/.test(devModeUrl)) {
        if (devModeUrl && (window.console && console.log)) {
          console.log($intern_71 + devModeUrl);
        }
        devModeUrl = $intern_21;
      }
      if (devModeUrl && !$wnd[devModeKey]) {
        $wnd[devModeKey] = true;
        $wnd[devModeKey + $intern_72] = computeScriptBase();
        var devModeScript = $doc.createElement($intern_9);
        devModeScript.src = devModeUrl;
        var head = $doc.getElementsByTagName($intern_73)[$intern_7];
        head.insertBefore(devModeScript, head.firstElementChild || head.children[$intern_7]);
        return false;
      }
    }
  }
  loadExternalStylesheets();
  sendStats($intern_0, $intern_66);
  installScript(filename);
  return true;
}

stockwatcher.succeeded = stockwatcher();
