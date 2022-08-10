import React, { FC, useContext, useState } from 'react';
import { isSelectorMessage } from '../../../types/message';
import { Selector } from '../../../types/selector';

export type SelectorContext = {
  selector: Selector[] | null;
};

export const SelectorContext = React.createContext<SelectorContext>({
  selector: null,
});

export function useSelectorContext() {
  return useContext(SelectorContext);
}

export type SelectorContextProviderProps = {
  children: React.ReactNode;
};

export const SelectorContextProvider: FC<SelectorContextProviderProps> = (props) => {
  const [selector, setSelector] = useState<Selector[]>([]);

  const devtoolsConnection = chrome.runtime.connect({ name: 'panel' });

  devtoolsConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId,
  });

  devtoolsConnection.onMessage.addListener((message) => {
    if (isSelectorMessage(message)) {
      setSelector(message.selector);
    }
  });

  return <SelectorContext.Provider value={{ selector }}>{props.children}</SelectorContext.Provider>;
};
