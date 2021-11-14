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
        <div className='my-8'>
          <h1 className='text-4xl font-medium dark:text-gray-300'>{title}</h1>
          <p className='text-lg text-gray-500 dark:text-gray-500'>{date}</p>
        </div>

        <ReactMarkdown
          className='prose max-w-none prose-blue prose-lg dark:prose-dark'
          children={content}
          components={{
            a: (props) => (
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
