import { ChangeSelectionMessage } from '../types/message';
import { nanoid } from 'nanoid';

/**
 * Message passing: devtools -> background
 */

// Initialize the connection to the background
const backgroundConnection = chrome.runtime.connect({
  name: 'devtools',
});

// Provide tabId to background
backgroundConnection.postMessage({
  name: 'init',
  tabId: chrome.devtools.inspectedWindow.tabId,
});

/**
 * Handle element selection in inspector: mark element in dom, inform content script
 */
chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
  const expression = `$0.setAttribute('data-react-selector-selected', 'true')`;
  chrome.devtools.inspectedWindow.eval(expression, (result, exceptionInfo) => {
    if (exceptionInfo) {
      console.error(exceptionInfo);
    } else {
      const message: ChangeSelectionMessage = {
        name: 'updateSelection',
        tabId: chrome.devtools.inspectedWindow.tabId,
      };
      backgroundConnection.postMessage(message);
    }
  });
});

/**
 * UI: Sidepanel
 */
chrome.devtools.panels.elements.createSidebarPane('React Selector', (panel) => {
  panel.setPage('src/devtools/panel/panel.html');
});

export {};
