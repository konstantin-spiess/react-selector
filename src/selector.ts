import { getReactComponentName, getReactFiber, isReactFiberRootNode } from './utils/reactUtils';

const selectedElemetMarkerQuery = import.meta.env.VITE_SELECTED_ELEMENT_MARKER_QUERY;

document.addEventListener('changeSelection', () => {
  const selectedElement = document.querySelector(selectedElemetMarkerQuery);
  if (!selectedElement) return;

  const fibernode = getReactFiber(selectedElement);

  if (!fibernode) {
    console.log('not part of react application');
    return;
  }
  if (isReactFiberRootNode(fibernode)) {
    console.log('React root');
    return;
  }
  const name = getReactComponentName(fibernode);
  if (!name) {
    console.log('no react component');
    return;
  }
  console.log(name);
});

export {};
