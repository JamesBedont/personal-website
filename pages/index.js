import Post from 'components/post';
import PropTypes from 'prop-types';
import Layout from 'components/layout';
import { getAllPosts } from 'lib/pageService';

const HomePage = ({ posts }) => {
  const postElements = posts.map((post, idx) => <Post key={idx} {...post} />);
  return (
    <Layout title='Writing' description={"James Bedont's writings"}>
      {postElements}
    </Layout>
  );
};

HomePage.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export function getStaticProps() {
  return {
    props: {
      posts: getAllPosts(),
    },
  };
}

export default HomePage;
