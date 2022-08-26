export type SelectorPart = {
  type: SelectorPartType;
  value: string;
  nthChild: number;
  nthChildNecessary: boolean;
};

export enum SelectorPartType {
  ID = 'Id',
  CLASS = 'Class',
  TAG = 'Tag',
  REACT_COMPONENT = 'Component',
}

export type Selector = SelectorPart[];
