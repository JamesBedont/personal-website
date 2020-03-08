import UnderConstruction from '../components/underConstruction';
import Layout from '../components/layout';
import { useEffect } from 'react';

const AboutPage = () => {
  useEffect(() => {
    fetch('api/podcasts')
      .then(res => res.json())
      .then(podcasts => console.log(podcasts));
  }, []);

  return (
    <Layout title={'About'} description={'about James Bedont'}>
      <UnderConstruction />
    </Layout>
  );
};

export default AboutPage;
