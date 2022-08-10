import './App.scss';
import { isSelectorMessage } from '../../types/message';
import { useState } from 'react';
import { Selector } from '../../types/selector';

function App() {
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

  return (
    <div className="App">
      <p>Selector:</p>
      <p>{JSON.stringify(selector)}</p>
    </div>
  );
}

export default App;
