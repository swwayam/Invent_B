import express from 'express'
const protectedR = express.Router();
import { authenticateApiKey } from '../../middleware/utils/apiKey.utils.js';
import { authenticateToken } from '../../middleware/utils/authToken.utils.js';

protectedR.route('/auth/protected').get(authenticateApiKey, authenticateToken, (req, res) => {
    res.json({ message: 'You have access to this protected data!', user: req.user });
});

export default protectedR;