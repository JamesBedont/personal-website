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
        <body className='line-numbers'>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
export const config = { unstable_runtimeJS: false}

export default MyDocument;
