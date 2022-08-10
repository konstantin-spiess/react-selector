import React from 'react';
import { useSelectorContext } from '../../contexts/SelectorContext';
import SelectorRow from '../molecules/SelectorRow/SelectorRow';

const AppContent = () => {
  const { selectors } = useSelectorContext();
  return (
    <div>
      {selectors?.map((selector) => {
        return <SelectorRow selector={selector} />;
      })}
    </div>
  );
};

export default AppContent;
