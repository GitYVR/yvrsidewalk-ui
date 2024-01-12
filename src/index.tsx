import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AboutPage from './pages/About';
import HistoryPage from './pages/History';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WagmiConfig, createClient, chain } from 'wagmi';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';

import { SnackbarProvider } from 'notistack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { blue } from '@mui/material/colors';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CacheProvider from './components/CacheProvider';

const client = createClient(
  getDefaultClient({
    appName: 'YVRSidewalk',
    //infuraId: process.env.REACT_APP_INFURA_ID,
    //alchemyId:  process.env.REACT_APP_ALCHEMY_ID,
    chains: [chain.polygon],
  }),
);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: blue,
  },
  typography: {
    fontFamily: ['roboto'].join(','),
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <CacheProvider>
      <BrowserRouter>
        <ThemeProvider theme={darkTheme}>
          <SnackbarProvider>
            <WagmiConfig client={client}>
              <ConnectKitProvider theme="auto">
                <CssBaseline />
                <Routes>
                  <Route path="/" element={<App />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                </Routes>
              </ConnectKitProvider>
            </WagmiConfig>
          </SnackbarProvider>
        </ThemeProvider>
      </BrowserRouter>
    </CacheProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
