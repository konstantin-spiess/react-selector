import { nanoid } from 'nanoid';
import { ChangeSelectionMessage, isInitMessage, isMessage, Message } from '../types/message';

//
// Message passing: devtools -> service worker
//

// Initialize the connection to the service worker
const serviceWorkerConnection = chrome.runtime.connect({
  name: 'devtools',
});

// Provide tabId to service worker
serviceWorkerConnection.postMessage({
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
    serviceWorkerConnection.postMessage(message);
  });
});

//
// Create UI: Sidepanel
//
chrome.devtools.panels.elements.createSidebarPane('React Selector', (panel) => {
  panel.setPage('src/devtools/panel/panel.html');
});

// Connections from sidepanel to devtools page
let connections: { [key: number]: chrome.runtime.Port } = {};

// Manage incomming connections only from sidepanel
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'panel') {
    return;
  }

  // Handle messages sent from sidepanel
  const messageListener = (message: Message) => {
    if (!isMessage(message)) {
      return;
    }
    if (isInitMessage(message)) {
      connections[message.tabId] = port;
      return;
    }
  };
  port.onMessage.addListener(messageListener);

  // Handle disconnect listener
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

//
// Message passing: service worker -> devtools
//

// Handle messages sent from service worker and forward them to correct sidepanel connection
chrome.runtime.onMessage.addListener((message, sender) => {
  if (!isMessage(message) || !sender.tab || !sender.tab.id) {
    return;
  }
  if (sender.tab.id in connections) {
    connections[sender.tab.id].postMessage(message);
  }
});

export {};
