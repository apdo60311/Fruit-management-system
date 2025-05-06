import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter } from 'react-router-dom';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import createCache from '@emotion/cache';

import App from './App';
import { createAppTheme, createRtlCache } from './theme';
import useSettingsStore from './stores/settingsStore';
import './i18n';
import './index.css';

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// Create ltr cache
const cacheLtr = createCache({
  key: 'muiltr',
});

function Root() {
  const { direction } = useSettingsStore();
  const theme = createAppTheme(direction);
  const cache = direction === 'rtl' ? cacheRtl : cacheLtr;

  return (
    <StrictMode>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider maxSnack={3}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </SnackbarProvider>
        </ThemeProvider>
      </CacheProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);