import './App.scss';
import AppContent from './components/organisms/AppContent';
import { SelectorContextProvider } from './contexts/SelectorContext';

function App() {
  return (
    <SelectorContextProvider>
      <AppContent />
    </SelectorContextProvider>
  );
}

export default App;
