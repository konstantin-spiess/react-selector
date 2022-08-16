export type SelectorElement = {
  type: SelectorElementType;
  value: string;
  nthChild: number;
  nthChildNecessary: boolean;
};

export enum SelectorElementType {
  ID = 'Id',
  CLASS = 'Class',
  TAG = 'Tag',
  REACT_COMPONENT = 'Component',
}

export type Selector = SelectorElement[];
