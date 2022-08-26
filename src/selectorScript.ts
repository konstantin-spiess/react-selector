import { ChangeSelectionEvent } from './types/event';
import { findReactRoot } from './utils/dom';
import { getReactFiber } from './utils/react';
import { getSelector } from './utils/selector';

init();

function init() {
  // Only run when body has react application
  const reactRootElement = findReactRoot(document.body);
  if (!reactRootElement) {
    return;
  }

  // Handle change selection event from content script
  window.addEventListener('changeSelection', (event: Event) => {
    const detail = (event as CustomEvent<ChangeSelectionEvent>).detail;
    handleSelectionChange(detail.selectionId);
  });

  function handleSelectionChange(selectionId: string) {
    const selectedElement = document.querySelector(`[data-react-selector-id='${selectionId}']`) as HTMLElement;
    // no matching element
    if (!selectedElement) return;

    const reactFiber = getReactFiber(selectedElement);
    // element not part of react application
    if (!reactFiber) return;

    const selector = getSelector(selectedElement);
    window.postMessage({ name: 'selector', selectors: [selector] }, '*');
  }
}
