import React, { FC } from 'react';
import { SelectorPart as SelectorPartType } from '../../../../../types/selector';
import s from './SelectorPart.module.scss';
import Text from '../../atoms/Text/Text';
import Label from '../../atoms/Label/Label';

export type SelectorPartProps = {
  element: SelectorPartType;
};

const SelectorPart: FC<SelectorPartProps> = ({ element }) => {
  return (
    <div className={s.wrapper}>
      <div className={s.text}>
        <Text type="tertiary" value={element.type} />
        <Text type="secondary" value={element.value} />
      </div>
      {element.nthChildNecessary && (
        <div className={s.label}>
          <Label value={element.nthChild.toString()} />
        </div>
      )}
    </div>
  );
};

export default SelectorPart;
