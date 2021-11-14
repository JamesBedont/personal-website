import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang='en'>
        <Head />
        <body className='h-full'>
          <Main />
          <NextScript />
          <style jsx global>{`
            html {
              height: 100%;
            }
            #__next {
              height: 100%;
              display: flex;
              flex-direction: column;
            }
          `}</style>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
