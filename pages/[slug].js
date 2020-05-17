import { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import Layout from 'components/layout';
import { getPostBySlug, getAllPosts } from 'lib/pageService';

const PostPage = ({ content, title, date, description }) => {
  useEffect(() => {
    window.Prism.highlightAll();
  }, []);

  return (
    <Layout title={title} description={description}>
      <article>
        <h1>{title}</h1>
        <p className='post-date'>{date}</p>
        <ReactMarkdown
          source={content}
          renderers={{
            link: (props) => (
              <a href={props.href} rel='noopener'>
                {props.children}
              </a>
            ),
          }}
        />
      </article>
    </Layout>
  );
};

PostPage.propTypes = {
  content: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export async function getStaticPaths() {
  const posts = getAllPosts().map((post) => {
    return `/${post.slug}`;
  });

  // { fallback: false } means other routes should 404.
  return { paths: posts, fallback: false };
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);

  return {
    props: {
      ...post,
    },
  };
}

export default PostPage;
