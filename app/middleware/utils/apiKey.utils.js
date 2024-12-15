import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

// Simulate a database or in-memory store for storing API keys
const apiKeysStore = new Set(); // Replace with an actual database in production

// Generate a simple API Key
export const generateApiKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Store API Key in a secure storage (memory for now, replace with DB in production)
export const storeApiKeyInEnv = (apiKey) => {
    apiKeysStore.add(apiKey); // Simulate storage, replace with DB logic
    console.log(`API Key stored: ${apiKey}`);
};

// Middleware to authenticate a single API key
export const authenticateApiKey = (req, res, next) => {
    const apiKey = req.header('x-api-key');
    const validApiKey = process.env.API_KEY; // Use static API key from environment
    if (apiKey && apiKey === validApiKey) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Middleware to authenticate multiple API keys
export const authenticateApiKeyAdv = (req, res, next) => {
    const apiKey = req.header('x-api-key');
    const validApiKeys = Array.from(apiKeysStore); // Get keys from in-memory store
    if (apiKey && validApiKeys.includes(apiKey)) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Generate an advanced API Key with username, project, and timestamp
export const generateApiKeyAdv = (username, projectName) => {
    const dateTime = new Date().toISOString();
    const rawKey = `${username}:${projectName}:${dateTime}`;
    return crypto.createHash('sha256').update(rawKey).digest('hex');
};

// Store an advanced API Key in a secure storage (memory for now, replace with DB)
export const storeApiKeyInEnvAdv = (apiKey) => {
    apiKeysStore.add(apiKey); // Simulate storage, replace with DB logic
    console.log(`Advanced API Key stored: ${apiKey}`);
};