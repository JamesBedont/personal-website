import 'normalize.css';
import '../styles.css';
import { Fragment } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <Header />
      <div className='content'>
        <Component {...pageProps} />
      </div>
      <Footer />
    </Fragment>
  );
}
