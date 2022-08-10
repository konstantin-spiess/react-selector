import React from 'react';
import { useSelectorContext } from '../../contexts/SelectorContext';

const AppContent = () => {
  const { selector } = useSelectorContext();
  return (
    <div>
      Selector:
      <p>{JSON.stringify(selector)}</p>
    </div>
  );
};

export default AppContent;
