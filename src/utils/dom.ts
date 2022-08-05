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

export {};
