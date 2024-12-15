import express from 'express'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Users from '../../model/Users';

dotenv.config();

const login = express.Router();

login.route('/auth/login').post(async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(200).json({ error: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ email: user.email, role: user.role }, process.env.API_KEY, { expiresIn: '100000h' });

            return res.status(201).json({ message: 'Login successful', token });
        } else {
            return res.status(200).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Error during login');
        return res.status(500).json({ error: 'Internal server error' });
    }
});



export default login;