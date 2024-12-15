import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
dotenv.config();

export const generateApiKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFilePath = path.resolve(__dirname, '../../../.env');

export const storeApiKeyInEnv = (apiKey) => {
    const envConfig = dotenv.parse(fs.readFileSync(envFilePath));
    envConfig['API_KEY'] = apiKey;
    const newEnvContent = Object.entries(envConfig)
        .map(([key, value]) => `${key}="${value}"`)
        .join('\n');
    fs.writeFileSync(envFilePath, newEnvContent);
};

export const authenticateApiKey = (req, res, next) => {
    const apiKey = req.header('x-api-key');
    const validApiKey = process.env.API_KEY;
    if (apiKey && apiKey === validApiKey) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

export const authenticateApiKeyAdv = (req, res, next) => {
    const apiKey = req.header('x-api-key');
    const validApiKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];
    if (apiKey && validApiKeys.includes(apiKey)) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

export const generateApiKeyAdv = (username, projectName) => {
    const dateTime = new Date().toISOString();
    const rawKey = `${username}:${projectName}:${dateTime}`;
    return crypto.createHash('sha256').update(rawKey).digest('hex');
};
  


export const storeApiKeyInEnvAdv = (apiKey) => {
    let currentKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];
    currentKeys.push(apiKey);
    const updatedKeys = currentKeys.join(',');
    fs.writeFileSync('.env', `API_KEYS="${updatedKeys}"`);
};