const chrome = require('chrome-aws-lambda');
const fetch = require('node-fetch');
const MongoClient = require('mongodb').MongoClient;
const jwtDecode = require('jwt-decode');

module.exports = async (req, res) => {
  try {
    const connectionString = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-xpele.mongodb.net/test?retryWrites=true&w=majority`;
    const client = new MongoClient(connectionString, {
      useUnifiedTopology: true
    });
    await client.connect();
    const db = client.db('personal-website');

    const { shouldScrape, jwt } = await checkToken(db);

    if (!shouldScrape) {
      const podcasts = await getStarredPodcasts(jwt);
      await storePodcasts(db, podcasts);

      return res.json(podcasts);
    }

    const browserConfig = await getChromeLaunchConfig();
    const browser = await chrome.puppeteer.launch(browserConfig);
    const authToken = await getAuthToken(db, browser);
    const podcasts = await getStarredPodcasts(authToken);
    await storePodcasts(db, podcasts);

    res.json(podcasts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.toString() });
  }
};

const checkToken = async db => {
  try {
    const document = await db
      .collection('authToken')
      .find({})
      .toArray();

    const jwt = document[0].jwt;
    const now = (current_time = Date.now() / 1000);
    const decoded = jwtDecode(jwt);

    if (decoded.exp > now) {
      return {
        shouldScrape: false,
        jwt
      };
    }

    await db.collection('authToken').deleteMany({});

    return {
      shouldScrape: true,
      jwt: null
    };
  } catch (error) {
    console.log(error);
    return {
      shouldScrape: true,
      jwt: null
    };
  }
};

const storePodcasts = async (db, podcasts) => {
  await db.collection('podcasts').deleteMany({});
  return db.collection('podcasts').insertMany(podcasts);
};

const getStarredPodcasts = async authToken => {
  let { episodes } = await sendRequest(
    'POST',
    'https://api.pocketcasts.com/user/starred',
    null,
    authToken
  );
  const fullDataPromise = episodes.map(ep => {
    return sendRequest(
      'POST',
      'https://api.pocketcasts.com/user/episode',
      { uuid: ep.uuid },
      authToken
    ).then(({ podcastTitle, published, title }) => {
      return sendRequest(
        'POST',
        'https://api.pocketcasts.com/podcasts/share_link',
        {
          episode: ep.uuid,
          podcast: ep.podcastUuid
        },
        authToken
      ).then(({ url: shareLink }) => {
        return {
          episodeUuid: ep.uuid,
          podcastUuid: ep.podcastUuid,
          podcastTitle,
          episodeTitle: title,
          published,
          shareLink
        };
      });
    });
  });
  const enhancedData = await Promise.all(fullDataPromise);
  return enhancedData.reduce((podcasts, enhancedEp) => {
    const podcastUuid = enhancedEp.podcastUuid;
    const podcastIndex = podcasts.findIndex(pod => pod.uuid === podcastUuid);
    let podcast;

    if (podcastIndex === -1) {
      podcast = {
        uuid: podcastUuid,
        title: enhancedEp.podcastTitle,
        imageUrl: `https://static.pocketcasts.com/discover/images/webp/200/${podcastUuid}.webp`,
        episodes: []
      };
    } else {
      podcast = podcasts[podcastIndex];
    }

    podcast.episodes.push({
      uuid: enhancedEp.episodeUuid,
      published: enhancedEp.published,
      title: enhancedEp.episodeTitle,
      shareLink: enhancedEp.shareLink
    });

    if (podcastIndex === -1) {
      podcasts.push(podcast);
    } else {
      podcasts[podcastIndex] = podcast;
    }

    return podcasts;
  }, []);
};

const sendRequest = (method, url, body, authToken) => {
  return fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : null
  }).then(res => res.json());
};

const getChromeLaunchConfig = async () => {
  if (process.env.NODE_ENV !== 'production') {
    return {
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--single-process'
      ],
      headless: true
    };
  }

  return {
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless
  };
};

const getAuthToken = async (db, browser) => {
  const pocketCastsLoginPage = 'https://play.pocketcasts.com/user/login';

  const emailInputSelector = 'input[type=email]';
  const passwordInputSelector = 'input[type=password]';
  const submitBtnSelector = 'button[type=submit]';
  const authTokenStorageKey = 'token';

  const username = process.env.POCKETCASTS_EMAIL;
  const password = process.env.POCKETCASTS_PASSWORD;

  const page = await browser.newPage();

  await page.goto(pocketCastsLoginPage);
  await page.type(emailInputSelector, username);
  await page.type(passwordInputSelector, password);
  await page.click(submitBtnSelector);
  await page.waitForNavigation();

  const authToken = await page.evaluate(
    async authTokenStorageKey => localStorage.getItem(authTokenStorageKey),
    authTokenStorageKey
  );

  await browser.close();

  await db.collection('authToken').deleteMany({});
  await db.collection('authToken').insertOne({ jwt: authToken });

  return authToken;
};
