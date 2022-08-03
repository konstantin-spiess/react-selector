import { Message, isInitMessage, isMessage, isLogMessage, isChangeSelectionMessage } from './types/message';

//
// Message passing: devtools -> background
//

// Connections from devtools to background
let connections: { [key: number]: chrome.runtime.Port } = {};

// Manage incomming connections only from devtools
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'devtools') {
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
    if (isLogMessage(message)) {
      console.log(message.payload);
    }
    if (isChangeSelectionMessage(message)) {
      chrome.tabs.sendMessage(message.tabId, message);
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

/**
 * TODO: Message passing: content script -> background
 */

// Receive message from content script and relay to the devTools page for the
// current tab
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
