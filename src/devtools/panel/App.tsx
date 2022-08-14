import { Slide, ToastContainer } from 'react-toastify';
import './App.scss';
import AppContent from './components/organisms/AppContent';
import { SelectorContextProvider } from './contexts/SelectorContext';

function App() {
  return (
    <SelectorContextProvider>
      <AppContent />
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar
        closeOnClick
        transition={Slide}
        closeButton={false}
      />
    </SelectorContextProvider>
  );
}

export default App;
