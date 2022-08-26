import { isChangeSelectionMessage, isMessage, isSelectorMessage } from './types/message';
import selector from './selectorScript?script&module';
import { ChangeSelectionEvent } from './types/event';

let selectedElement: Element | null;

// Inject selector script into page
const injectScript = document.createElement('script');
injectScript.src = chrome.runtime.getURL(selector);
injectScript.type = 'module';
document.head.prepend(injectScript);
document.head.removeChild(injectScript);

// Handle change selection message from service worker
chrome.runtime.onMessage.addListener((message) => {
  if (!isChangeSelectionMessage(message)) return;

  const selectionId = message.selectionId;
  selectedElement = document.querySelector(`[data-react-selector-id='${selectionId}']`);

  // Remove old markers
  const markedElements = document.querySelectorAll('[data-react-selector-id]');
  markedElements.forEach((element) => {
    if (element.getAttribute('data-react-selector-id') == selectionId) return;
    element.removeAttribute('data-react-selector-id');
  });

  // Dispach event for injected selector script
  if (selectedElement) {
    const changeSelectionEvent = new CustomEvent<ChangeSelectionEvent>('changeSelection', {
      detail: { selectionId },
    });
    window.dispatchEvent(changeSelectionEvent);
  }
});

// Handle messages from injected selector script
window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  const message = event.data;
  if (!isMessage(message)) return;
  if (isSelectorMessage(message)) {
    chrome.runtime.sendMessage(message);
  }
});

export {};
