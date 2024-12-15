import express from 'express';
import { generateApiKey, storeApiKeyInEnv } from '../../middleware/utils/apiKey.utils.js';
var generateKey = express.Router();
generateKey.post('/auth/generate-api-key', function (req, res) {
  var _req$body = req.body,
    username = _req$body.username,
    projectName = _req$body.projectName;
  if (!username || !projectName) {
    return res.status(400).json({
      error: 'Username and project name are required'
    });
  }
  var apiKey = generateApiKey(username, projectName);
  storeApiKeyInEnv(apiKey);
  res.json({
    apiKey: apiKey
  });
});
export default generateKey;