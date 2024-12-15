import express from 'express'
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Users from '../../model/Users';

dotenv.config();

const signup = express.Router();

signup.route('/auth/signup').post(async (req, res) => {
    const { email, password, role } = req.body;

    if (!email) {
        return res.status(200).json({ error: 'Email is required' });
    }
    if (!password) {
        return res.status(200).json({ error: 'Password is required' });
    }
    if (!role) {
        return res.status(200).json({ error: 'Role is required' });
    }

    try {
        const existingUser = await Users.findOne({ email });

        if (existingUser) {
            return res.status(200).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Users({
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error during signup');

        if (err.code === 11000) {
            return res.status(200).json({ error: 'Email already in use' });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
});

export default signup;
