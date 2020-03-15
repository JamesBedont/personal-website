const AWS = require('aws-sdk');
const util = require('util');

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.JBEDONT_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.JBEDONT_AWS_SECRET_ACCESS_KEY
});

module.exports = async (req, res) => {
  try {
    const docClient = new AWS.DynamoDB.DocumentClient();
    const scan = util.promisify(docClient.scan).bind(docClient);

    const podcasts = await scan({ TableName: 'Podcasts' });

    return res.json(podcasts);
  } catch (error) {
    return res.status(500).json({ message: error.toString() });
  }
};
