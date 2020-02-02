import { Feed } from 'feed';
import matter from 'gray-matter';
import * as fs from 'fs';
import * as path from 'path';
import * as marked from 'marked';
import * as process from 'process';

// https://github.com/prisma/prisma2/issues/1021#issuecomment-568511284
const getPath = pathName => path.join(process.cwd(), pathName);

export default (req, res) => {
  const feed = new Feed({
    title: "James Bedont's Writing",
    description: 'Feed of all the articles written on jamesbedont.com',
    id: 'https://jamesbedont.com/',
    link: 'https://jamesbedont.com/',
    language: 'en',
    image: 'https://jamesbedont.com/headshot.jpeg',
    favicon: 'https://jamesbedont.com/favicon.png',
    copyright: `All rights reserved ${new Date().getFullYear()}, James Bedont`,
    feedLinks: {
      json: 'https://jamesbedont.com/json',
      atom: 'https://jamesbedont.com/atom'
    },
    author: {
      name: 'James Bedont',
      link: 'https://jamesbedont.com'
    }
  });

  feed.addCategory('Software Development');

  const posts = fs.readdirSync(getPath('posts'));
  posts.map(fileName => {
    const rawPostContent = fs.readFileSync(
      path.join(getPath('posts'), fileName),
      'utf8'
    );
    const { data: frontMatter, content } = matter(rawPostContent);
    let postContent = marked(content).replace(
      /<img src="/g,
      '<img src="https://jamesbedont.com/'
    );

    const postUrlSlug = frontMatter.title.toLowerCase().replace(/\s/g, '-');
    const postUrl = `https://jamesbedont.com/${postUrlSlug}`;

    feed.addItem({
      title: frontMatter.title,
      id: postUrl,
      link: postUrl,
      content: postContent,
      author: [
        {
          name: 'James Bedont',
          link: 'https://jamesbedont.com'
        }
      ],
      date: new Date(frontMatter.date)
    });
  });

  feed.items.sort((a, b) => b.date - a.date);

  res.send(feed.rss2());
};
