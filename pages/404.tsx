import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import styles from './404.module.css';

export default function NotFound() {
  useEffect(() => {
    let parallax: any = null;
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/parallax/3.1.0/parallax.min.js';
    script.async = true;
    script.onload = () => {
      const scene = document.getElementById('scene');
      if (scene && (window as any).Parallax) {
        parallax = new (window as any).Parallax(scene);
      }
    };
    document.body.appendChild(script);
    return () => {
      if (parallax) parallax.destroy();
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <Head>
        <title>404 — Page Not Found</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css?family=Barlow+Condensed:700,800,900|Barlow:400,500,600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div id="scene" className={styles.scene} data-hover-only="false">
            <div className={styles.circle} data-depth="1.2" />

            <div className={styles.one} data-depth="0.9">
              <div className={styles.content}>
                <span className={styles.piece} />
                <span className={styles.piece} />
                <span className={styles.piece} />
              </div>
            </div>

            <div className={styles.two} data-depth="0.60">
              <div className={styles.content}>
                <span className={styles.piece} />
                <span className={styles.piece} />
                <span className={styles.piece} />
              </div>
            </div>

            <div className={styles.three} data-depth="0.40">
              <div className={styles.content}>
                <span className={styles.piece} />
                <span className={styles.piece} />
                <span className={styles.piece} />
              </div>
            </div>

            <p className={styles.p404} data-depth="0.50">404</p>
            <p className={styles.p404} data-depth="0.10">404</p>
          </div>

          <div className={styles.text}>
            <article>
              <p>
                Uh oh! Looks like you got lost.<br />
                Go back to the homepage if you dare!
              </p>
              <Link href="/">
                <button>i dare!</button>
              </Link>
            </article>
          </div>
        </div>
      </div>
    </>
  );
}
