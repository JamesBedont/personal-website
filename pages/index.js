import { Fragment } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

const HomePage = () => {
  return (
    <Fragment>
      <Header />
      <div className='content'>
        <p>hello world</p>
      </div>
      <Footer />
    </Fragment>
  );
};

export default HomePage;
