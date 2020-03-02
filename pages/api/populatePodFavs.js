const chrome = require('chrome-aws-lambda');

const pocketCastsLoginPage = 'https://play.pocketcasts.com/user/login';

const emailInputSelector = 'input[type=email]';
const passwordInputSelector = 'input[type=password]';
const submitBtnSelector = 'button[type=submit]';
const authTokenStorageKey = 'token';

const username = process.env.POCKETCASTS_EMAIL;
const password = process.env.POCKETCASTS_PASSWORD;

module.exports = async (req, res) => {
  const browser = await chrome.puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless
  });

  const page = await browser.newPage();

  await page.goto(pocketCastsLoginPage);
  await page.type(emailInputSelector, username);
  await page.type(passwordInputSelector, password);
  await page.click(submitBtnSelector);
  await page.waitForNavigation();

  const enhancedEpisodes = await page.evaluate(async authTokenStorageKey => {
    const authToken = localStorage.getItem(authTokenStorageKey);

    const res = await Promise.all([
      fetch('https://api.pocketcasts.com/user/starred', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then(res => res.json()),
      fetch('https://api.pocketcasts.com/user/podcast/list', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: {
          v: 1
        }
      }).then(res => res.json())
    ]);

    const [{ episodes }, { podcasts }] = res;
    const enhancedEpisodes = await Promise.all(
      episodes.map(async ep => {
        const podcast = podcasts.find(pod => pod.uuid === ep.podcastUuid);

        const { url: shareLink } = await fetch(
          'https://api.pocketcasts.com/podcasts/share_link',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify({
              episode: ep.uuid,
              podcast: ep.podcastUuid
            })
          }
        ).then(res => res.json());

        let enhancedEpisode = {
          uuid: ep.uuid,
          published: ep.published,
          title: ep.title,
          podcastUuid: ep.podcastUuid,
          shareLink,
          imageUrl: `https://static.pocketcasts.com/discover/images/webp/200/${ep.podcastUuid}.webp`
        };

        if (podcast) {
          enhancedEpisode = Object.assign(enhancedEpisode, {
            podcastTitle: podcast.title,
            podcastAuthor: podcast.author,
            podcastUrl: podcast.url
          });
        }

        return enhancedEpisode;
      })
    );
    return enhancedEpisodes;
  }, authTokenStorageKey);

  await browser.close();
  res.send(JSON.stringify(enhancedEpisodes, null, 2));
};
