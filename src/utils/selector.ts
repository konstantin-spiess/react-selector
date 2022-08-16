import { Selector, SelectorElement, SelectorElementType } from '../types/selector';
import { getIndexInParent, isElement } from './dom';
import { getReactComponentNameFromElement, isReactComponent, isReactRoot } from './react';

/**
 * Get the selector for the given element
 * @param element Element to get the selector for
 * @returns Selector for the given element
 */
export function getSelector(element: HTMLElement): Selector {
  let currentElement: HTMLElement | null = element;
  let selector = [getElementSelector(currentElement)];
  while (!isReactRoot(currentElement)) {
    currentElement = currentElement.parentElement!;
    selector.unshift(getElementSelector(currentElement));
  }
  return selector;
}

// export function getSelector(element: HTMLElement): Selector {
//   const globalUniqueSelectorElements: SelectorElement[] = getUniqueSelectorElements(element);
//   let currentElement: HTMLElement | null = element;
//   let selector = [getElementSelector(currentElement)];
//   while (!isReactRoot(currentElement)) {
//     currentElement = currentElement.parentElement!;
//     selector.unshift(getElementSelector(currentElement));
//   }
//   return selector;
// }

// function getUniqueSelectorElements(element: Element) {
//   let uniqueSelectorElements: SelectorElement[] = [];
//   const queue = [element];
//   while (queue.length > 0) {
//     const currentElement = queue.shift()!;
//     const currentELementSelectors = getAllElementSelectors(currentElement);
//     if (componentName && !uniqueSelectorElements.includes(componentName)) {
//       uniqueSelectorElements.push(componentName);
//     }
//     for (const child of currentElement.children) {
//       queue.push(child as HTMLElement);
//     }
//   }
//   return uniqueSelectorElements;
// }

/**
 * Returns the selector for the given element
 * @param element HTMLElement inside the react root element
 * @returns selector string of the element
 */
export function getElementSelector(element: Element): SelectorElement {
  const reactComponentSelector = getReactComponentElementSelector(element);
  if (reactComponentSelector) return reactComponentSelector;

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

  return getTagElementSelector(element);
}

export function getAllElementSelectors(element: Element): SelectorElement[] {
  let elementSelectors: SelectorElement[] = [];
  const reactComponentSelector = getReactComponentElementSelector(element);
  if (reactComponentSelector) elementSelectors.push(reactComponentSelector);

  const id = element.id;
  if (id) {
    elementSelectors.push({ type: SelectorElementType.ID, value: id });
  }
  const className = element.className;
  if (className) {
    elementSelectors.push({ type: SelectorElementType.CLASS, value: className });
  }
  elementSelectors.push(getTagElementSelector(element));

  return elementSelectors;
}

export function getReactComponentElementSelector(element: Element): SelectorElement | null {
  const name = getReactComponentNameFromElement(element);
  if (!name) return null;

  let selector: SelectorElement = {
    type: SelectorElementType.REACT_COMPONENT,
    value: name,
  };

  element.parentNode?.childNodes.forEach((child) => {
    if (
      child != element &&
      isElement(child) &&
      isReactComponent(child) &&
      getReactComponentNameFromElement(child) === selector.value
    ) {
      selector.nthChild = getIndexInParent(element);
    }
  });

  return selector;
}

export function getTagElementSelector(element: Element): SelectorElement {
  let selector: SelectorElement = {
    type: SelectorElementType.TAG,
    value: element.tagName.toLowerCase(),
  };

  element.parentNode?.childNodes.forEach((child) => {
    if (child != element && isElement(child) && child.tagName === element.tagName) {
      selector.nthChild = getIndexInParent(element);
    }
  });

  return selector;
}
