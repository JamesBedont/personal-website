import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    const script = {
      __html:
        "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'UA-58212740-2');"
    };
    return (
      <Html>
        <Head>
          <script
            async
            src='https://www.googletagmanager.com/gtag/js?id=UA-58212740-2'
          ></script>
          <script dangerouslySetInnerHTML={script}></script>

          <link rel='shortcut icon' type='image/x-icon' href='/favicon.png' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
