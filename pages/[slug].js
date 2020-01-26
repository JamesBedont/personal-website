import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';

const PostPage = ({ postMarkdown, title, date }) => {
  return (
    <article>
      <h1>{title}</h1>
      <p>{date}</p>
      <ReactMarkdown escapeHtml={false}>{postMarkdown}</ReactMarkdown>
    </article>
  );
};

PostPage.propTypes = {
  postMarkdown: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired
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
    date
  };
};

export default PostPage;
