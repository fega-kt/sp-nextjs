import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';

const MyDocument = () => (
  <Html lang="vi" suppressHydrationWarning>
    <Head>
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    </Head>
    <body>
      {/* Set dark class before React hydrates to prevent Tailwind flash */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme:dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}})()`,
        }}
      />
      <Main />
      <NextScript />
    </body>
  </Html>
);

// antd generates its CSS in JS at runtime — collect it during SSR and inline it in <head>,
// otherwise the first paint shows unstyled antd components until JS loads.
// Removed again in _app once the client has injected its own styles.
MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const cache = createCache();
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => (
        <StyleProvider cache={cache}>
          <App {...props} />
        </StyleProvider>
      ),
    });

  const initialProps = await Document.getInitialProps(ctx);
  // Strip the cache-path marker: with it the client treats these styles as already present
  // and skips injecting them, so they'd vanish once _app removes this tag
  const style = extractStyle(cache, true).replace(/\.data-ant-cssinjs-cache-path\{[^}]*\}/, '');
  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        <style data-antd-ssr dangerouslySetInnerHTML={{ __html: style }} />
      </>
    ),
  };
};

export default MyDocument;
