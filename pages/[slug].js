import { useEffect } from 'react';
import matter from 'gray-matter';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/layout';

const PostPage = ({ postMarkdown, title, date, description }) => {
  useEffect(() => {
    window.Prism.highlightAll();
  }, []);

  return (
    <Layout title={title} description={description}>
      <article>
        <h1>{title}</h1>
        <p className='post-date'>{date}</p>
        <ReactMarkdown
          source={postMarkdown}
          renderers={{
            link: props => (
              <a href={props.href} rel='noopener'>
                {props.children}
              </a>
            )
          }}
        />
      </article>
    </Layout>
  );
};

PostPage.propTypes = {
  postMarkdown: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

PostPage.getInitialProps = async context => {
  const titleAsFileName = context.query.slug;

  const post = await import(`../posts/${titleAsFileName}.md`);
  const { content, data: frontMatter } = matter(post.default);

  const date = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(frontMatter.date));

  return {
    postMarkdown: content,
    title: frontMatter.title,
    description: frontMatter.description,
    date
  };
};

export default PostPage;
