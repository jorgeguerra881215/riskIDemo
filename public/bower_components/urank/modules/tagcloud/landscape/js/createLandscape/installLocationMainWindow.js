var init = false;

function getInstallLocationDoc() {
  setupInstallLocation();
  return window.document;
}

function getInstallLocation() {
  setupInstallLocation();
  return window.document.body;
}

function setupInstallLocation() {
  if (init) { return; }
  // var script = window.document.createElement('script');
  // script.language='javascript';
  // script.text = "var $wnd = window;";
  // window.document.body.appendChild(script);
  // init = true;
    window.$wnd = window;
    init = true;
}
