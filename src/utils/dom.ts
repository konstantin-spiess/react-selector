import { isReactRoot } from './react';

/**
 * Find the react root element with bfs
 * @param startElement element that contains the react root element
 * @returns the react root element or null
 */
export function findReactRoot(startElement: HTMLElement): HTMLElement | null {
  const queue = [startElement];
  while (queue.length > 0) {
    const currentElement = queue.shift()!;
    if (isReactRoot(currentElement)) {
      return currentElement;
    }
    for (const child of currentElement.children) {
      queue.push(child as HTMLElement);
    }
  }
  return null;
}

/**
 * Typeguard for HTMLElement
 * @param node node to check
 * @returns element type predicate
 */
export function isHTMLElement(node: Node): node is HTMLElement {
  return node.ELEMENT_NODE === 1;
}

/**
 * Get index of element in parent element
 * @param element element to get index of
 * @returns index or -1 if not found
 */
export function getIndexInParent(element: HTMLElement): number {
  let index = 1;
  for (const child of element.parentNode!.children) {
    if (child === element) {
      return index;
    }
    index++;
  }
  return -1;
}
