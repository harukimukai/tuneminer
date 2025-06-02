import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './tailwind.css'
import '../src/css/customAudioPlayer.css'
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { store } from './app/store';
import { Provider } from 'react-redux';

// App.js または index.js の一番最初に入れる
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.name === 'AbortError') {
    console.warn('[Global] Caught AbortError:', event.reason.message)
    event.preventDefault() // ブラウザに出さないようにする
  }
})


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode className='overall'>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
