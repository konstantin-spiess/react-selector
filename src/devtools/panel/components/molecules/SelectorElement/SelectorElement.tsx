import React, { FC } from 'react';
import { SelectorElement as SelectorElementType } from '../../../../../types/selector';
import s from './SelectorElement.module.scss';
import Text from '../../atoms/Text/Text';
import Label from '../../atoms/Label/Label';

export type SelectorElementProps = {
  element: SelectorElementType;
};

const SelectorElement: FC<SelectorElementProps> = ({ element }) => {
  return (
    <div className={s.wrapper}>
      <div className={s.text}>
        <Text type="tertiary" value={element.type} />
        <Text type="secondary" value={element.value} />
      </div>
      {element.nthChild && (
        <div className={s.label}>
          <Label value={element.nthChild.toString()} />
        </div>
      )}
    </div>
  );
};

export default SelectorElement;
