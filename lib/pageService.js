const matter = require('gray-matter');
const fs = require('fs');
const path = require('path');
const marked = require('marked');

/**
 * @typedef {Object} Post
 * @property {string} title - The title of the post "this is a title"
 * @property {string} description - Description of the post
 * @property {string} content - Markdown content of the post
 * @property {string} contentHTML - The content in HTML form
 * @property {string} slug - Post title in url format: "this-is-a-title"
 * @property {string} date - Date the post was published: Month dd, yyyy
 */

/**
 * Find all the posts in the /posts directory
 *
 * @public
 * @return {Post[]}
 */
const getAllPosts = () => {
  const posts = fs
    .readdirSync(path.join(process.cwd(), 'posts'))
    .map((fileName) => getFileContent(fileName))
    .map((postFile) => processPostFile(postFile));

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return posts;
};

/**
 * Given the slug of post get the full post context
 *
 * @public
 * @param {string} slug - The slug of the post title: "this-is-a-slug"
 * @return {Post[]}
 */
const getPostBySlug = (slug) => {
  const postFile = getFileContent(null, slug);
  return processPostFile(postFile);
};

/**
 * Given a post identifier get the content of the file.
 * Only one of the two params is required at any given call.
 *
 * @private
 * @param {string} fileName - The filename of the post like "title.md"
 * @param {string} slug - The slug of the post like "this-is-a-slug"
 * @returns {string}
 */
const getFileContent = (fileName, slug) => {
  fileName = fileName ? fileName : `${slug}.md`;
  return fs.readFileSync(path.join(process.cwd(), 'posts', fileName), {
    encoding: 'utf8',
  });
};

/**
 * Process the file contents of a post into a properly formed Post object
 *
 * @private
 * @param {string} postFileContent The file contents of a post
 * @returns {Post}
 */
const processPostFile = (postFileContent) => {
  const { content, data: frontMatter } = matter(postFileContent);

  const date = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(frontMatter.date));

  const slug = frontMatter.title.toLowerCase().replace(/\s/g, '-');

  return {
    title: frontMatter.title,
    description: frontMatter.description,
    content,
    contentHTML: marked.parse(content),
    slug,
    date,
  };
};

module.exports = { getAllPosts, getPostBySlug };
