import React from 'react';
import { useSelectorContext } from '../../contexts/SelectorContext';

const AppContent = () => {
  const { selectors } = useSelectorContext();
  return (
    <div>
      Selector:
      <p>{JSON.stringify(selectors)}</p>
    </div>
  );
};

export default AppContent;
