import { isChangeSelectionMessage } from './types/message';
import selector from './selector?script&module';
import { ChangeSelectionEvent } from './types/event';

let selectedElement: Element | null;

// Inject selector script into page
const injectScript = document.createElement('script');
injectScript.src = chrome.runtime.getURL(selector);
injectScript.type = 'module';
document.head.prepend(injectScript);
document.head.removeChild(injectScript);

// Listen for selection change from backgrounds
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (!isChangeSelectionMessage(request)) return;

  const selectionId = request.selectionId;
  selectedElement = document.querySelector(`[data-react-selector-id='${selectionId}']`);

  // Dispach event for selector script
  if (selectedElement) {
    const changeSelectionEvent = new CustomEvent<ChangeSelectionEvent>('changeSelection', {
      detail: { selectionId },
    });
    document.dispatchEvent(changeSelectionEvent);
  }

  // Remove all markers
  const markedElements = document.querySelectorAll('[data-react-selector-id]');
  markedElements.forEach((element) => {
    if (element.getAttribute('data-react-selector-id') == selectionId) return;
    element.removeAttribute('data-react-selector-id');
  });
});

// Listener for messages from selector script
window.addEventListener('message', function (event) {
  // Only accept messages from the same frame
  if (event.source !== window) return;

  const message = event.data;

  // Only accept messages that we know are ours
  if (typeof message !== 'object' || message === null || message.name !== 'selector') return;

  chrome.runtime.sendMessage(message);
});

export {};
