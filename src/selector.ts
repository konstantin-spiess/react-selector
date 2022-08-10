import { ChangeSelectionEvent } from './types/event';
import { Selector, SelectorElement, SelectorElementType } from './types/selector';
import { findReactRoot } from './utils/dom';
import { getReactComponentName, getReactFiber, isReactFiberRootNode } from './utils/react';

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
    const selectedElement = document.querySelector(`[data-react-selector-id='${selectionId}']`) as HTMLElement;
    if (!selectedElement) return; // no matching element

    const reactFiber = getReactFiber(selectedElement);
    if (!reactFiber) return; // element not part of react application

    const selector = getSelector(selectedElement);

    window.postMessage(
      {
        name: 'selector',
        selectors: [selector],
      },
      '*'
    );
  }

  function getSelector(element: HTMLElement): Selector {
    let currentElement: HTMLElement | null = element;
    let selector = [getElementSelector(currentElement)];
    while (currentElement != reactRootElement) {
      currentElement = currentElement.parentElement!;
      selector.unshift(getElementSelector(currentElement));
    }
    return selector;
  }

  /**
   * Returns the selector for the given element
   * @param element HTMLElement inside the react root element
   * @returns selector string of the element
   */
  function getElementSelector(element: HTMLElement): SelectorElement {
    const reactFiber = getReactFiber(element)!;

    if (isReactFiberRootNode(reactFiber)) {
      return {
        type: SelectorElementType.REACT_ROOT,
        value: 'ReactRoot',
      };
    }

    const name = getReactComponentName(reactFiber);
    if (name) {
      return {
        type: SelectorElementType.REACT_COMPONENT,
        value: name,
      };
    }

    const id = element.id;
    if (id) {
      return {
        type: SelectorElementType.ID,
        value: id,
      };
    }
    const className = element.className;
    if (className) {
      return {
        type: SelectorElementType.CLASS,
        value: className,
      };
    }

    return {
      type: SelectorElementType.TAG,
      value: element.tagName.toLowerCase(),
    };
  }
}

export {};
