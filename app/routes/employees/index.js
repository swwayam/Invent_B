import express from 'express'
import bcrypt from 'bcrypt';
import { authenticateApiKey } from '../../middleware/utils/apiKey.utils';
import { authenticateToken } from '../../middleware/utils/authToken.utils';
import Users from '../../model/Users';
const employees = express.Router();

employees.post("/employees", authenticateApiKey, authenticateToken, async (req, res) => {
  const { email, name, password, gender, role, status } = req.body;
  try {
    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Users({
      email,
      name,
      password: hashedPassword,
      gender,
      role,
      status,
    });

    await newUser.save();

    res.status(201).json({ message: 'Employee added successfully' });
  } catch (err) {
    console.error('Error during adding employee:', err);

    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

employees.route("/employees/me").post(authenticateApiKey, authenticateToken, async(req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await Users.findOne({ email });
    res.json(existingUser);
  } catch (error) {
    res.status(500).send("Error fetching user data: " + error.message);
  }
});
  
employees.route("/employees").get(authenticateApiKey, authenticateToken, async(req, res) => {
    try {
      const userData = await Users.find();
      res.json(userData);
    } catch (error) {
      res.status(500).send("Error fetching user data: " + error.message);
    }
});

employees.route("/employees").put(authenticateApiKey, authenticateToken, async (req, res) => {
  const { email, name, password, gender, role, status } = req.body;

  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(200).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (gender) user.gender = gender;
    if (role) user.role = role;
    if (status) user.status = status;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();

    res.status(201).json({ message: 'User data has been updated successfully' });
  } catch (err) {
    console.error('Error during updating:', err);

    if (err.code === 11000) {
      return res.status(200).json({ error: 'Email already in use' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

employees.delete("/employees/:id", authenticateApiKey, authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Users.findByIdAndDelete(id);

    if (!result) {
      return res.status(200).json({ error: 'Employee not found' });
    }

    res.status(201).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('Error during deleting employee:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default employees;