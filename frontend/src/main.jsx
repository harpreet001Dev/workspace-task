import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import SocketProvider from './sockets/SocketProvider.jsx';
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </SocketProvider>

    </Provider>
  </StrictMode>,
)
