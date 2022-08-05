export type Selector = {
  type: SelectorType;
  value: string;
  nthChild?: number;
};

export enum SelectorType {
  ID = 'ID',
  CLASS = 'CLASS',
  TAG = 'TAG',
  REACT_ROOT = 'REACT_ROOT',
  REACT_COMPONENT = 'REACT_COMPONENT',
}
