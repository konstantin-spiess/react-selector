export {};

chrome.devtools.panels.elements.createSidebarPane('React Selector', (panel) => {
  // chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
  //   chrome.devtools.inspectedWindow.eval('parseDOM($0)', { useContentScriptContext: true });
  // });
  panel.setPage('src/devtools/panel/panel.html');
});
