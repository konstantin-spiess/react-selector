import React, { FC } from 'react';
import { Selector } from '../../../../../types/selector';
import { getCypressQuery } from '../../../../../utils/selector';
import ClipboardCopyButton from '../ClipboardCopyButton/ClipboardCopyButton';
import SelectorElement from '../SelectorElement/SelectorElement';
import s from './SelectorRow.module.scss';

export type SelectorRowProps = {
  selector: Selector;
};

const SelectorRow: FC<SelectorRowProps> = ({ selector }) => {
  return (
    <div className={s.wrapper}>
      <div className={s.copy}>
        <ClipboardCopyButton value={getCypressQuery(selector)} />
      </div>
      <div className={s.elements}>
        {selector.map((element) => {
          return <SelectorElement element={element} />;
        })}
      </div>
    </div>
  );
};

export default SelectorRow;
