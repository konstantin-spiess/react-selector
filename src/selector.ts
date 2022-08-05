import { findReactRoot } from './utils/dom';
import { getReactComponentName, getReactFiber, isReactFiberRootNode } from './utils/react';

const selectedElemetMarkerQuery = import.meta.env.VITE_SELECTED_ELEMENT_MARKER_QUERY;

init();

function init() {
  const reactRootElement = findReactRoot(document.body);
  if (!reactRootElement) {
    return;
  }

  document.addEventListener('changeSelection', () => {
    handleSelectionChange();
  });

  function handleSelectionChange() {
    const selectedElement = document.querySelector(selectedElemetMarkerQuery) as HTMLElement;
    if (!selectedElement) return; // no matching element

    const reactFiber = getReactFiber(selectedElement);
    if (!reactFiber) return; // element not part of react application

    const selector = getSelector(selectedElement);
    console.log(selector);
  }

  function getSelector(element: HTMLElement) {
    let currentElement: HTMLElement | null = element;
    let selector = getElementSelector(currentElement);
    while (currentElement != reactRootElement) {
      currentElement = currentElement.parentElement!;
      selector = `${getElementSelector(currentElement)} > ${selector}`;
    }
    return selector;
  }

  /**
   * Returns the selector for the given element
   * @param element HTMLElement inside the react root element
   * @returns selector string of the element
   */
  function getElementSelector(element: HTMLElement) {
    const reactFiber = getReactFiber(element)!;

    if (isReactFiberRootNode(reactFiber)) {
      return 'ReactRoot';
    }
    const name = getReactComponentName(reactFiber);
    if (name) {
      return `ReactComponent:${name}`;
    }

    const id = element.id;
    if (id) {
      return `#${id}`;
    }
    const className = element.className;
    if (className) {
      return `.${className.split(' ').join('.')}`;
    }
    return element.tagName.toLowerCase();
  }
}

export {};
