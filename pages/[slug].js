import { useEffect } from 'react';
import matter from 'gray-matter';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/layout';
import fs from 'fs';
import path from 'path';

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

export async function getStaticPaths() {
  console.log(fs.readdirSync(__dirname));
  const posts = fs.readdirSync(
    '/Users/jamesbedont/Documents/personal-website/posts'
  );

  // Get the paths we want to pre-render based on posts
  const paths = posts.map(post => {
    const titleAsFileName = post.replace(/\.md/g, '');
    return `/${titleAsFileName}`;
  });

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const titleAsFileName = params.slug;

  const post = fs.readFileSync(
    `/Users/jamesbedont/Documents/personal-website/posts/${titleAsFileName}.md`,
    { encoding: 'utf8' }
  );
  const { content, data: frontMatter } = matter(post);

  const date = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(frontMatter.date));

  return {
    props: {
      postMarkdown: content,
      title: frontMatter.title,
      description: frontMatter.description,
      date
    }
  };
}

export default PostPage;
