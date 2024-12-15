import express from 'express';
import { generateApiKey, storeApiKeyInEnv } from '../../middleware/utils/apiKey.utils.js';

const generateKey = express.Router();

generateKey.post('/auth/generate-api-key', (req, res) => {
    const { username, projectName } = req.body;
    if (!username || !projectName) {
        return res.status(400).json({ error: 'Username and project name are required' });
    }
    const apiKey = generateApiKey(username, projectName);
    storeApiKeyInEnv(apiKey);
    res.json({ apiKey });
});

export default generateKey;