import { nanoid } from 'nanoid';
import type { ChangeSelectionMessage } from '../types/message';

//
// Message passing: devtools -> background
//

// Initialize the connection to the background
const backgroundConnection = chrome.runtime.connect({
  name: 'devtools',
});

// Provide tabId to background
backgroundConnection.postMessage({
  name: 'init',
  tabId: chrome.devtools.inspectedWindow.tabId,
});

//
// Handle element selection in inspector: mark element in dom, inform content script
//
chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
  const selectionId = nanoid(5);
  const expression = `$0.setAttribute('data-react-selector-id', '${selectionId}')`;
  chrome.devtools.inspectedWindow.eval(expression, (result, exceptionInfo) => {
    if (exceptionInfo) {
      console.error(exceptionInfo);
      return;
    }

    const message: ChangeSelectionMessage = {
      name: 'updateSelection',
      tabId: chrome.devtools.inspectedWindow.tabId,
      selectionId,
    };
    backgroundConnection.postMessage(message);
  });
});

//
// UI: Sidepanel
//
chrome.devtools.panels.elements.createSidebarPane('React Selector', (panel) => {
  panel.setPage('src/devtools/panel/panel.html');
});

export {};
