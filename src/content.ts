import { isChangeSelectionMessage } from './types/message';

let selectedElement: Element | null;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (isChangeSelectionMessage(request)) {
    if (selectedElement) {
      selectedElement.removeAttribute('data-react-selector-selected');
    }
    selectedElement = document.querySelector('[' + 'data-react-selector-selected' + ']');
    if (selectedElement) {
      console.log(selectedElement);
    }
  }
  // console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');
  // if (request.greeting === 'hello') sendResponse({ farewell: 'goodbye' });
});

export {};
