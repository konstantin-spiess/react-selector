import { Selector, SelectorPart, SelectorPartType } from '../types/selector';
import { getIndexInParent, isHTMLElement } from './dom';
import { getReactComponentNameFromElement, isReactComponent } from './react';

/**
 * Get the selector for the given element
 * @param element Element to get the selector for
 * @returns Selector for the given element
 */
export function getSelector(element: HTMLElement): Selector {
  // All possible Selectors with one SelectorPart that are unique in document.body
  const globalUniqueElementSelectors = getUniqueSelectorParts(document.body);

  let startElement = element;
  let startElementSelector = getSelectorPart(startElement);

  // Get the lowest element that has a global unique selector
  while (!isSelectorPartInArray(startElementSelector, globalUniqueElementSelectors)) {
    startElement = startElement.parentElement!;
    startElementSelector = getSelectorPart(startElement);
  }

  let selector: Selector = [startElementSelector];
  let currentElementChild = startElement;

  while (currentElementChild !== element) {
    const localUniqueElementSelectors = getUniqueSelectorParts(currentElementChild);
    const lowestUniqueChild = getLowestUniqueChild(element, currentElementChild, localUniqueElementSelectors);

    if (lowestUniqueChild) {
      selector.push(getSelectorPart(lowestUniqueChild));
      currentElementChild = lowestUniqueChild;
    } else {
      const childElement = getChildElement(currentElementChild, element);
      selector.push(getSelectorPart(childElement));
      currentElementChild = childElement;
    }
  }
  return selector;
}

/**
 *
 * @param startElement Element to start the search from
 * @param limitElement Element to stop the search at
 * @param selectorParts Array of all unique selector parts within the limit element
 * @returns Lowest child element that has a unique selector within the limit element
 */
function getLowestUniqueChild(
  startElement: HTMLElement,
  limitElement: HTMLElement,
  selectorParts: SelectorPart[]
): HTMLElement | null {
  let currentElement = startElement;
  while (currentElement !== limitElement) {
    if (isSelectorPartInArray(getSelectorPart(currentElement), selectorParts)) {
      return currentElement;
    }
    currentElement = currentElement.parentElement!;
  }
  return null;
}

/**
 * Get the child element of the given parent element that contains the given element
 * @param parentElement Parent element of the child to get
 * @param element Element that is contained in the child
 * @returns The child element that contains the given element
 */
function getChildElement(parentElement: HTMLElement, element: HTMLElement) {
  if (parentElement === element) return element;
  let currentElement = element;
  while (currentElement.parentElement !== parentElement) {
    currentElement = currentElement.parentElement!;
  }
  return currentElement;
}

/**
 * Check if the given selector part is in the given array of selector parts
 * @param selectorPart Selector part to check
 * @param selectorParts Array of selector parts to check against
 * @returns True if the selector part is in the array, false otherwise
 */
function isSelectorPartInArray(selectorPart: SelectorPart, selectorParts: SelectorPart[]) {
  return selectorParts.some((_selectorPart) => {
    return compareSelectorPartsEquals(selectorPart, _selectorPart);
  });
}

/**
 * Get all unique selector parts for elements that are contained in the given element
 * @param startElement Element to start the search from
 * @returns Array of unique selector parts
 */
function getUniqueSelectorParts(startElement: HTMLElement) {
  // All possible element parts for elements that are contained in the given element
  let allSelectorElements: SelectorPart[] = [];
  startElement.querySelectorAll('*').forEach((element) => {
    if (isHTMLElement(element)) {
      allSelectorElements = allSelectorElements.concat(getAllSelectorParts(element));
    }
  });

  // Filter out all duplicate selector parts
  const uniqueSelectorElements = allSelectorElements.filter((selectorPart, index) => {
    return !allSelectorElements.some((_selectorPart, _index) => {
      if (index === _index) return false;
      return compareSelectorPartsEquals(selectorPart, _selectorPart);
    });
  });

  return uniqueSelectorElements;
}

/**
 * Check if the given selector parts are equal
 * @param selectorElement1 Selector part to check
 * @param selectorElement2 Selector part to check against
 * @returns True if the selector parts are equal, false otherwise
 */
function compareSelectorPartsEquals(selectorElement1: SelectorPart, selectorElement2: SelectorPart) {
  const type = selectorElement1.type === selectorElement2.type;
  const value = selectorElement1.value === selectorElement2.value;
  const nthChild =
    selectorElement1.nthChildNecessary || selectorElement2.nthChildNecessary
      ? selectorElement1.nthChild === selectorElement2.nthChild
      : true;
  return type && value && nthChild;
}

/**
 * Get the selector part for the given element
 * @param element Element to get the selector part for
 * @returns Selector part for the given element
 */
