import React, { FC } from 'react';
import { SelectorElement as SelectorElementType } from '../../../../../types/selector';
import s from './SelectorElement.module.scss';
import Text from '../../atoms/Text';

export type SelectorElementProps = {
  element: SelectorElementType;
};

const SelectorElement: FC<SelectorElementProps> = ({ element }) => {
  return (
    <div className={s.wrapper}>
      <Text type="tertiary" value={element.type} />
      <Text type="secondary" value={element.value} />
    </div>
  );
};

export default SelectorElement;
