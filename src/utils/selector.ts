import { Selector, SelectorElement, SelectorElementType } from '../types/selector';
import { getIndexInParent, isElement } from './dom';
import { getReactComponentNameFromElement, isReactComponent, isReactRoot } from './react';

/**
 * Get the selector for the given element
 * @param element Element to get the selector for
 * @returns Selector for the given element
 */
export function getSelector(element: Element): Selector {
  const globalUniqueElementSelectors = getUniqueSelectorElements(document.body);
  console.log('globalUniqueElementSelectors', globalUniqueElementSelectors);

  let startElement = element;
  let startElementSelector = getElementSelector(startElement);

  while (!globalUniqueElementSelectors.has(selectorElementToString(startElementSelector))) {
    if (!startElement.parentNode || !isElement(startElement.parentNode)) {
      console.log('no parent', startElementSelector);
      break;
    }
    startElement = startElement.parentNode;
    startElementSelector = getElementSelector(startElement);
  }

  console.log('startElement', startElementSelector);

  let selector = [startElementSelector];
  let currentElement = element;

  console.log('currentElement', currentElement);

  while (currentElement != startElement) {
    selector.unshift(getElementSelector(currentElement));
    if (!currentElement.parentNode || !isElement(currentElement.parentNode)) {
      console.log('no parent', startElementSelector);
      break;
    }
    currentElement = currentElement.parentNode;
  }
  console.log('selector', selector);
  return selector;
}

/**
 * Gets all unique selectors for the given element and its children
 * @param startElement Rootelement to start the search from
 * @returns Set of all unique selectors for the given element and its children
 */
function getUniqueSelectorElements(startElement: Element) {
  let uniqueSelectorElements = new Map<string, SelectorElement>();
  let duplicateSelectorElements = new Set<string>();
  const queue = [startElement];
  while (queue.length > 0) {
    const currentElement = queue.shift()!;
    const currentElementSelectors = getAllElementSelectors(currentElement);
    currentElementSelectors.forEach((selector) => {
      const stringRepresentation = selectorElementToString(selector);
      if (duplicateSelectorElements.has(stringRepresentation) || uniqueSelectorElements.has(stringRepresentation)) {
        duplicateSelectorElements.add(stringRepresentation);
        uniqueSelectorElements.delete(stringRepresentation);
      } else {
        uniqueSelectorElements.set(stringRepresentation, selector);
      }
    });

    for (const child of currentElement.children) {
      queue.push(child);
    }
  }
  return uniqueSelectorElements;
}

/**
 * Returns the selector for the given element
 * @param element HTMLElement inside the react root element
 * @returns selector string of the element
 */
export function getElementSelector(element: Element): SelectorElement {
  const reactComponentSelector = getReactComponentElementSelector(element);
  if (reactComponentSelector) return reactComponentSelector;

  const idSelector = getIdElementSelector(element);
  if (idSelector) return idSelector;

  const classSelector = getClassElementSelector(element);
  if (classSelector) return classSelector;

  return getTagElementSelector(element);
}

export function getAllElementSelectors(element: Element): SelectorElement[] {
  let elementSelectors: SelectorElement[] = [];

  const reactComponentSelector = getReactComponentElementSelector(element);
  if (reactComponentSelector) elementSelectors.push(reactComponentSelector);

  const idSelector = getIdElementSelector(element);
  if (idSelector) elementSelectors.push(idSelector);

  const classSelector = getClassElementSelector(element);
  if (classSelector) elementSelectors.push(classSelector);

  elementSelectors.push(getTagElementSelector(element));

  return elementSelectors;
}

export function getReactComponentElementSelector(element: Element): SelectorElement | null {
  const name = getReactComponentNameFromElement(element);
  if (!name) return null;

  let selector: SelectorElement = {
    type: SelectorElementType.REACT_COMPONENT,
    value: name,
    nthChild: getIndexInParent(element),
    nthChildNecessary: false,
  };

  element.parentNode?.childNodes.forEach((child) => {
    if (
      child != element &&
      isElement(child) &&
      isReactComponent(child) &&
      getReactComponentNameFromElement(child) === selector.value
    ) {
      selector.nthChildNecessary = true;
    }
  });

  return selector;
}

export function getIdElementSelector(element: Element): SelectorElement | null {
  if (!element.id) return null;

  let selector: SelectorElement = {
    type: SelectorElementType.ID,
    value: element.id,
    nthChild: getIndexInParent(element),
    nthChildNecessary: false,
  };

  element.parentNode?.childNodes.forEach((child) => {
    if (child != element && isElement(child) && child.id === element.id) {
      selector.nthChildNecessary = true;
    }
  });

  return selector;
}

export function getClassElementSelector(element: Element): SelectorElement | null {
  if (!element.className) return null;

  let selector: SelectorElement = {
    type: SelectorElementType.CLASS,
    value: element.className,
    nthChild: getIndexInParent(element),
    nthChildNecessary: false,
  };

  element.parentNode?.childNodes.forEach((child) => {
    if (child != element && isElement(child) && child.className === element.className) {
      selector.nthChildNecessary = true;
    }
  });

  return selector;
}

export function getTagElementSelector(element: Element): SelectorElement {
  let selector: SelectorElement = {
    type: SelectorElementType.TAG,
    value: element.tagName.toLowerCase(),
    nthChild: getIndexInParent(element),
    nthChildNecessary: false,
  };

  element.parentNode?.childNodes.forEach((child) => {
    if (child != element && isElement(child) && child.tagName === element.tagName) {
      selector.nthChildNecessary = true;
    }
  });

  return selector;
}

/**
 * Convert SelectorElement to string representation
 * @param selectorElement SelectorElement to convert
 * @returns string representation of the selector element
 */
function selectorElementToString(selectorElement: SelectorElement) {
  return `${selectorElement.type}${selectorElement.value ? `[${selectorElement.value}]` : ''}${
    selectorElement.nthChild ? `:nth-child(${selectorElement.nthChild})` : ''
  }`;
}
