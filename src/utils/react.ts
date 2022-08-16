import { FiberNode, FiberRootNode } from 'react-devtools-inline';

/**
 * Check if element is react root
 * @param element DOM element
 * @returns true if element is react root
 */
export function isReactRoot(element: any) {
  if (element.hasOwnProperty('_reactRootContainer')) {
    return true;
  }
  return false;
}

/**
 * Get react fiber property key
 * @param element DOM element
 * @returns key of fiber property or undefined
 */
export function getReactFiberKey(element: any) {
  return Object.keys(element).find(
    (key) => key.startsWith('__reactInternalInstance') || key.startsWith('__reactFiber')
  );
}

/**
 * Check if element is react component
 * @param element DOM element
 * @returns true if element is a react component
 */
export function isReactComponent(element: any) {
  if (getReactFiberKey(element)) {
    return true;
  }
  return false;
}

/**
 * Get react fiber node
 * @param element DOM element
 * @returns React fiber node or null
 */
export function getReactFiber(element: any) {
  if (isReactRoot(element)) {
    return element._reactRootContainer._internalRoot as FiberRootNode;
  }
  if (isReactComponent(element)) {
    const key = getReactFiberKey(element);
    if (key) {
      return element[key] as FiberNode;
    }
  }
  return null;
}

/**
 * Get react component name
 * @param fiber fiber node
 * @returns React component name or null
 */
export function getReactComponentNameFromFiber(fiber: FiberNode) {
  const componentType = fiber.return?.type;
  if (!componentType) {
    return null;
  }
  if (typeof componentType == 'object' || typeof componentType == 'function') {
    return componentType.name;
  }
  return null;
}

/**
 * Get react component name
 * @param element element node
 * @returns React component name or null
 */
export function getReactComponentNameFromElement(element: Element) {
  const fiber = getReactFiber(element);
  if (!fiber) return null;
  if (isReactFiberRootNode(fiber)) return null;
  return getReactComponentNameFromFiber(fiber);
}

/**
 * Check type FiberRootNode
 * @param fiberNode FiberNode oder FiberRootNode
 * @returns true if FiberRootNode
 */
export function isReactFiberRootNode(fiberNode: FiberNode | FiberRootNode): fiberNode is FiberRootNode {
  return fiberNode.hasOwnProperty('current');
}

export function getUniqueReactComponents(startNode: Element) {
  let components: string[] = [];
  const queue = [startNode];
  while (queue.length > 0) {
    const currentElement = queue.shift()!;
    if (isReactComponent(currentElement)) {
      const reactFiber = getReactFiber(currentElement) as FiberNode;
      if (!reactFiber) break;
      const componentName = getReactComponentNameFromFiber(reactFiber);
      if (componentName && !components.includes(componentName)) {
        components.push(componentName);
      }
    }
    for (const child of currentElement.children) {
      queue.push(child);
    }
  }
  return components;
}
