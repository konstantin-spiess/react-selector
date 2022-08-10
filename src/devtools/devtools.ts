import { nanoid } from 'nanoid';
import { ChangeSelectionMessage, isInitMessage, isMessage, Message } from '../types/message';

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

let connections: { [key: number]: chrome.runtime.Port } = {};

// Manage incomming connections only from devtools
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'panel') {
    return;
  }

  // Handle different messages in listener
  const messageListener = (message: Message) => {
    if (!isMessage(message)) {
      return;
    }
    if (isInitMessage(message)) {
      connections[message.tabId] = port;
      return;
    }
  };

  // Attach listener to devtools connection
  port.onMessage.addListener(messageListener);

  // Handle disconnect
  port.onDisconnect.addListener((port) => {
    port.onMessage.removeListener(messageListener);

    const tabs = Object.keys(connections);
    for (let i = 0, len = tabs.length; i < len; i++) {
      if (connections[Number(tabs[i])] == port) {
        delete connections[Number(tabs[i])];
        break;
      }
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Messages from content scripts should have sender.tab set
  if (sender.tab) {
    const tabId = sender.tab.id;
    if (!tabId) {
      console.log('tabId is undefined');
    } else if (tabId in connections) {
      connections[tabId].postMessage(request);
    } else {
      console.log('Tab not found in connection list.');
    }
  } else {
    console.log('sender.tab not defined.');
  }
  return true;
});

export {};
