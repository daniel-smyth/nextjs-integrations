import React from 'react';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createCache from '@emotion/cache';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { UserProvider } from '../context/UserContext';
import createMuiTheme, { THEME } from '../theme/createTheme';
import { store } from '../redux/store';
import { fetchUser } from '../redux/slices/userSlice';

const clientSideEmotionCache = createCache({ key: 'css', prepend: true });

type MyAppProps<P = {}> = AppProps<P> & {
  emotionCache: EmotionCache;
  Component: NextPage;
};

function MyApp({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps
}: MyAppProps) {
  store.dispatch(fetchUser());

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={createMuiTheme(THEME)}>
          <CssBaseline />
          <UserProvider>
            <Component {...pageProps} />
          </UserProvider>
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  );
}

export default MyApp;
