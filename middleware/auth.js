require('dotenv').config();
module.exports = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const allowedApiKey = process.env.ALLOWED_API_KEY; //['my-secret-key',]
  if (apiKey === allowedApiKey) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
  }
};
