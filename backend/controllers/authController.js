const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerVendor = async (req, res) => {
    const { name, phone, password, address, city } = req.body;

    try {
        const userExists = await User.findOne({ phone });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            phone,
            password,
            role: 'vendor',
            city,
            address,
            status: 'pending',
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                phone: user.phone,
                role: user.role,
                status: user.status,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const loginUser = async (req, res) => {
    const { phone, password } = req.body;

    try {
        const user = await User.findOne({ phone });

        if (user && (await user.matchPassword(password))) {
            if (user.role === 'vendor' && user.status === 'pending') {
                return res.status(403).json({ message: 'Account is pending approval from Admin.' });
            }

            res.json({
                _id: user.id,
                name: user.name,
                phone: user.phone,
                role: user.role,
                status: user.status,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'Invalid phone or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { registerVendor, loginUser };
