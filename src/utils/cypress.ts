import { Selector, SelectorElement, SelectorElementType } from '../types/selector';

/**
 * Get the cypress query for the given selector
 * @param selector Selector to get the cypress query for
 * @returns cypress query for the selector
 */
export function getCypressQueryFromSelector(selector: Selector) {
  let cypressQuery = 'cy';
  selector.forEach((selectorElement, index) => {
    cypressQuery += getCypressQueryFromSelectorElement(selectorElement, index);
  });
  return cypressQuery;
}

/**
 * Get the cypress query for the given selector element
 * @param selectorElement SelectorElement to get the cypress query for
 * @param index index of the selector element in the selector
 * @returns cypress query for the selector element
 */
function getCypressQueryFromSelectorElement(selectorElement: SelectorElement, index: number) {
  const functionName = index === 0 ? 'get' : 'find';
  let nthChild = '';
  switch (selectorElement.type) {
    case SelectorElementType.REACT_COMPONENT:
      nthChild = selectorElement.nthChild ? `.nthNode(${selectorElement.nthChild})` : '';
      return `.react('${selectorElement.value}')${nthChild}`;
    case SelectorElementType.ID:
      return `.${functionName}('#${selectorElement.value}')`;
    case SelectorElementType.CLASS:
      nthChild = selectorElement.nthChild ? `:nth-child(${selectorElement.nthChild})` : '';
      return `.${functionName}('.${selectorElement.value}${nthChild}')`;
    case SelectorElementType.TAG:
      nthChild = selectorElement.nthChild ? `:nth-child(${selectorElement.nthChild})` : '';
      return `.${functionName}('${selectorElement.value}${nthChild})'`;
    default:
      return '';
  }
}
