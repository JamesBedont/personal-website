import matter from 'gray-matter';
import Post from '../components/post';
import PropTypes from 'prop-types';
import Layout from '../components/layout';
import fs from 'fs';
import path from 'path';

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
      link: PropTypes.string.isRequired
    })
  ).isRequired
};

export async function getStaticProps() {
  const posts = fs
    .readdirSync(path.join(process.cwd(), 'posts'))
    .map(postFileName => {
      const fileContents = fs.readFileSync(
        path.join(process.cwd(), 'posts', `${postFileName}`),
        { encoding: 'utf8' }
      );
      const { data: frontMatter } = matter(fileContents);

      const date = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }).format(new Date(frontMatter.date));

      const link = frontMatter.title.toLowerCase().replace(/\s/g, '-');

      return {
        title: frontMatter.title,
        link,
        date
      };
    });

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    props: {
      posts
    }
  };
}

export default HomePage;
