import { Message, isInitMessage, isMessage, isLogMessage, isChangeSelectionMessage } from './types/message';

// *** Initial basic code structure from: https://developer.chrome.com/docs/extensions/mv3/messaging/ ***

//
// Message passing: devtools -> service worker
//

// Connections from devtools to service worker
let connections: { [key: number]: chrome.runtime.Port } = {};

// Manage incomming connections only from devtools
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'devtools') {
    return;
  }

  // Handle messages sent from devtools
  const messageListener = (message: Message) => {
    if (!isMessage(message)) {
      return;
    }
    if (isInitMessage(message)) {
      connections[message.tabId] = port;
      return;
    }
    if (isLogMessage(message)) {
      console.log(message.payload);
      return;
    }
    if (isChangeSelectionMessage(message)) {
      chrome.tabs.sendMessage(message.tabId, message);
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
// Message passing: content script -> service worker
//

// Handle messages sent from content script and forward them to correct devtools connection
chrome.runtime.onMessage.addListener((message, sender) => {
  if (!isMessage(message) || !sender.tab || !sender.tab.id) {
    return;
  }
  if (sender.tab.id in connections) {
    connections[sender.tab.id].postMessage(message);
  }
});

export {};
