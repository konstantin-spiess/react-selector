import { isChangeSelectionMessage } from './types/message';
import selector from './selector?script&module';

const selectedElementMarker = import.meta.env.VITE_SELECTED_ELEMENT_MARKER;
const selectedElemetMarkerQuery = import.meta.env.VITE_SELECTED_ELEMENT_MARKER_QUERY;

const changeSelectionEvent = new Event('changeSelection');
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

  // Update selected element reference
  if (selectedElement) {
    selectedElement.removeAttribute(selectedElementMarker);
  }
  selectedElement = document.querySelector(selectedElemetMarkerQuery);

  // Dispach event for selector script
  if (selectedElement) {
    document.dispatchEvent(changeSelectionEvent);
  }
});

export {};
