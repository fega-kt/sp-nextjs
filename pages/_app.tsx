import type { AppProps } from 'next/app';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { ThemeProvider, useTheme } from '@/contexts/theme';
import '@/styles/globals.css';
import { ReactNode } from 'react';

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
      </ConfigProvider>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <AntdProvider>
        <Component {...pageProps} />
      </AntdProvider>
    </ThemeProvider>
  );
}
