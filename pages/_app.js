import 'normalize.css';
import 'styles.css';
import Prism from 'prismjs';

const MyApp = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export const config = { unstable_runtimeJS: false}

export default MyApp;
