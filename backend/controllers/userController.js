const User = require('../models/User');

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { name, phone, password } = req.body;

        // Check if phone number is being changed and if it already exists
        if (phone && phone !== user.phone) {
            const phoneExists = await User.findOne({ phone });
            if (phoneExists) {
                return res.status(400).json({ message: 'Phone number already exists' });
            }
            user.phone = phone;
        }

        if (name) {
            user.name = name;
        }

        if (password) {
            user.password = password; // The pre('save') hook in the User model will hash this
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser.id,
            name: updatedUser.name,
            phone: updatedUser.phone,
            role: updatedUser.role,
            status: updatedUser.status,
            city: updatedUser.city,
            address: updatedUser.address
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { updateUserProfile };
