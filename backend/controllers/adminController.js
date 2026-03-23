const User = require('../models/User');
const Product = require('../models/Product');
const VendorRate = require('../models/VendorRate');
const VendorSupply = require('../models/VendorSupply');
const RecyclerDemand = require('../models/RecyclerDemand');
const City = require('../models/City');
const bcrypt = require('bcrypt');

const getPendingVendors = async (req, res) => {
    try {
        const vendors = await User.find({ role: 'vendor', status: 'pending' }).select('-password');
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const approveVendor = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user && user.role === 'vendor') {
            user.status = 'approved';
            await user.save();
            res.json({ message: 'Vendor approved', user: { _id: user._id, name: user.name, status: user.status } });
        } else {
            res.status(404).json({ message: 'Vendor not found' });
        }
    } catch (error) {
        console.error('Approve vendor error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name } = req.body;
        const productExists = await Product.findOne({ name });
        if (productExists) return res.status(400).json({ message: 'Product already exists' });
        
        const product = await Product.create({ name });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateVendorRate = async (req, res) => {
    try {
        const { product_id, city, rate } = req.body;
        const updatedRate = await VendorRate.findOneAndUpdate(
            { product_id, city },
            { rate, updatedAt: Date.now() },
            { returnDocument: 'after', upsert: true }
        ).populate('product_id', 'name');
        res.json(updatedRate);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getVendorSupply = async (req, res) => {
    try {
        const supplies = await VendorSupply.find({})
            .populate('vendor_id', 'name phone city')
            .populate('product_id', 'name');
        res.json(supplies);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getRecyclerDemand = async (req, res) => {
    try {
        const demands = await RecyclerDemand.find({})
            .populate('recycler_id', 'name phone city')
            .populate('product_id', 'name');
        res.json(demands);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createRecycler = async (req, res) => {
    try {
        const { name, phone, password, address, city, role } = req.body;
        const userExists = await User.findOne({ phone });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const newRole = role === 'admin' ? 'admin' : 'recycler';
        const user = await User.create({
            name, phone, password, role: newRole, city, address, status: 'approved'
        });
        res.status(201).json({ _id: user._id, name: user.name, phone: user.phone });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createCityAdmin = async (req, res) => {
    try {
        const { name, phone, password, address, city } = req.body;
        const userExists = await User.findOne({ phone });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({
            name, phone, password, role: 'city_admin', city, address, status: 'approved'
        });
        res.status(201).json({ _id: user._id, name: user.name, phone: user.phone });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getCityAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: 'city_admin' }).select('-password');
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createCity = async (req, res) => {
    try {
        const { name } = req.body;
        const cityExists = await City.findOne({ name });
        if (cityExists) return res.status(400).json({ message: 'City already exists' });
        
        const city = await City.create({ name });
        res.status(201).json(city);
    } catch (error) {
        console.error('Create city error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getCities = async (req, res) => {
    try {
        const cities = await City.find({});
        res.json(cities);
    } catch (error) {
        console.error('Get cities error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        
        // Cascade delete related records
        await VendorRate.deleteMany({ product_id: productId });
        await VendorSupply.deleteMany({ product_id: productId });
        await RecyclerDemand.deleteMany({ product_id: productId });
        
        // Delete the actual product
        await Product.findByIdAndDelete(productId);
        res.json({ message: 'Product and related records deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteCity = async (req, res) => {
    try {
        await City.findByIdAndDelete(req.params.id);
        res.json({ message: 'City deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteVendorSupply = async (req, res) => {
    try {
        await VendorSupply.findByIdAndDelete(req.params.id);
        res.json({ message: 'Supply record deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteRecyclerDemand = async (req, res) => {
    try {
        await RecyclerDemand.findByIdAndDelete(req.params.id);
        res.json({ message: 'Demand record deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({ phone: { $ne: '0000000000' } }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateVendorSupplyStatus = async (req, res) => {
    try {
        const { ordersCompleted, status } = req.body;
        const supply = await VendorSupply.findByIdAndUpdate(
            req.params.id,
            { ordersCompleted, status, updatedAt: Date.now() },
            { new: true }
        ).populate('vendor_id', 'name phone city').populate('product_id', 'name');
        
        if (!supply) {
            return res.status(404).json({ message: 'Supply record not found' });
        }
        res.json(supply);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateRecyclerDemandStatus = async (req, res) => {
    try {
        const { ordersCompleted, status } = req.body;
        const demand = await RecyclerDemand.findByIdAndUpdate(
            req.params.id,
            { ordersCompleted, status, updatedAt: Date.now() },
            { new: true }
        ).populate('recycler_id', 'name phone city').populate('product_id', 'name');

        if (!demand) {
            return res.status(404).json({ message: 'Demand record not found' });
        }
        res.json(demand);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getPendingVendors, approveVendor, createProduct, getProducts,
    updateVendorRate, getVendorSupply, getRecyclerDemand, createRecycler,
    createCityAdmin, getCityAdmins,
    createCity, getCities, deleteProduct, deleteCity, deleteVendorSupply,
    deleteRecyclerDemand, deleteUser, getUsers, updateVendorSupplyStatus, updateRecyclerDemandStatus
};
