import { findReactRoot } from './utils/domUtils';
import { getReactComponentName, getReactFiber, isReactFiberRootNode } from './utils/reactUtils';

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
    if (!selectedElement) return;

    const selector = getSelector(selectedElement);
    console.log(selector);

    // const fibernode = getReactFiber(selectedElement);

    // if (!fibernode) {
    //   console.log('not part of react application');
    //   return;
    // }
    // if (isReactFiberRootNode(fibernode)) {
    //   console.log('React root');
    //   return;
    // }
    // const name = getReactComponentName(fibernode);
    // if (!name) {
    //   console.log('no react component');
    //   return;
    // }
    // console.log(name);
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

  function getElementSelector(element: HTMLElement) {
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
