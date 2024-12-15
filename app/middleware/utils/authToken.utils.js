import jwt from 'jsonwebtoken';
import { apiKeysStore } from './apiKey.utils.js'; // Import your apiKeysStore or replace with actual path

export const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    // Use the first API key from the in-memory store as the JWT secret
    const validApiKeys = Array.from(apiKeysStore); // Convert Set to an array
    const secretKey = validApiKeys[0]; // Replace with DB lookup logic if required

    if (!secretKey) {
        return res.status(500).json({ error: 'No API secret key configured' });
    }

    try {
        // Verify the token with the retrieved secret key
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Attach decoded token to request object
        next(); // Proceed to the next middleware or route
    } catch (err) {
        // Handle specific JWT errors for better debugging
        if (err.name === 'TokenExpiredError') {
            res.status(401).json({ error: 'Token has expired' });
        } else if (err.name === 'JsonWebTokenError') {
            res.status(403).json({ error: 'Invalid token' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};