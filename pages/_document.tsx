import Document, { Head, Html, Main, NextScript } from 'next/document';

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

export default MyDocument;
