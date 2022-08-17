import { Selector, SelectorElement, SelectorElementType } from '../types/selector';
import { getIndexInParent, isHTMLElement } from './dom';
import { getReactComponentNameFromElement, isReactComponent, isReactRoot } from './react';

/**
 * Get the selector for the given element
 * @param element Element to get the selector for
 * @returns Selector for the given element
 */
export function getSelector(element: HTMLElement): Selector {
  const globalUniqueElementSelectors = getUniqueSelectorElements(document.body);

  let startElement = element;
  let startElementSelector = getElementSelector(startElement);

  while (!isSelectorElementInArray(startElementSelector, globalUniqueElementSelectors)) {
    startElement = startElement.parentElement!;
    startElementSelector = getElementSelector(startElement);
  }
  let selector: Selector = [];

  if (startElement != element) {
    let currentElementChild = startElement;
    while (currentElementChild !== element) {
      const localUniqueElementSelectors = getUniqueSelectorElements(currentElementChild);
      const lowestUniqueChild = getLowestUniqueChild(element, currentElementChild, localUniqueElementSelectors);

      if (lowestUniqueChild) {
        selector.push(getElementSelector(lowestUniqueChild));
        currentElementChild = getChildElement(lowestUniqueChild, element);
      } else {
        selector.push(getElementSelector(getChildElement(startElement, element)));
        currentElementChild = getChildElement(currentElementChild, element);
      }
    }
    selector.push(getElementSelector(element));
  }
  selector.unshift(startElementSelector);
  return selector;
}

function getLowestUniqueChild(
  startElement: HTMLElement,
  limitElement: HTMLElement,
  selectorElements: SelectorElement[]
): HTMLElement | null {
  let currentElement = startElement;
  while (currentElement !== limitElement) {
    if (isSelectorElementInArray(getElementSelector(currentElement), selectorElements)) {
      return currentElement;
    }
    currentElement = currentElement.parentElement!;
  }
  return null;
}

function getChildElement(parentElement: HTMLElement, element: HTMLElement) {
  if (parentElement === element) return element;
  let currentElement = element;
  while (currentElement.parentElement !== parentElement) {
    currentElement = currentElement.parentElement!;
  }
  return currentElement;
}

function isSelectorElementInArray(selectorElement: SelectorElement, selectorElements: SelectorElement[]) {
  return selectorElements.some((_selectorElement) => {
    return compareSelectorElementsEquals(selectorElement, _selectorElement);
  });
}

/**
 * Gets all unique selectors for the given element and its children
 * @param startElement Rootelement to start the search from
 * @returns Set of all unique selectors for the given element and its children
 */
function getUniqueSelectorElements(startElement: Element) {
  // Get all possible elementSelectors for the given element and its children
  let allSelectorElements: SelectorElement[] = [];
  startElement.querySelectorAll('*').forEach((element) => {
    if (isHTMLElement(element)) {
      allSelectorElements = allSelectorElements.concat(getElementSelector(element));
    }
  });

  // Filter out all duplicate selector elements
  const uniqueSelectorElements = allSelectorElements.filter((selectorElement, index) => {
    return !allSelectorElements.some((otherSelectorElement, otherIndex) => {
      if (index === otherIndex) return false;
      return compareSelectorElementsEquals(selectorElement, otherSelectorElement);
    });
  });

  return uniqueSelectorElements;
}

function compareSelectorElementsEquals(selectorElement1: SelectorElement, selectorElement2: SelectorElement) {
  if (selectorElement1.nthChildNecessary && selectorElement2.nthChildNecessary) {
    return (
      selectorElement1.type === selectorElement2.type &&
      selectorElement1.value === selectorElement2.value &&
      selectorElement1.nthChild === selectorElement2.nthChild
    );
  }

  return selectorElement1.type === selectorElement2.type && selectorElement1.value === selectorElement2.value;
}

/**
 * Returns the selector for the given element
 * @param element HTMLElement inside the react root element
 * @returns selector string of the element
 */
export function getElementSelector(element: HTMLElement): SelectorElement {
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
      isHTMLElement(child) &&
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
    if (child != element && isHTMLElement(child) && child.id === element.id) {
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
    if (child != element && isHTMLElement(child) && child.className === element.className) {
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
    if (child != element && isHTMLElement(child) && child.tagName === element.tagName) {
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
