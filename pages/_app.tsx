import type { AppProps } from 'next/app';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { ThemeProvider, useTheme } from '@/contexts/theme';
import '@/styles/globals.css';
import { ReactNode, useEffect } from 'react';
import { Toaster } from 'sonner';

function AntdProvider({ children }: { children: ReactNode }) {
  const { dark } = useTheme();
  return (
    <ConfigProvider
        theme={{
          algorithm: dark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: '#6366f1',
            borderRadius: 8,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            ...(dark ? {
              colorBgContainer: '#0f1117',
              colorBgElevated: '#1a1d27',
              colorBorder: '#2d3148',
              colorText: 'rgba(255,255,255,0.85)',
              colorTextPlaceholder: 'rgba(255,255,255,0.3)',
            } : {}),
          },
        }}
      >
        {children}
        <Toaster theme={dark ? 'dark' : 'light'} position="top-right" richColors closeButton />
      </ConfigProvider>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // SSR antd CSS (see _document) only covers the first paint and is always light theme.
    // It sits later in <head> than the client's styles, so it would override the dark
    // theme's CSS variables — drop it now that the client has injected its own.
    document.querySelectorAll('style[data-antd-ssr]').forEach((el) => el.remove());
  }, []);

  return (
    <ThemeProvider>
      <AntdProvider>
        <Component {...pageProps} />
      </AntdProvider>
    </ThemeProvider>
  );
}
