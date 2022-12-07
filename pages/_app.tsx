import React from 'react';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import createCache from '@emotion/cache';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { UserProvider } from '../context/UserContext';
import createMuiTheme, { THEME } from '../theme/createTheme';

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
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={createMuiTheme(THEME)}>
        <CssBaseline />
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
