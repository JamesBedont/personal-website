const fs = require('fs');
const path = require('path');
const { Feed } = require('feed');
const { getAllPosts } = require('./lib/pageService');

const author = { name: 'James Bedont', link: 'https://jamesbedont.com' };

const feed = new Feed({
  title: "James Bedont's Writing",
  description: 'Feed of all the articles written on jamesbedont.com',
  id: 'https://jamesbedont.com/',
  link: 'https://jamesbedont.com/',
  language: 'en',
  image: 'https://jamesbedont.com/headshot.webp',
  favicon: 'https://jamesbedont.com/favicon.webp',
  copyright: `All rights reserved ${new Date().getFullYear()}, James Bedont`,
  author,
});

feed.addCategory('Software Development');

getAllPosts().map((post) => {
  const postUrl = `https://jamesbedont.com/${post.slug}`;

  feed.addItem({
    title: post.title,
    description: post.description,
    link: postUrl,
    content: post.contentHTML,
    author: [author],
    published: new Date(post.date),
    date: new Date(post.date),
  });
});

fs.writeFileSync(path.join(__dirname, 'public', 'feed.json'), feed.json1());
fs.writeFileSync(path.join(__dirname, 'public', 'feed.xml'), feed.atom1());
