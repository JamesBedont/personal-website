import Head from 'next/head';
import Header from '../components/header';
import Footer from '../components/footer';
import { Fragment } from 'react';

const Layout = ({ children, title = 'James Bedont' }) => {
  const script = {
    __html:
      "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'UA-58212740-2');"
  };

  return (
    <Fragment>
      <Head>
        <script
          async
          src='https://www.googletagmanager.com/gtag/js?id=UA-58212740-2'
        ></script>
        <script dangerouslySetInnerHTML={script}></script>
        <title>{title}</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <link rel='shortcut icon' type='image/x-icon' href='/favicon.png' />
      </Head>
      <Header />

      {children}

      <Footer />
    </Fragment>
  );
};

export default Layout;
