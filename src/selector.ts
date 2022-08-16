import { ChangeSelectionEvent } from './types/event';
import { Selector, SelectorElement, SelectorElementType } from './types/selector';
import { findReactRoot } from './utils/dom';
import { getReactComponentNameFromFiber, getReactFiber, isReactFiberRootNode } from './utils/react';
import { getElementSelector, getSelector } from './utils/selector';

init();

function init() {
  const reactRootElement = findReactRoot(document.body);
  if (!reactRootElement) {
    return;
  }

  document.addEventListener('changeSelection', (event: Event) => {
    const detail = (event as CustomEvent<ChangeSelectionEvent>).detail;
    handleSelectionChange(detail.selectionId);
  });

  function handleSelectionChange(selectionId: string) {
    const selectedElement = document.querySelector(`[data-react-selector-id='${selectionId}']`);
    // no matching element
    if (!selectedElement) return;

    const reactFiber = getReactFiber(selectedElement);
    // element not part of react application
    if (!reactFiber) return;

    const selector = getSelector(selectedElement);
    window.postMessage({ name: 'selector', selectors: [selector] }, '*');
  }
}
