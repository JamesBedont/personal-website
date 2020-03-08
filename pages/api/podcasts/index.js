const MongoClient = require('mongodb').MongoClient;

module.exports = async (req, res) => {
  try {
    const connectionString = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-xpele.mongodb.net/test?retryWrites=true&w=majority`;
    const client = new MongoClient(connectionString, {
      useUnifiedTopology: true
    });

    await client.connect();
    const db = client.db('personal-website');
    const podcasts = await db
      .collection('podcasts')
      .find({})
      .toArray();

    res.json(podcasts);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};
