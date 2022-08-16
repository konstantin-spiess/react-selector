import { ChevronRightIcon } from '@radix-ui/react-icons';
import { FC } from 'react';
import { Selector } from '../../../../../types/selector';
import { getCypressQueryFromSelector } from '../../../../../utils/cypress';
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
        <ClipboardCopyButton value={getCypressQueryFromSelector(selector)} />
      </div>
      <div className={s.elements}>
        {selector.map((element, index) => {
          const spacer = index == 0 ? null : <ChevronRightIcon />;

          return (
            <div className={s.element}>
              {spacer}
              <SelectorElement element={element} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectorRow;