export function getSelectorPart(element: HTMLElement): SelectorPart {
  const reactComponentSelectorPart = getReactComponentSelectorPart(element);
  if (reactComponentSelectorPart) return reactComponentSelectorPart;

  const idSelectorPart = getIdSelectorPart(element);
  if (idSelectorPart) return idSelectorPart;

  const classSelectorPart = getClassSelectorPart(element);
  if (classSelectorPart) return classSelectorPart;

  return getTagSelectorPart(element);
}

/**
 * Get all possible selector parts for the given element
 * @param element Element to get the selector parts for
 * @returns Array of all possible selector parts for the given element
 */
export function getAllSelectorParts(element: HTMLElement): SelectorPart[] {
  let elementSelectors: SelectorPart[] = [];

  const reactComponentSelectorPart = getReactComponentSelectorPart(element);
  if (reactComponentSelectorPart) elementSelectors.push(reactComponentSelectorPart);

  const idSelectorPart = getIdSelectorPart(element);
  if (idSelectorPart) elementSelectors.push(idSelectorPart);

  const classSelectorPart = getClassSelectorPart(element);
  if (classSelectorPart) elementSelectors.push(classSelectorPart);

  elementSelectors.push(getTagSelectorPart(element));

  return elementSelectors;
}

/**
 * Get the selector part for the given element if it is a react component
 * @param element Element to get the selector part for
 * @returns Selector part for the given element if it is a react component, null otherwise
 */
export function getReactComponentSelectorPart(element: HTMLElement): SelectorPart | null {
  const name = getReactComponentNameFromElement(element);
  if (!name) return null;

  let selectorPart: SelectorPart = {
    type: SelectorPartType.REACT_COMPONENT,
    value: name,
    nthChild: getIndexInParent(element),
    nthChildNecessary: false,
  };

  // Check necessity of nth child
  element.parentNode?.childNodes.forEach((child) => {
    if (
      child != element &&
      isHTMLElement(child) &&
      isReactComponent(child) &&
      getReactComponentNameFromElement(child) === selectorPart.value
    ) {
      selectorPart.nthChildNecessary = true;
    }
  });

  return selectorPart;
}

/**
 * Get the id selector part for the given element if it has an id
 * @param element Element to get the id selector part for
 * @returns Selector part for the given element if it has an id, null otherwise
 */
export function getIdSelectorPart(element: HTMLElement): SelectorPart | null {
  if (!element.id) return null;

  let selector: SelectorPart = {
    type: SelectorPartType.ID,
    value: element.id,
    nthChild: getIndexInParent(element),
    nthChildNecessary: false,
  };

  // Check necessity of nth child
  element.parentNode?.childNodes.forEach((child) => {
    if (child != element && isHTMLElement(child) && child.id === element.id) {
      selector.nthChildNecessary = true;
    }
  });

  return selector;
}

/**
 * Get the class selector part for the given element if it has a class
 * @param element Element to get the class selector part for
 * @returns Selector part for the given element if it has a class, null otherwise
 */
export function getClassSelectorPart(element: HTMLElement): SelectorPart | null {
  if (!element.className) return null;

  let selector: SelectorPart = {
    type: SelectorPartType.CLASS,
    value: element.classList[0],
    nthChild: getIndexInParent(element),
    nthChildNecessary: false,
  };

  // Check necessity of nth child
  element.parentNode?.childNodes.forEach((child) => {
    if (child != element && isHTMLElement(child) && child.className === element.className) {
      selector.nthChildNecessary = true;
    }
  });

  // Handle next scss module class names
  if (selector.value) {
    selector.value = sanatizeNextModuleClassName(selector.value);
  }

  return selector;
}

/**
 * Sanatizes the given class name if it is a next module class name
 * @param className Class name to sanatize
 * @returns Sanatized class name
 */
function sanatizeNextModuleClassName(className: string) {
  const regex = '(.*_.*)__\\w{5}';
  const filteredClassName = className.match(regex);
  if (filteredClassName) {
    return filteredClassName[1];
  }
  return className;
}

/**
 * Get the tag selector part for the given element if it is a tag
 * @param element Element to get the tag selector part for
 * @returns Selector part for the given element if it is a tag, null otherwise
 */
export function getTagSelectorPart(element: HTMLElement): SelectorPart {
  let selector: SelectorPart = {
    type: SelectorPartType.TAG,
    value: element.tagName.toLowerCase(),
    nthChild: getIndexInParent(element),
    nthChildNecessary: false,
  };

  // Check necessity of nth child
  element.parentNode?.childNodes.forEach((child) => {
    if (child != element && isHTMLElement(child) && child.tagName === element.tagName) {
      selector.nthChildNecessary = true;
    }
  });

  return selector;
}
