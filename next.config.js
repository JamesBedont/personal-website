const fs = require('fs');
const path = require('path');

module.exports = {
  webpack: function(config) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader'
    });
    return config;
  },
  exportPathMap: async function(
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    const posts = fs.readdirSync(path.join(__dirname, 'posts'));

    const postConfiguration = posts.reduce((config, postFileName) => {
      const titleAsFileName = postFileName.replace(/\.md/g, '');
      return {
        ...config,
        [`/${titleAsFileName}`]: {
          page: '/[slug]',
          query: { slug: titleAsFileName }
        }
      };
    }, {});

    return {
      ...postConfiguration,
      '/': { page: '/' }
    };
  }
};
