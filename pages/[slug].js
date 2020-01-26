import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';

const PostPage = ({ postMarkdown }) => <ReactMarkdown source={postMarkdown} />;

PostPage.propTypes = {
  postMarkdown: PropTypes.string.isRequired
};

PostPage.getInitialProps = async context => {
  const titleAsFilePath = context.query.slug;
  return (context => {
    const postRelFilePaths = context.keys();
    const currentPostFilePath = postRelFilePaths.filter(postRelFilePath =>
      new RegExp(`${titleAsFilePath}\.md`).test(postRelFilePath)
    )[0];
    const { default: fileContents } = context(currentPostFilePath);
    const { content } = matter(fileContents);
    return {
      postMarkdown: content
    };
  })(
    // the regular expression passed into the context function must be statically analyzable.
    // therefore I cannot pass in dynamic RegExp with the post title. I must get all post then filter to the one I want :(
    require.context('../posts', true, /\.md$/)
  );
};

export default PostPage;
