import React, { FC, useContext, useState } from 'react';
import { isSelectorMessage } from '../../../types/message';
import { Selector } from '../../../types/selector';

export type SelectorContext = {
  selectors: Selector[] | null;
};

export const SelectorContext = React.createContext<SelectorContext>({
  selectors: null,
});

export function useSelectorContext() {
  return useContext(SelectorContext);
}

export type SelectorContextProviderProps = {
  children: React.ReactNode;
};

export const SelectorContextProvider: FC<SelectorContextProviderProps> = (props) => {
  const [selectors, setSelectors] = useState<Selector[]>([]);

  const devtoolsConnection = chrome.runtime.connect({ name: 'panel' });

  devtoolsConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId,
  });

  devtoolsConnection.onMessage.addListener((message) => {
    if (isSelectorMessage(message)) {
      setSelectors(message.selectors);
    }
  });

  return <SelectorContext.Provider value={{ selectors }}>{props.children}</SelectorContext.Provider>;
};
