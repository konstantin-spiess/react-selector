export type SelectorElement = {
  type: SelectorElementType;
  value: string;
  nthChild?: number;
};

export enum SelectorElementType {
  ID = 'ID',
  CLASS = 'CLASS',
  TAG = 'TAG',
  REACT_ROOT = 'REACT_ROOT',
  REACT_COMPONENT = 'REACT_COMPONENT',
}

export type Selector = SelectorElement[];
