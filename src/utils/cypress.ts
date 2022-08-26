import { Selector, SelectorPart, SelectorPartType } from '../types/selector';

/**
 * Get the cypress query for the given selector
 * @param selector Selector to get the cypress query for
 * @returns cypress query for the selector
 */
export function getCypressQueryFromSelector(selector: Selector) {
  let cypressQuery = 'cy';
  selector.forEach((selectorPart, index) => {
    cypressQuery += getCypressQueryFromSelectorPart(selectorPart, index);
  });
  return cypressQuery;
}

/**
 * Get the cypress query for the given selector element
 * @param selectorPart SelectorPart to get the cypress query for
 * @param index index of the selector element in the selector
 * @returns cypress query for the selector element
 */
function getCypressQueryFromSelectorPart(selectorPart: SelectorPart, index: number) {
  const functionName = index === 0 ? 'get' : 'find';
  let nthChild = '';
  switch (selectorPart.type) {
    case SelectorPartType.REACT_COMPONENT:
      nthChild = selectorPart.nthChildNecessary ? `.eq(${selectorPart.nthChild - 1})` : '';
      return `.react('${selectorPart.value}')${nthChild}`;
    case SelectorPartType.ID:
      nthChild = selectorPart.nthChildNecessary ? `:nth-child(${selectorPart.nthChild})` : '';
      return `.${functionName}('#${selectorPart.value}')`;
    case SelectorPartType.CLASS:
      nthChild = selectorPart.nthChildNecessary ? `:nth-child(${selectorPart.nthChild})` : '';
      return `.${functionName}('[class*=${selectorPart.value}]${nthChild}')`;
    case SelectorPartType.TAG:
      nthChild = selectorPart.nthChildNecessary ? `:nth-child(${selectorPart.nthChild})` : '';
      return `.${functionName}('${selectorPart.value}${nthChild}')`;
    default:
      return '';
  }
}
